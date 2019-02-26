import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable"
import { Subject } from 'rxjs/Subject';
import { ConfigService } from './config.service';
import { ErrorService } from './error.service';
import { DisplaysPart } from '../classes/DisplaysPart';
import { ApiResponseInterface } from '../interfaces/apiResponse';

@Injectable()
export class DataService {
  public displayParts:DisplaysPart[] = null;
  public displayPartsChange:Subject<Array<DisplaysPart>>;
  private displayPartsChangeObserver:Observable<Array<DisplaysPart>>;

  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private error: ErrorService
  ) {
    this.init();
  }

  init(){
    this.displayPartsChange = new Subject<Array<DisplaysPart>>();
    this.displayPartsChangeObserver = this.displayPartsChange.asObservable();
  }

  public loadDisplayParts(){
    this.http.get(`${this.config.baseURL}getDisplayParts`,{withCredentials: true}).subscribe((displayParts:DisplaysPart[]) => {
      this.displayParts = displayParts;
      console.log(this.displayParts);
      this.displayPartsChange.next(this.displayParts);
    });
  }

  public changeDisplayPart(displayPart){
    this.http.post(`${this.config.baseURL}changeDisplayPart`, displayPart,{withCredentials: true}).subscribe(
      (response:ApiResponseInterface) => {
        console.log(response.loggedIn);
      },
      error => {
        this.error.setError(error);
      }
    );
  }
}
