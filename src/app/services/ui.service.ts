import { Injectable,EventEmitter,HostListener } from '@angular/core';
import { UserService } from './user.service';
import { Image } from '../classes/Image';

@Injectable()
export class UiService {
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.adjustHeight();
  }

  public view:string='customer';
  public showOverlay:boolean=false;
  public showEditNew:boolean=false;
  public showDelete:boolean=false;
  public showMedias:boolean=false;
  public saveSuccess = false;
  public deleteSuccess = false;
  public messageWindowShow = false;
  public messages:Array<String> = [];
  public imageChoosen: EventEmitter<Image> = new EventEmitter();
  public categorySelected: EventEmitter<number> = new EventEmitter();
  public res: any = {width:null,height:null}
  public navopen = true;
  public mainheight : number;
  public currentURL:string='';

  constructor(
    private user:UserService
  ) {
    this.mainheight = window.innerHeight - 20;
    this.user.loggedInStateObserver.subscribe(loggedIn => {
      if(loggedIn){
        if(this.user.data.usertype.value == 'admin'){
          //this.view = 'admin';
          this.view = 'customer';
        }
      }
    });
  }

  public doShowEditNew(){
    this.showOverlay = true;
    this.showEditNew = true;
  }

  public doCloseEditNew(){
    this.showOverlay = false;
    this.showEditNew = false;
  }

  public doShowDelete(){
    this.showOverlay = true;
    this.showDelete = true;
  }

  public doCloseDelete(){
    this.showOverlay = false;
    this.showDelete = false;
  }

  public setMessage(message:string){
    this.messages.push(message);
    this.messageWindowShow = true;
    setTimeout(()=>{
      this.messageWindowShow = false;
      this.messages = [];
    },3000)
  }

  public doShowMedias(){
    this.showMedias = true;
  }

  public doHideMedias(){
    this.showMedias = false;
  }

  public emitImageChoosen(image){
    this.imageChoosen.next(image);
  }

  public emitCategorySelected(catId){
    this.categorySelected.next(catId);
  }

  public reset(){
    this.showOverlay =false;
    this.showEditNew =false;
    this.showDelete =false;
    this.showMedias =false;
    this.saveSuccess = false;
    this.deleteSuccess = false;
    this.messageWindowShow = false;
    this.messages = [];
  }

  adjustHeight(){
    this.mainheight = window.innerHeight - 20;
    this.res = {width:window.innerWidth,height:window.innerHeight};
    if(this.res.width < 800){
      this.navopen = false;
    }
  }
}
