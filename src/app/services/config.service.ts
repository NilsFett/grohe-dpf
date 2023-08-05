import { Injectable, Inject } from '@angular/core';

@Injectable()
export class ConfigService {

  public baseURL = 'http://groheapi.localdomain/api/';
  // public baseURL = 'http://example.local/api/';
  // public baseURL = 'https://grohe.local/api/'; 
  static baseURL: any;



  constructor(
  ) {
  }
}
