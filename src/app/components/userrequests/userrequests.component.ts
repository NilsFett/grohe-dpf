import { Component} from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { ErrorService} from '../../services/error.service';
import { ApiResponseInterface } from '../../interfaces/apiResponse';

@Component({
  selector: 'grohe-dpf-login',
  templateUrl: './userrequests.component.html',
  styleUrls: ['./userrequests.component.css']
})
export class UserRequestsComponent{
  public userRequests:object[]=null;
  constructor(
    public user: UserService,
    public ui: UiService,
    private error: ErrorService
  ) {
    ui.view = 'admin';
    this.user.getUserRequests().subscribe(
        (response:any) => {
          this.userRequests = response;
        },
        error => {
          this.error.setError(error);
        }
      );
  }

  public typeChanged(user, event){
    console.log(event);
    user.usertype = event.value;
  }
  public accept(user){
    this.user.accept(user).subscribe((response:ApiResponseInterface) => {
      this.userRequests = response.data;
    },
    error => {
      this.error.setError(error);
    });
  }
}
