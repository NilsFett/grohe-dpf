import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Product } from '../classes/Product';

@Injectable()
export class OrderService {
  public displayTypeChoosen:number = null;
  public displayQuantity:any = '1';
  public topSign:number = null;
  public costcentre:number;
  public productChoosen:Product = null;
  public SAP:string = '';
  public pit:string = '';
  public desired_date_delivery = '';

  constructor(

    public user: UserService
  ) {
    if(this.user.isLoggedIn){
      this.costcentre = this.user.data.costcentres[0].id;
    }
    else{
      this.user.loggedInStateObserver.subscribe(loggedIn => {
        this.costcentre = this.user.data.costcentres[0].id;
      });
    }
  }

  public clear(){
    this.displayTypeChoosen = null;
    this.displayQuantity = 1;
    this.topSign = null;
    this.costcentre = null;
    this.productChoosen = null;
    this.SAP = '';
    this.pit = '';
    this.desired_date_delivery = '';
  }
}
