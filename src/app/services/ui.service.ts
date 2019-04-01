import { Injectable,EventEmitter } from '@angular/core';
import { UserService } from './user.service';
import { Image } from '../classes/Image';

@Injectable()
export class UiService {
  public view:string='customer';
  public showOverlay:boolean=false;
  public showEditNew:boolean=false;
  public showDelete:boolean=false;
  public showMedias:boolean=false;
  public saveSuccess = false;
  public deleteSuccess = false;
  public messageWindowShow = false;
  private messages:Array<String> = [];
  public imageChoosen: EventEmitter<Image> = new EventEmitter();

  constructor(
    private user:UserService
  ) {

    this.user.loggedInStateObserver.subscribe(loggedIn => {
      if(loggedIn){
        if(this.user.data.usertype.value == 'admin'){
          this.view = 'admin';
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
}
