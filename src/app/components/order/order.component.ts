import { Component} from '@angular/core';
import { UserService} from '../../services/user.service';

@Component({
  selector: 'grohe-dpf-login',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent{
  constructor(
    public user: UserService
  ) {
    user.isLoggedIn = true;
  }
}
