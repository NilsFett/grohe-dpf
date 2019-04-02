import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable"
import { Subject } from 'rxjs/Subject';
import { ConfigService } from './config.service';
import { UiService } from './ui.service';
import { ErrorService } from './error.service';
import { DisplaysPart } from '../classes/DisplaysPart';
import { Display } from '../classes/display';

import { Article } from '../classes/Article';
import { TopSign } from '../classes/TopSign';

import { Product } from '../classes/Product';
import { ApiResponseInterface } from '../interfaces/apiResponse';
import { User } from '../classes/User';
import { Image } from '../classes/Image';
import { UserService } from './user.service';

@Injectable()
export class DataService {
  public displayParts: DisplaysPart[] = null;
  public displayPartsChange: Subject<Array<DisplaysPart>>;
  private displayPartsChangeObserver: Observable<Array<DisplaysPart>>;

  public displays: Display[] = null;
  public displaysChange: Subject<Array<Display>>;
  private displaysChangeObserver: Observable<Array<Display>>;

  public articles: Article[] = null;
  public articlesChange: Subject<Array<Article>>;
  private articlesChangeObserver: Observable<Array<Article>>;

  public topSigns: TopSign[] = null;
  public topSignsChange: Subject<Array<TopSign>>;
  private topSignsChangeObserver: Observable<Array<TopSign>>;

  public products: Product[] = null;
  public productsChange: Subject<Array<Product>>;
  private productsChangeObserver: Observable<Array<Product>>;

  public users: User[] = null;
  public userChange: Subject<Array<User>>;
  private userChangeObserver: Observable<Array<User>>;

  public images: Image[] = null;
  public imagesChange: Subject<Array<Image>>;
  private imagesChangeObserver: Observable<Array<Image>>;

  public displayPartsByDisplayId: Array<Array<DisplaysPart>> = [];
  public displayPartsByDisplayIdChange: Subject<Array<DisplaysPart>>;
  private displayPartsByDisplayIdChangeObserver: Observable<Array<DisplaysPart>>;

  public saveSuccess: EventEmitter<boolean> = new EventEmitter();
  public deleteSuccess: EventEmitter<boolean> = new EventEmitter();

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

    this.displaysChange = new Subject<Array<Display>>();
    this.displaysChangeObserver = this.displaysChange.asObservable();

    this.articlesChange = new Subject<Array<Article>>();
    this.articlesChangeObserver = this.articlesChange.asObservable();

    this.topSignsChange = new Subject<Array<TopSign>>();
    this.topSignsChangeObserver = this.topSignsChange.asObservable();

    this.productsChange = new Subject<Array<Product>>();
    this.productsChangeObserver = this.productsChange.asObservable();

    this.userChange = new Subject<Array<User>>();
    this.userChangeObserver = this.userChange.asObservable();

    this.imagesChange = new Subject<Array<Image>>();
    this.imagesChangeObserver = this.imagesChange.asObservable();

    this.displayPartsByDisplayIdChange = new Subject<Array<DisplaysPart>>();
    this.displayPartsByDisplayIdChangeObserver = this.displayPartsByDisplayIdChange.asObservable();
  }

  public loadUsers() {
    this.http.get(`${this.config.baseURL}getUsers`, { withCredentials: true }).subscribe((users: User[]) => {
      this.users = users;
      this.userChange.next(this.users);
    });
  }

  public loadImages() {
    this.http.get(`${this.config.baseURL}loadImages`, { withCredentials: true }).subscribe((images: Image[]) => {
      this.images = images;
      this.imagesChange.next(this.images);
    });
  }

