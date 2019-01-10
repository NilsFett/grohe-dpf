import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ConfigService {
  public baseURL = 'http://groheapi.localdomain/api/';

  constructor(
  ) {
  }
}
