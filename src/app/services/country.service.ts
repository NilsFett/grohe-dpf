import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { ErrorService } from './error.service';
import { ApiResponseInterface } from '../interfaces/apiResponse';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CountryService {

  public data:object[];
  public dataLoaded:Subject<object[]> = new Subject<object[]>();
  public dataLoadedObserver:Observable<object[]>;
  public loaded = false;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private error: ErrorService
  ) {
    this.dataLoadedObserver = this.dataLoaded.asObservable();
    this.http.get(`${this.config.baseURL}getCountries`,{withCredentials: true}).subscribe(
      (response:object[]) => {
        console.log(response);

        this.data = response;
        this.dataLoaded.next(this.data);
      },
      error => {
        this.error.setError(error);
      }
    );
  }
}
