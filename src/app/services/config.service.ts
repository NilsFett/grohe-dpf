import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ConfigService {
  public baseURL = 'http://grohe-dpf.localdomain/api/';

  constructor(
  ) {
  }
}
