import { Component} from '@angular/core';
import { UserService} from '../../services/user.service';

@Component({
  selector: 'grohe-dpf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  constructor(
    public user: UserService
  ) {

  }
}
