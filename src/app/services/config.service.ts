import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ConfigService {
  public baseURL = 'http://groheapi.localdomain/api/';
  //public baseURL = 'http://grohe2.hoehne-media.de/api/';

  constructor(
  ) {
  }
}
