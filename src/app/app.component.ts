import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router} from '@angular/router';
import { UserService} from './services/user.service';
import { UiService} from './services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @HostListener('window:resize', ['$event'])   onResize(event) {
    this.adjustHeight();
  }

  @ViewChild('main') elementMain: ElementRef;

  public loggedIn:boolean = false;
  public mainheight : number;

  constructor(
    public router : Router,
    public user: UserService,
    public ui: UiService
  ) {

    this.adjustHeight();
  }

  adjustHeight(){
    this.mainheight = window.innerHeight - 200;
  }
}
