import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable"
import { Subject } from 'rxjs/Subject';
import { ConfigService } from './config.service';
import { DisplaysPart } from '../classes/DisplaysPart';

@Injectable()
export class DataService {
  public displayParts:DisplaysPart[] = null;
  public displayPartsChange:Subject<Array<DisplaysPart>>;
  private displayPartsChangeObserver:Observable<Array<DisplaysPart>>;

  constructor(
    private config: ConfigService,
    private http: HttpClient
  ) {
    this.init();
  }

  init(){
    this.displayPartsChange = new Subject<Array<DisplaysPart>>();
    this.displayPartsChangeObserver = this.displayPartsChange.asObservable();
  }

  public loadDisplays(){
    this.http.get(`${this.config.baseURL}getDisplayParts`,{withCredentials: true}).subscribe((displayParts:DisplaysPart[]) => {
      this.displayParts = displayParts;
      console.log(this.displayParts);
      this.displayPartsChange.next(this.displayParts);
    });
  }
}
