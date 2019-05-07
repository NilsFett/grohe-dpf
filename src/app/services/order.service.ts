import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Product } from '../classes/Product';

@Injectable()
export class OrderService {
  public displayTypeChoosen:number = null;
  public displayQuantity:number = 1;
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
}
