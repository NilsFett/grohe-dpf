import { Component} from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';


@Component({
  selector: 'grohe-dpf-login',
  templateUrl: './userrequests.component.html',
  styleUrls: ['./userrequests.component.css']
})
export class UserRequestsComponent{
  selectedDisplayId = 0;
  selectedDisplay = null;

  constructor(
    public user: UserService,
    public ui: UiService
  ) {

    ui.view = 'admin';
  }

}
