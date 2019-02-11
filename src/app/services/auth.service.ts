import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
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
      console.log('this.user.loggedInStateObserver.subscribe');
      console.log('loggedIn');
      console.log(loggedIn);
      this.loggedInObserver.next(loggedIn);
    });
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean | Observable<boolean> {
    console.log('AuthGuard#canActivate called');
    console.log('this.user.checked');
    console.log(this.user.checked);

    if( this.user.checked ){
      console.log('this.user.isLoggedIn');
      console.log(this.user.isLoggedIn);
      if(! this.user.isLoggedIn){
        this.router.navigate(['/login']);
      }
      /*
      this.router.navigate(['/start']);
      */
      return this.user.isLoggedIn;
    }else{
      if(this.user.checkingLogin == false){
        this.user.checkLogin();
      }

      return this.authObserver;
    }

  }
}
