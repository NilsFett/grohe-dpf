import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable()
export class UiService {
  public view:string='customer';

  constructor(
    private user:UserService
  ) {

    this.user.loggedInStateObserver.subscribe(loggedIn => {
      console.log('UI');
      console.log(loggedIn);

      if(loggedIn){
        if(this.user.data.usertype.value == 'admin'){
          this.view = 'admin';
        }
      }
    });
  }
}
