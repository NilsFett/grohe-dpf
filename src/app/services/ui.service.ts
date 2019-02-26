import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable()
export class UiService {
  public view:string='customer';
  public showOverlay:boolean=false;

  constructor(
    private user:UserService
  ) {

    this.user.loggedInStateObserver.subscribe(loggedIn => {
      if(loggedIn){
        if(this.user.data.usertype.value == 'admin'){
          this.view = 'admin';
        }
      }
    });
  }
}
