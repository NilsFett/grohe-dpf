import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable"
import { Subject } from 'rxjs/Subject';
import { ConfigService } from './config.service';
import { UiService } from './ui.service';
import { ErrorService } from './error.service';
import { DisplaysPart } from '../classes/DisplaysPart';
import { Article } from '../classes/Article';
import { ApiResponseInterface } from '../interfaces/apiResponse';

@Injectable()
export class DataService {
  public displayParts:DisplaysPart[] = null;
  public displayPartsChange:Subject<Array<DisplaysPart>>;
  private displayPartsChangeObserver:Observable<Array<DisplaysPart>>;

  public articles:Article[] = null;
  public articlesChange:Subject<Array<Article>>;
  private articlesChangeObserver:Observable<Array<Article>>;

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

    this.articlesChange = new Subject<Array<Article>>();
    this.articlesChangeObserver = this.articlesChange.asObservable();
  }

  public loadArticles(){
    this.http.get(`${this.config.baseURL}getArticles`,{withCredentials: true}).subscribe((articles:Article[]) => {
      this.articles = articles;
      this.articlesChange.next(this.articles);
    });
  }

  public loadDisplayParts(){
    this.http.get(`${this.config.baseURL}getDisplayParts`,{withCredentials: true}).subscribe((displayParts:DisplaysPart[]) => {
      this.displayParts = displayParts;
      this.displayPartsChange.next(this.displayParts);
    });
  }

  public changeDisplayPart(displayPart){
    this.http.post(`${this.config.baseURL}changeDisplayPart`, displayPart,{withCredentials: true}).subscribe(
      (displayParts:DisplaysPart[]) => {
        this.displayParts = displayParts;
        this.displayPartsChange.next(this.displayParts);
        this.ui.saveSuccess = true;
      },
      error => {
        this.error.setError(error);
      }
    );
  }

  public changeArticle(dataSet){
    this.http.post(`${this.config.baseURL}changeArticle`, dataSet,{withCredentials: true}).subscribe(
      (articles:Article[]) => {
        this.articles = articles;
        this.articlesChange.next(this.articles);
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

  public deleteArticle(dataSet){
    this.http.post(`${this.config.baseURL}deleteArticle`, dataSet,{withCredentials: true}).subscribe(
      (articles:Article[]) => {
        this.articles = articles;
        this.articlesChange.next(this.articles);
        this.ui.deleteSuccess = true;
      },
      error => {
        this.error.setError(error);
      }
    );
  }
}
