import { Component} from '@angular/core';
import { UserService} from '../../services/user.service';

@Component({
  selector: 'grohe-dpf-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent{
  constructor(
    public user: UserService
  ) {

  }
}