/*
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
*/
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

  public loadTopSigns() {
    this.http.get(`${this.config.baseURL}loadTopSigns`, { withCredentials: true }).subscribe((topSigns: TopSign[]) => {
      this.topSigns = topSigns;
      this.topSignsChange.next(this.topSigns);
    });
  }

  public loadProducts() {
    this.http.get(`${this.config.baseURL}getProducts`, { withCredentials: true }).subscribe((products: Product[]) => {
      this.products = products;
      this.productsChange.next(this.products);
    });
  }

  public loadDisplayParts() {
    this.http.get(`${this.config.baseURL}getDisplayParts`, { withCredentials: true }).subscribe((displayParts: DisplaysPart[]) => {
      this.displayParts = displayParts;
      this.displayPartsChange.next(this.displayParts);
    });
  }

  public loadDisplays() {
    this.http.get(`${this.config.baseURL}getDisplays`, { withCredentials: true }).subscribe((displays: Display[]) => {
      this.displays = displays;
      this.displaysChange.next(this.displays);
    });
  }

  public loadDisplasPartsByDisplayId(displayId) {
    this.http.get(`${this.config.baseURL}loadDisplasPartsByDisplayId?display_id=${displayId}`, { withCredentials: true }).subscribe((displayParts: DisplaysPart[]) => {
      this.displayPartsByDisplayId[displayId] = displayParts;
      this.displayPartsByDisplayIdChange.next(this.displayPartsByDisplayId[displayId]);
    });
  }

  public changeDisplayPart(displayPart) {
    this.http.post(`${this.config.baseURL}changeDisplayPart`, displayPart, { withCredentials: true }).subscribe(
      (displayParts: DisplaysPart[]) => {
        this.displayParts = displayParts;
        this.displayPartsChange.next(this.displayParts);
        this.ui.setMessage('Save success');
        this.ui.doCloseEditNew();
        this.saveSuccess.next(true)
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
      }
    );
  }

  public changeTopSign(topSign) {
    this.http.post(`${this.config.baseURL}changeTopSign`, topSign, { withCredentials: true }).subscribe(
      (topSigns: TopSigns[]) => {
        this.topSigns = topSigns;
        this.topSignsChange.next(this.topSigns);
        this.ui.setMessage('Save success');
        this.ui.doCloseEditNew();
        this.saveSuccess.next(true)
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
      }
    );
  }

  public changeArticle(dataSet) {
    this.http.post(`${this.config.baseURL}changeArticle`, dataSet, { withCredentials: true }).subscribe(
      (articles: Article[]) => {
        this.articles = articles;
        this.articlesChange.next(this.articles);
        this.ui.setMessage('Save success');
        this.saveSuccess.next(true);
        this.ui.doCloseEditNew();
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
      }
    );
  }

  public changeProduct(dataSet) {
    this.http.post(`${this.config.baseURL}changeProduct`, dataSet, { withCredentials: true }).subscribe(
      (products: Product[]) => {
        this.products = products;
        this.productsChange.next(this.products);
        this.ui.setMessage('Save success');
        this.saveSuccess.next(true);
        this.ui.doCloseEditNew();
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
      }
    );
  }


  public changeUser(dataSet) {
    this.http.post(`${this.config.baseURL}changeUser`, dataSet, { withCredentials: true }).subscribe(
      (users: User[]) => {
        this.users = users;
        this.userChange.next(this.users);
        this.ui.setMessage('Save success');
        this.saveSuccess.next(true)
        this.ui.doCloseEditNew();
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
      }
    );
  }

  public deleteUser(dataSet) {
    this.http.post(`${this.config.baseURL}deleteUser`, dataSet, { withCredentials: true }).subscribe(
      (users: User[]) => {
        this.users = users;
        this.userChange.next(this.users);
        this.ui.setMessage('Delete success');
        this.deleteSuccess.next(true);
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
        this.ui.doCloseDelete();
      }
    );
  }

  public deleteDisplayPart(displayPart) {
    this.http.post(`${this.config.baseURL}deleteDisplayPart`, displayPart, { withCredentials: true }).subscribe(
      (displayParts: DisplaysPart[]) => {
        this.displayParts = displayParts;
        this.displayPartsChange.next(this.displayParts);
        this.ui.setMessage('Delete success');
        this.deleteSuccess.next(true);
        this.ui.doCloseDelete();
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
      }
    );
  }

  public deleteTopSign(topSign) {
    this.http.post(`${this.config.baseURL}deleteTopSign`, topSign, { withCredentials: true }).subscribe(
      (topSigns: TopSign[]) => {
        this.topSigns = displayParts;
        this.topSignsChange.next(this.displayParts);
        this.ui.setMessage('Delete success');
        this.deleteSuccess.next(true);
        this.ui.doCloseDelete();
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
      }
    );
  }
  public deleteDisplay(display) {
    this.http.post(`${this.config.baseURL}deleteDisplay`, display, { withCredentials: true }).subscribe(
      (displays: Display[]) => {
        this.displays = displays;
        this.displaysChange.next(this.displays);
        this.ui.setMessage('Delete success');
        this.deleteSuccess.next(true);
        this.ui.doCloseDelete();
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
      }
    );
  }

  public deleteArticle(dataSet) {
    this.http.post(`${this.config.baseURL}deleteArticle`, dataSet, { withCredentials: true }).subscribe(
      (articles: Article[]) => {
        this.articles = articles;
        this.articlesChange.next(this.articles);
        this.ui.setMessage('Delete success');
        this.deleteSuccess.next(true);
        this.ui.doCloseDelete();
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
      }
    );
  }

  public deleteProduct(dataSet) {
    this.http.post(`${this.config.baseURL}deleteProduct`, dataSet, { withCredentials: true }).subscribe(
      (products: Product[]) => {
        this.products = products;
        this.productsChange.next(this.products);
        this.ui.setMessage('Delete success');
        this.deleteSuccess.next(true);
        this.ui.doCloseDelete();
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
      }
    );
  }

  public saveDisplayAndPartList(display:Display, partsList:DisplaysPart[]){
    this.http.post(`${this.config.baseURL}saveDisplayAndPartList`, {display:display,partsList:partsList}, { withCredentials: true }).subscribe(
      ( displays:Display[] ) => {
        this.ui.setMessage('Save success');
        this.displays = displays;
        this.displaysChange.next(this.displays);
        this.saveSuccess.next(true);
        this.ui.doCloseEditNew();
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
      }
    );
  }
}
