import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { ErrorService } from './error.service';
import { ApiResponseInterface } from '../interfaces/apiResponse';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserService {
  public isLoggedIn:boolean=false;
  public loggedInState:Subject<boolean>;
  public loggedInStateObserver:Observable<boolean>;



  public data:object;
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private error: ErrorService
  ) {
    this.loggedInState = new Subject<boolean>();
    this.loggedInStateObserver = this.loggedInState.asObservable();
    this.http.get(`${this.config.baseURL}isLoggedIn`,{withCredentials: true}).subscribe(
      (response:ApiResponseInterface) => {
        if(response.loggedIn){
          this.isLoggedIn = true;
          this.data = response.data;
          this.loggedInState.next(true);
        }
        else{
          this.loggedInState.next(false);
        }
      },
      error => {
        this.error.setError(error);
      }
    );
  }

  public login(email, passwd){
    this.http.post(`${this.config.baseURL}login`, {email:email, passwd:passwd},{withCredentials: true}).subscribe(
      (response:ApiResponseInterface) => {
        console.log('response');
        console.log(response);

        if(response.loggedIn){
          this.isLoggedIn = true;
          this.data = response.data;
          this.loggedInState.next(true);
        }
        else{
          this.loggedInState.next(false);
        }
      },
      error => {
        this.error.setError(error);
      }
    );
  }

  public logout(){
    this.http.get(`${this.config.baseURL}logout`,{withCredentials: true}).subscribe(
      (response:ApiResponseInterface) => {
        console.log('response');
        console.log(response);

        if(response.loggedIn){
          this.isLoggedIn = true;
          this.data = response.data;
          this.loggedInState.next(true);
        }
        else{
          this.loggedInState.next(false);
        }
      },
      error => {
        this.error.setError(error);
      }
    );
  }
}
