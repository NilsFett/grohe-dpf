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
import { User } from '../classes/User';
import { Dp } from '../classes/Dp';
import { UserService } from './user.service';

@Injectable()
export class DataService {
  public displayParts: DisplaysPart[] = null;
  public displayPartsChange: Subject<Array<DisplaysPart>>;
  private displayPartsChangeObserver: Observable<Array<DisplaysPart>>;

  public dps: Dp[] = null;
  public dpsChange: Subject<Array<Dp>>;
  private dpsObserver: Observable<Array<Dp>>;

  public articles: Article[] = null;
  public articlesChange: Subject<Array<Article>>;
  private articlesChangeObserver: Observable<Array<Article>>;

  public users: User[] = null;
  public userChange: Subject<Array<User>>;
  private userChangeObserver: Observable<Array<User>>;

  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private error: ErrorService,
    private ui: UiService
  ) {
    this.init();
  }

  init() {
    this.displayPartsChange = new Subject<Array<DisplaysPart>>();
    this.displayPartsChangeObserver = this.displayPartsChange.asObservable();

    this.dpsChange = new Subject<Array<Dp>>();
    this.dpsObserver = this.dpsChange.asObservable();

    this.articlesChange = new Subject<Array<Article>>();
    this.articlesChangeObserver = this.articlesChange.asObservable();

    this.userChange = new Subject<Array<User>>();
    this.userChangeObserver = this.userChange.asObservable();
  }

  public loadUsers() {
    this.http.get(`${this.config.baseURL}getUsers`, { withCredentials: true }).subscribe((users: User[]) => {
      this.users = users;
      this.userChange.next(this.users);
    });
  }

  async getUsers() {
    var u:any;
    await this.http.get(`${this.config.baseURL}getUsers`, { withCredentials: true })
      .toPromise().then(
        (users) => {
          u=users;
        }).catch((err) => {
          console.log(err);
        });
        return u;
  }

  async getProductTrees() {
    var u:any;
    await this.http.get(`${this.config.baseURL}productTree`, { withCredentials: true })
      .toPromise().then(
        (users) => {
          u=users;
        }).catch((err) => {
          console.log(err);
        });
        return u;
  }

  


  public loadArticles() {
    this.http.get(`${this.config.baseURL}getArticles`, { withCredentials: true }).subscribe((articles: Article[]) => {
      this.articles = articles;
      this.articlesChange.next(this.articles);
    });
  }

  public loadDisplayParts() {
    this.http.get(`${this.config.baseURL}getDisplayParts`, { withCredentials: true }).subscribe((displayParts: DisplaysPart[]) => {
      this.displayParts = displayParts;
      this.displayPartsChange.next(this.displayParts);
    });
  }

  public loadDps() {
    this.http.get(`${this.config.baseURL}getArticles`, { withCredentials: true }).subscribe((dps: Dp[]) => {
      this.dps = dps;
      this.dpsChange.next(this.dps);
    });
  }

  public changeDisplayPart(displayPart) {
    this.http.post(`${this.config.baseURL}changeDisplayPart`, displayPart, { withCredentials: true }).subscribe(
      (response: ApiResponseInterface) => {
        console.log(response.loggedIn);
        this.ui.saveSuccess = true;
      },
      error => {
        this.error.setError(error);
      }
    );
  }

  public changeArticle(dataSet) {
    this.http.post(`${this.config.baseURL}changeArticle`, dataSet, { withCredentials: true }).subscribe(
      (response: ApiResponseInterface) => {
        console.log(response.loggedIn);
        this.ui.saveSuccess = true;
      },
      error => {
        this.error.setError(error);
      }
    );
  }

  public deleteDisplayPart(displayPart) {
    this.http.post(`${this.config.baseURL}deleteDisplayPart`, displayPart, { withCredentials: true }).subscribe(
      (displayParts: DisplaysPart[]) => {
        this.displayParts = displayParts;
        this.displayPartsChange.next(this.displayParts);
        this.ui.deleteSuccess = true;
      },
      error => {
        this.error.setError(error);
      }
    );
  }

  public deleteArticle(dataSet) {
    this.http.post(`${this.config.baseURL}deleteArticle`, dataSet, { withCredentials: true }).subscribe(
      (articles: Article[]) => {
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
