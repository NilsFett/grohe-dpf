import { Injectable } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable"
import { Subject } from 'rxjs/Subject';

import { ConfigService } from './config.service';

import { Displays } from '../classes/displays';


@Injectable()
export class DisplaysService {
  public displays;
  public displaysById;
  public displaysChanged;
  public displaysChangedObserver;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
    this.displays = [];
    this.displaysById = {};
    this.init();
  }

  init(){
    this.displaysChanged = new Subject<Array<Displays>>();
    this.displaysChangedObserver = this.displaysChanged.asObservable();

    this.http.get(`${this.config.baseURL}/getDisplays`).subscribe((response:any) => {
      this.displays = response;

      let i = 0;
      for(i; i < this.displays.length; i++){
        this.displaysById[this.displays[i].id] = this.displays[i];
      }

      console.log(response);
    });
  }

  public getDisplays(){
    return this.displays;
  }

  public getDisplaysChangedObserver(){
    return this.displaysChangedObserver;
  }

}
