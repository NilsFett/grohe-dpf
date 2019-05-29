import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ConfigService {

  //public baseURL = 'http://groheapi.localdomain/api/';
  //public baseURL = 'http://grohe-dpf.localdomain/api/';
  public baseURL = 'https://grohe.hoehne-media.de/api/';

  constructor(
  ) {
  }
}
