import { Component, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
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

  private currentURL:string = null;

  constructor(
    public router : Router,
    public user: UserService,
    public error: ErrorService,
    public ui: UiService
  ) {
    this.router.events.subscribe(
      (navEnd:NavigationEnd) => {
        if(navEnd.urlAfterRedirects){
          this.currentURL = navEnd.urlAfterRedirects;
          if(this.user.checked){
            this.checkRedirect();
          }
        }
      },
      (navStart:NavigationStart) => {
        this.currentURL = null;
      }
    );
    this.user.loggedInStateObserver.subscribe(loggedIn => {

      if(this.currentURL){
        this.checkRedirect();
      }

    });
    this.user.checkLogin();
    this.mainheight = window.innerHeight - 20;
    this.res = {width:window.innerWidth,height:window.innerHeight};
    if(this.res.width < 800){
      this.navopen = false;
    }
  }

  private checkRedirect(){
    if(this.user.isLoggedIn){
      if(this.currentURL == '/' || this.currentURL == '/login' || this.currentURL == '/passwordReset' || this.currentURL == '/register' || this.currentURL == '/start'){
        this.router.navigate(['/order2']);
      }
    }
    else{
      if( ! (this.currentURL == '/' || this.currentURL== '/login' || this.currentURL == '/passwordReset' || this.currentURL == '/register') ){
        this.router.navigate(['/login']);
      }
    }
  }

  ngAfterViewInit(){
    this.adjustHeight();// = window.innerHeight - 80;
  }

  adjustHeight(){
    this.mainheight = window.innerHeight - 20;
    this.res = {width:window.innerWidth,height:window.innerHeight};
    if(this.res.width < 800){
      this.navopen = false;
    }
  }

  openclosenav(){
    this.navopen = !this.navopen;
  }

  navClicked(event){
    if(this.res.width < 800){
      this.navopen = false;
    }
    event.stopPropagation();
  }

  public userInfoOpenClicked(event){
    event.stopPropagation();
    this.userInfoOpen = ! this.userInfoOpen;
  }

  public clicked(){
    if(this.userInfoOpen)this.userInfoOpen = false;
  }
}
