import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { UserService} from './user.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  loggedInObserver = null;
  authObserver = null;

  constructor(
    public user: UserService,
    private router: Router
  ){
    this.authObserver =  new Observable((observer) => {
      this.loggedInObserver = observer;
    });
    this.user.loggedInStateObserver.subscribe( loggedIn => {
      if(this.loggedInObserver){
        this.loggedInObserver.next(loggedIn);
      }

    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean | Observable<boolean> {
    if( this.user.checked ){
      return this.user.isLoggedIn;
    }else{
      if(this.user.checkingLogin == false){
        this.user.checkLogin();
      }
      return this.authObserver;
    }

  }
}
