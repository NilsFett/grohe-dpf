import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ConfigService {

  // Same-origin: the SPA and the PHP backend are served from one domain via
  // Traefik (the app at '/', the API under '/api'). A relative base URL keeps
  // requests on the current origin, so no CORS and no cross-site cookies.
  public baseURL = '/api/';
  // public baseURL = 'https://groheapi.localdomain/api/'; // legacy cross-origin setup
  static baseURL: any;



  constructor(
  ) {
  }
}
