import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { ErrorService } from './error.service';
import { ApiResponseInterface } from '../interfaces/apiResponse';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Router, NavigationEnd } from '@angular/router';

@Injectable()
export class UserService {
  public isLoggedIn:boolean=false;
  public checked:boolean=false;
  public checkingLogin:boolean=false;
  public logginIncorrect = false;
  public loggedInState:Subject<boolean>;
  public loggedInStateObserver:Observable<boolean>;
  public data:any;
  public userRequests:object[] = null;
  public initials:string = '';

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private error: ErrorService,
    private router: Router
  ) {
    this.loggedInState = new Subject<boolean>();
    this.loggedInStateObserver = this.loggedInState.asObservable();

    this.router.events.subscribe((val) => {
      if( val instanceof NavigationEnd){
        this.checked = false;

      }
    });
    this.checkLogin();
  }

  public checkLogin(){
    if(this.checkingLogin)return;
    this.checkingLogin = true;
    console.log('CHECK LOGIN');
    this.http.get(`${this.config.baseURL}isLoggedIn`,{withCredentials: true}).subscribe(
      (response:ApiResponseInterface) => {
        console.log('response');
        console.log(response.loggedIn);
        if(response.loggedIn){

          if( this.router.url == '/' || this.router.url == '/login' || this.router.url == '/register' || this.router.url == '/passwordReset'){

            console.log('REDIRECT TO START');
            console.log(this.router);
            this.router.navigate(['/start']);
          }
          this.data = response.data;
          this.isLoggedIn = true;
          this.initials = this.data.name.value.charAt(0)+this.data.surname.value.charAt(0);
          this.loggedInState.next(true);
        }
        else{
            this.isLoggedIn = false;
            this.loggedInState.next(false);
        }
        this.checked = true;
        this.checkingLogin = false;
      },
      error => {
        console.log(error);
        this.error.setError(error);
      }
    );
  }

  public login(email, passwd){
    this.checkingLogin = true;
    this.http.post(`${this.config.baseURL}login`, {email:email, passwd:passwd},{withCredentials: true}).subscribe(
      (response:ApiResponseInterface) => {
        if(response.loggedIn){
          this.data = response.data;
          if( ! this.isLoggedIn ){
            this.isLoggedIn = true;
            this.initials = this.data.name.value.charAt(0)+this.data.surname.value.charAt(0);
            this.loggedInState.next(true);
          }

          this.logginIncorrect = false;
        }
        else{
          if( this.isLoggedIn ){
            this.isLoggedIn = false;
            this.loggedInState.next(false);
          }
          this.logginIncorrect = true;
        }
        this.checked = true;
        this.checkingLogin = false;
      },
      error => {
        this.error.setError(error);
      }
    );
  }

  public logout(){
    this.checkingLogin = true;
    this.http.get(`${this.config.baseURL}logout`,{withCredentials: true}).subscribe(
      (response:ApiResponseInterface) => {
        console.log('response');
        console.log(response);

        if(response.loggedIn){
          if( ! this.isLoggedIn ){
            this.isLoggedIn = true;
            this.loggedInState.next(true);
          }
          this.data = response.data;
          this.initials = this.data.name.value.charAt(0)+this.data.surname.value.charAt(0);
        }
        else{
          if( this.isLoggedIn ){
            this.isLoggedIn = false;
            this.loggedInState.next(false);
          }
        }
        this.checked = true;
        this.checkingLogin = false;
      },
      error => {
        this.error.setError(error);
      }
    );
  }

  public register(data){
    return this.http.post(`${this.config.baseURL}register`, data,{withCredentials: true});
  }

  public passwordReset(data){
    return this.http.post(`${this.config.baseURL}passwordReset`, data,{withCredentials: true});
  }

  public getUserRequests(){
    return this.http.get(`${this.config.baseURL}getUserRequests`, {withCredentials: true});
  }

  public accept(user){
    return this.http.post(`${this.config.baseURL}acceptUserRequest`, user, {withCredentials: true});
  }

  public decline(user){
    return this.http.post(`${this.config.baseURL}declineUserRequest`, user, {withCredentials: true});
  }

}
