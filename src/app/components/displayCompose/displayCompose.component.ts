import { Component} from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DisplaysService} from '../../services/displays.service';

@Component({
  selector: 'grohe-dpf-login',
  templateUrl: './displayCompose.component.html',
  styleUrls: ['./displayCompose.component.css']
})
export class DisplayComposeComponent{
  selectedDisplayId = 0;
  selectedDisplay = null;

  constructor(
    public user: UserService,
    public ui: UiService,
    public displaysService: DisplaysService
  ) {
    user.isLoggedIn = true;
    ui.view = 'admin';
  }

  public displayChanged(event){
    this.selectedDisplayId = event;
    this.selectedDisplay = this.displaysService.displaysById[this.selectedDisplayId];
    console.log(event);
  }
}
