import { Component} from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';

@Component({
  selector: 'grohe-dpf-login',
  templateUrl: './displayCompose.component.html',
  styleUrls: ['./displayCompose.component.css']
})
export class DisplayComposeComponent{
  constructor(
    public user: UserService,
    public ui: UiService
  ) {
    user.isLoggedIn = true;
    ui.view = 'admin';
  }
}
