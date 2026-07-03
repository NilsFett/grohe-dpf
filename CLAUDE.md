# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Grohe DPF ("Display Promotion Form") is an internal ordering/admin tool for Grohe promotional displays.
It has two independently-deployed halves living in one repo:

- **`src/`** — an Angular 16 single-page app (the UI), generated originally with Angular CLI 7.
- **`api/`** — a hand-rolled PHP MVC backend (PDO/MySQL) that the SPA calls over HTTP. No framework, no Composer.

The two communicate only via JSON over HTTP with session cookies (`withCredentials: true`).

## Commands

Frontend (run from repo root):

```bash
npm start          # ng serve over SSL (uses certs/) — sets NODE_OPTIONS=--openssl-legacy-provider
npm run build      # ng build → dist/grohe-dpf  (add -- --configuration production for prod)
npm test           # Karma + Jasmine unit tests (*.spec.ts)
npm run lint       # TSLint (codelyzer) — note: TSLint is deprecated upstream
npm run e2e        # Protractor end-to-end tests (e2e/)
ng test --include='**/login.component.spec.ts'   # run a single test file
```

`npm start` serves HTTPS via `certs/localhost.{key,crt}`. The legacy OpenSSL flag is required because of the old build toolchain; don't remove it.

The PHP backend has no build step. It runs under a webserver with PHP + the `pdo_mysql` extension; point a vhost at `api/` as document root.

**Docker:** the full stack (Traefik + PHP + Angular + MariaDB) runs via `docker compose up -d --build` — see `DOCKER.md`. It serves everything from one domain (`/` = SPA, `/api` = backend) behind Traefik with Let's Encrypt TLS. The backend config files read DB credentials / base path / cookie domain from env vars (set in `docker-compose.yml`) with fallback to the original hardcoded values, and `config.service.ts` uses a relative `/api/` base URL.

## Frontend architecture

Single `AppModule` (`src/app/app.module.ts`) — no lazy-loaded feature modules. Everything (components, pipes, directives, services) is declared/provided there. Angular Material is used for UI.

**Routing** (`src/app/app-routing.module.ts`): flat route table. Every route except login/register/passwordReset is protected by `AuthGuard` (`services/auth.service.ts`). The guard does *not* read a synchronous flag — on first navigation it kicks off `UserService.checkLogin()` (an HTTP round-trip to the API) and returns an Observable that resolves once the login state arrives. Auth is entirely server-session based; there is no token in the client.

**Data flow — this is the central pattern.** `DataService` (`services/data.service.ts`) is the single hub for all domain data (displays, articles, products, users, orders, top signs, promotion images, images, categories). For each entity it holds:
- a public cached array (e.g. `this.products`)
- a `Subject` named `<entity>Change` that it `.next()`s after every load/change/delete

Components **do not** call HTTP directly. They subscribe to the relevant `<entity>Change` Subject and call `DataService.load*/change*/delete*`. Mutations re-fetch the full list from the API and the response replaces the cached array, so the server response is the source of truth. Save/delete also drive UI side-effects through `UiService` (`setMessage`, `doCloseEditNew`, `doCloseDelete`) and emit `saveSuccess`/`deleteSuccess`. When adding a new entity, follow this same triple (cache + Subject + load/change/delete methods) rather than introducing per-component HTTP calls.

**API base URL** is hardcoded in `services/config.service.ts` (`baseURL`), not in `environments/`. The `environment.ts` files exist but are largely unused for the API endpoint — change `config.service.ts` to repoint the backend. Endpoints are appended directly to `baseURL` (e.g. `${baseURL}getProducts?id=...`).

`classes/` holds plain TS data classes mirroring API rows; `pipes/<entity>/` holds per-entity list filter pipes used by the list views; `components/directives/` holds `dpf-*` layout/validation directives.

## Backend architecture (`api/`)

Front controller pattern, all requests enter through **`api/index.php`**:

1. Starts a session (cross-site cookie config: `SameSite=None; Secure`), short-circuits `OPTIONS` (CORS preflight).
2. Registers an autoloader (`autoloader.php`) that resolves class names by convention against `classes/ → models/ → controllers/ → views/`, then `libs/` (namespaced, incl. PhpSpreadsheet).
3. `cSystem::init()` does **DB-driven routing**: it strips `/api` from the request URI and looks up the matching row in the `actions` DB table (via `cActionsModel::getActionsByEnviromentName`) to resolve an action name. The environment is chosen from `HTTP_HOST` via `cConfig`'s `hosts` map.
4. It then calls `c<Environment>Controller::getInstance()->{$action}()`. In practice the environment is `groheapi`, so all endpoints are methods on **`controllers/cGroheapiController.php`** — that one file is the API surface (login, register, get*/load*/change*/delete*, storeOrder/finishOrder, uploadImage, orderExport, etc.). Each method reads JSON from `php://input`, talks to models, and `echo`s `json_encode(...)`.

**Adding an endpoint requires two steps**: add the method to `cGroheapiController`, *and* add a row to the `actions` table mapping the URL to that method name. Routing is data, not code — a new controller method alone is not reachable.

**Models (`models/`)** are an active-record-style base `cModel` (extends `cDatabase`). Each model declares `static $sTable`, `$sPrimary`, and an `$aColumns` map (`value`/`type` per column). `cModel` provides `get/set/save/delete/getAll/data/getValuesArray` and builds prepared INSERT/UPDATE from `$aColumns`. `?debug=1` on a request prints the generated SQL. `cDatabase` opens a persistent PDO MySQL connection using credentials from `cConfig`.

**`cSessionUser`** (extends `cUserModel`) is the server-side current-user singleton, resolved from session id + a long-lived `<env>_user` cookie. Controller methods return `loggedIn` + user `data()` so the SPA can sync auth state.

## Configuration & secrets

`api/cConfig.php` is a checked-in singleton holding **DB credentials, host→environment map, base paths, and sender email** — all hardcoded and environment-specific (it currently points at a local `grohe-dpf` MySQL DB and an absolute `basepath` under `/home/nils/...`). Treat this file as per-deployment config: update `dbname`/`user`/`password`/`host`, the `hosts` map, and `basepath` when moving environments. Do not assume these values are portable.

The repo root contains large SQL dumps (`grohe.sql`, `usr_p197636_3.sql`, `patch.sql`, `api/dump_*.sql`) — these are the schema + seed data (including the `actions` and `enviroments` routing tables). Import one to stand up a working backend DB.

## Conventions

- PHP classes are prefixed `c` (`cSystem`, `cUserModel`, `cGroheapiController`); models `c*Model`, relation/join tables/models use `cR*` / `r_*` table names.
- Angular component selectors use the `app` prefix; custom directives use the `dpf-` prefix.
- Backend uses singletons heavily (`getInstance()`); most stateful classes are singletons.
- Some code comments and user-facing messages are in German.
