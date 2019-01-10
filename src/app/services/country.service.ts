import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { ErrorService } from './error.service';
import { ApiResponseInterface } from '../interfaces/apiResponse';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CountryService {

  public data:object;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private error: ErrorService
  ) {
    this.http.get(`${this.config.baseURL}getCountries`,{withCredentials: true}).subscribe(
      (response:ApiResponseInterface) => {
        if(response.loggedIn){
          this.data = response.data;
        }
      },
      error => {
        this.error.setError(error);
      }
    );
  }
}
