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
import { PromotionImage } from '../classes/PromotionImage';
import { Product } from '../classes/Product';
import { ProductTree } from '../classes/ProductTree';
import { ApiResponseInterface } from '../interfaces/apiResponse';
import { User } from '../classes/User';
import { Order } from '../classes/Order';
import { Image } from '../classes/Image';
import { UserService } from './user.service';
import { OrderService } from './order.service';


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
  public productsChangeObserver: Observable<Array<Product>>;

  public productsWithArticlesAndProductPath: Product[] = null;
  public productsWithArticlesAndProductPathChange: Subject<Array<Product>>;
  private productsWithArticlesAndProductPathChangeObserver: Observable<Array<Product>>;

  public users: User[] = null;
  public userChange: Subject<Array<User>>;
  private userChangeObserver: Observable<Array<User>>;

  public orders: Order[] = null;
  public ordersChange: Subject<Array<Order>>;
  private ordersChangeObserver: Observable<Array<Order>>;

  public images: Image[] = null;
  public imagesChange: Subject<Array<Image>>;
  private imagesChangeObserver: Observable<Array<Image>>;

  public categories: ProductTree[] = null;
  public categoriesChange: Subject<Array<ProductTree>>;
  private categoriesChangeObserver: Observable<Array<ProductTree>>;

  public displayPartsByDisplayId: Array<Array<DisplaysPart>> = [];
  public displayPartsByDisplayIdChange: Subject<Array<DisplaysPart>>;
  private displayPartsByDisplayIdChangeObserver: Observable<Array<DisplaysPart>>;

  public articlesByProductId: any = [];
  public articlesByProductIdChange: Subject<any>;
  private articlesByProductIdChangeObserver: Observable<any>;

  public promotionImages: PromotionImage[] = null;
  public promotionImagesChange: Subject<Array<PromotionImage>>;
  private promotionImagesChangeObserver: Observable<Array<PromotionImage>>;

  public saveSuccess: EventEmitter<boolean> = new EventEmitter();
  public deleteSuccess: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private config: ConfigService,
    private http: HttpClient,
    private error: ErrorService,
    private ui: UiService,
    private user: UserService,
    private order: OrderService
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

    this.productsWithArticlesAndProductPathChange = new Subject<Array<Product>>();
    this.productsWithArticlesAndProductPathChangeObserver = this.productsWithArticlesAndProductPathChange.asObservable();

    this.userChange = new Subject<Array<User>>();
    this.userChangeObserver = this.userChange.asObservable();

    this.ordersChange = new Subject<Array<Order>>();
    this.ordersChangeObserver = this.ordersChange.asObservable();

    this.imagesChange = new Subject<Array<Image>>();
    this.imagesChangeObserver = this.imagesChange.asObservable();

    this.categoriesChange = new Subject<Array<ProductTree>>();
    this.categoriesChangeObserver = this.categoriesChange.asObservable();

    this.displayPartsByDisplayIdChange = new Subject<Array<DisplaysPart>>();
    this.displayPartsByDisplayIdChangeObserver = this.displayPartsByDisplayIdChange.asObservable();

    this.articlesByProductIdChange = new Subject<any>();
    this.articlesByProductIdChangeObserver = this.articlesByProductIdChange.asObservable();

    this.promotionImagesChange = new Subject<Array<PromotionImage>>();
    this.promotionImagesChangeObserver = this.promotionImagesChange.asObservable();
  }

  public loadUsers() {
    this.http.get(`${this.config.baseURL}getUsers`, { withCredentials: true }).subscribe((users: User[]) => {
      this.users = users;
      this.userChange.next(this.users);
    });
  }

  public loadOrders(from,until) {
    let fromTimestamp = from.getTime();
    let untilTimestamp = until.getTime();
    this.http.get(`${this.config.baseURL}orders?from=${fromTimestamp}&until=${untilTimestamp}`, { withCredentials: true }).subscribe((orders: Order[]) => {
      this.orders = orders;
      this.ordersChange.next(this.orders);
    });
  }

  public loadMyOrders(from,until) {
    let fromTimestamp = from.getTime();
    let untilTimestamp = until.getTime();
    this.http.get(`${this.config.baseURL}orders?my=1&from=${fromTimestamp}&until=${untilTimestamp}`, { withCredentials: true }).subscribe((orders: Order[]) => {
      this.orders = orders;
      this.ordersChange.next(this.orders);
    });
  }


  public loadImages() {
    console.log('loadImages');
    this.http.get(`${this.config.baseURL}loadImages`, { withCredentials: true }).subscribe((images: Image[]) => {
      this.images = images;
      this.imagesChange.next(this.images);
    });
  }

  public loadPromotionImages() {
    this.http.get(`${this.config.baseURL}loadPromotionImages`, { withCredentials: true }).subscribe((promotionImages: PromotionImage[]) => {
      this.promotionImages = promotionImages;
      this.promotionImagesChange.next(this.promotionImages);
    });
  }


  public loadCategories() {
    this.http.get(`${this.config.baseURL}loadCategories`, { withCredentials: true }).subscribe((categories: ProductTree[]) => {
      this.categories = categories;
      this.categoriesChange.next(this.categories);
    });
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

  public loadTopSigns() {
    this.http.get(`${this.config.baseURL}loadTopSigns`, { withCredentials: true }).subscribe((topSigns: TopSign[]) => {
      this.topSigns = topSigns;
      this.topSignsChange.next(this.topSigns);
    });
  }

  public loadProducts(routerParam) {
    let id = 0;
    if(routerParam.id){
      id = routerParam.id;
    }
    this.http.get(`${this.config.baseURL}getProducts?id=${id}`, { withCredentials: true }).subscribe((products: Product[]) => {
      this.products = products;
      this.productsChange.next(this.products);
    });
  }

  public loadProductsWithArticlesAndProductPath() {
    this.http.get(`${this.config.baseURL}getAllProductsWithArticlesAndProductPath`, { withCredentials: true }).subscribe((products: Product[]) => {
      this.productsWithArticlesAndProductPath = products;
      this.productsWithArticlesAndProductPathChange.next(this.products);
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

  public loadArticlesByProductId(product_id) {
    this.http.get(`${this.config.baseURL}loadArticlesByProductId?article_id=${product_id}`, { withCredentials: true }).subscribe((articles: any) => {
      this.articlesByProductId[product_id] = articles;
      this.articlesByProductIdChange.next(this.articlesByProductId[product_id]);
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
      (topSigns: TopSign[]) => {
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

  public changePromotionImage(dataSet) {
    this.http.post(`${this.config.baseURL}changePromotionImage`, dataSet, { withCredentials: true }).subscribe(
      (promotionImages: PromotionImage[]) => {

        this.promotionImages = promotionImages;
        this.promotionImagesChange.next(this.promotionImages);
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

  public changeOrder(dataSet,from,until) {
    let fromTimestamp = from.getTime();
    let untilTimestamp = until.getTime();
    this.http.post(`${this.config.baseURL}changeOrder?from=${fromTimestamp}&until=${untilTimestamp}`, dataSet, { withCredentials: true }).subscribe(
      (orders: Order[]) => {
        this.orders = orders;
        this.ordersChange.next(this.orders);
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
        this.ui.doCloseDelete();
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
        this.topSigns = topSigns;
        this.topSignsChange.next(this.topSigns);
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

  public deletePromotionImage(dataSet) {
    this.http.post(`${this.config.baseURL}deletePromotionImage`, dataSet, { withCredentials: true }).subscribe(
      (promotionImages: PromotionImage[]) => {
        this.promotionImages = promotionImages;
        this.promotionImagesChange.next(this.promotionImages);
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


  public deleteImage(dataSet) {
    this.http.post(`${this.config.baseURL}deleteImage`, dataSet, { withCredentials: true }).subscribe(
      (images: Image[]) => {
        this.images = images;
        this.imagesChange.next(this.images);
        this.ui.setMessage('Delete success');
        this.deleteSuccess.next(true);
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

  public saveProductAndArticleList(product:Product, articleList:Article[], promotionMaterial:TopSign[]){
    this.http.post(`${this.config.baseURL}saveProductAndArticleList`, {product:product,articleList:articleList,promotionMaterial:promotionMaterial}, { withCredentials: true }).subscribe(
      ( products:Product[] ) => {
        this.ui.setMessage('Save success');
        this.products = products;
        this.productsChange.next(this.products);
        this.saveSuccess.next(true);
        this.ui.doCloseEditNew();
      },
      error => {
        this.error.setError(error);
        this.ui.setMessage('An Error occoured');
      }
    );
  }

  public sendPassword(user:User){

    this.user.passwordReset( {email:user.mail} ).subscribe(
      (response:ApiResponseInterface) => {
        console.log('RESPONSE');
        console.log(response.success);
        this.ui.setMessage('Password sent success');
        this.saveSuccess.next(true);
        this.ui.doCloseEditNew();
      },
      error => {
        this.error.setError(error);
      }
    );
  }

  public storeOrder(){
    let data = {
      product: this.order.productChoosen,
      quantity: this.order.displayQuantity,
      costcentre: this.order.costcentre,
      costcentre_costno: this.order.costcentre_costno,
      costcentre_description: this.order.costcentre_description,
      sap: this.order.SAP,
      customer: this.order.customer,
      channel: this.order.DC,
      pit: this.order.pit,
      desired_date_delivery: this.order.desired_date_delivery
    };
    return this.http.post(`${this.config.baseURL}storeOrder`, data, {withCredentials: true});
  }

  public finishOrder(){
    let data = {
      product: this.order.productChoosen,
      quantity: this.order.displayQuantity,
      costcentre: this.order.costcentre,
      sap: this.order.SAP,
      pit: this.order.pit,
      desired_date_delivery: this.order.desired_date_delivery
    };
    return this.http.post(`${this.config.baseURL}finishOrder`, data, {withCredentials: true});
  }

  public displayRequest(topsignImageId, requestText){
    return this.http.post(`${this.config.baseURL}displayRequest`, {topsignImageId:topsignImageId,requestText:requestText}, {withCredentials: true});
  }
}
