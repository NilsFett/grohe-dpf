# Docker environment

Runs the whole app behind Traefik. TLS depends on `ENVIRONMENT` (see `.env`):

- **develop** — Traefik serves a **self-signed** certificate that the
  `traefik-certgen` init step generates for your `DOMAIN` on first `up`
  (into the git-ignored `docker/traefik/certs/`). No public domain or open ports
  needed; your browser will warn about the cert (click through). Set
  `ENVIRONMENT=develop` and leave `CERT_RESOLVER` empty.
- **production** — Traefik obtains a real **Let's Encrypt** certificate. Set
  `ENVIRONMENT=production`, `CERT_RESOLVER=le`, plus a reachable `DOMAIN` and
  `ACME_EMAIL`.

In production the layout is:

```
                 :80  ─redirect→  :443
  Internet ──▶ Traefik ──┬─ Host(DOMAIN) && PathPrefix(/api) ─▶ php  (Apache + PHP 8.2)
                         └─ Host(DOMAIN)                      ─▶ node (ng serve :4200)
                                                                 php ─▶ db (MariaDB)
```

Everything is served from **one domain** (`https://DOMAIN/` = SPA, `https://DOMAIN/api/` = backend),
so requests are same-origin — no CORS and no cross-site cookies.

## Services

| Service           | What it is                              | Exposed                         |
|-------------------|-----------------------------------------|---------------------------------|
| `traefik-certgen` | Init: generates the dev self-signed cert | none (runs once, then exits)    |
| `traefik`         | Reverse proxy, HTTP→HTTPS, ACME TLS     | ports 80, 443                   |
| `php`     | `api/` on Apache + PHP 8.2 (PDO)    | internal, via Traefik at `/api` |
| `node`    | Angular dev server (`ng serve`)     | internal, via Traefik at `/`    |
| `db`      | MariaDB 10.11, imports `grohe.sql`  | internal only                   |

## TLS modes

**develop (self-signed)** — works fully offline/local, no DNS or open ports:

```bash
cp .env.example .env     # ENVIRONMENT=develop, CERT_RESOLVER empty (the defaults)
                         # set DOMAIN (e.g. grohe-dpf.localhost) and the DB_* passwords
docker compose up -d --build
```

On first `up` the `traefik-certgen` service generates a self-signed cert for
`DOMAIN` (it skips if one already exists), and Traefik registers it as its default
cert via `docker/traefik/dynamic/tls.yml`. Routers run with `tls=true` and an empty
`certresolver`, so Traefik serves that default cert. The browser shows a
self-signed-cert warning; accept it.

To regenerate (e.g. after changing `DOMAIN`), delete the cert and bring the stack
back up — `traefik-certgen` recreates it:

```bash
rm -f docker/traefik/certs/default.crt docker/traefik/certs/default.key
docker compose up -d
```

**production (Let's Encrypt)** requires:

- A **real public domain** whose DNS A/AAAA record points to this host.
- Ports **80 and 443 reachable from the internet** (ACME uses an HTTP-01 challenge on port 80).
- In `.env`: `ENVIRONMENT=production`, `CERT_RESOLVER=le`, plus `DOMAIN` and `ACME_EMAIL`.

## Usage

```bash
cp .env.example .env     # edit ENVIRONMENT/CERT_RESOLVER, DOMAIN, ACME_EMAIL, DB_* passwords
docker compose up -d --build
docker compose logs -f   # watch first boot: DB import, npm install, ng serve, TLS
```

First boot takes a while: MariaDB imports `grohe.sql`, the node container runs `npm install`,
and Traefik fetches the certificate. The app is ready once `ng serve` prints
`Compiled successfully` and Traefik has the cert.

Then open `https://DOMAIN/`.

Tear down (keep DB data): `docker compose down`
Wipe everything incl. the database: `docker compose down -v`

## Notes & caveats

- **DB import runs only once** — on the very first boot while the `dbdata` volume is empty.
  To re-import, run `docker compose down -v` first. To use the other dump, point the
  `grohe.sql` mount in `docker-compose.yml` at `usr_p197636_3.sql`.
- **`ng serve` is a dev server**, not a production build. It matches the requested
  "node container" and gives hot reload, but for a real production deployment you'd
  swap it for `ng build` served by a static server (e.g. nginx). Live-reload over the
  proxy uses a websocket; if it doesn't reconnect, a manual refresh still works.
- **Config is environment-driven.** `api/cConfig.php`, `api/index.php` and
  `api/classes/cSessionUser.php` now read DB credentials, base path and the cookie
  domain from env vars (set in `docker-compose.yml`), falling back to the original
  hardcoded local values when unset. Note `api/cConfig.php` is git-ignored, so these
  edits stay local — keep them when redeploying.
- **Uploads** (`api/uploads`) are bind-mounted from the host; they must be writable by
  the container's `www-data`. If uploads fail with permission errors:
  `docker compose exec php chown -R www-data:www-data /var/www/html/api/uploads`.
- The Angular API base URL is now relative (`/api/`, in `src/app/services/config.service.ts`),
  so the frontend follows whatever domain Traefik serves it on.
