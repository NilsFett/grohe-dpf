import { Component } from '@angular/core';
import { Router} from '@angular/router';
import { UserService} from './services/user.service';
import { UiService} from './services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public loggedIn:boolean = false;
  constructor(
    public router : Router,
    public user: UserService,
    public ui: UiService
  ) {

  }
}
