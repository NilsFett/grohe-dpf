import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable"
import { Subject } from 'rxjs/Subject';
import { ConfigService } from './config.service';
import { UiService } from './ui.service';
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
    private error: ErrorService,
    private ui: UiService
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
      this.displayPartsChange.next(this.displayParts);
    });
  }

  public changeDisplayPart(displayPart){
    this.http.post(`${this.config.baseURL}changeDisplayPart`, displayPart,{withCredentials: true}).subscribe(
      (response:ApiResponseInterface) => {
        console.log(response.loggedIn);
        this.ui.saveSuccess = true;
      },
      error => {
        this.error.setError(error);
      }
    );
  }

  public deleteDisplayPart(displayPart){
    this.http.post(`${this.config.baseURL}deleteDisplayPart`, displayPart,{withCredentials: true}).subscribe(
      (displayParts:DisplaysPart[]) => {
        this.displayParts = displayParts;
        this.displayPartsChange.next(this.displayParts);
        this.ui.deleteSuccess = true;
      },
      error => {
        this.error.setError(error);
      }
    );
  }
}
