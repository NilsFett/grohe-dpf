import { Component, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { Router} from '@angular/router';
import { UserService} from './services/user.service';
import { ErrorService} from './services/error.service';
import { UiService} from './services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit{
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.adjustHeight();
  }
  @ViewChild('main') main: ElementRef;

  public loggedIn:boolean = false;
  public mainheight : number;
  public res: any = {width:null,height:null}
  public navopen = true;
  public overflow:boolean;
  public userInfoOpen:boolean = false;

  constructor(
    public router : Router,
    public user: UserService,
    public error: ErrorService,
    public ui: UiService
  ) {
    this.user.loggedInStateObserver.subscribe(loggedIn => {
      if(loggedIn){

      }
      else{
        this.router.navigate(['/login']);
      }
    });
    this.mainheight = window.innerHeight - 20;
    this.res = {width:window.innerWidth,height:window.innerHeight};
    if(this.res.width < 800){
      this.navopen = false;
    }
  }

  ngAfterViewInit(){
    this.adjustHeight();// = window.innerHeight - 80;
  }

  adjustHeight(){
    this.mainheight = window.innerHeight - 20;
    this.res = {width:window.innerWidth,height:window.innerHeight};
  }

  openclosenav(){
    this.navopen = !this.navopen;
  }
}
