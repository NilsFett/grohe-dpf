import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { Product } from '../classes/Product';

@Injectable()
export class OrderService {
  public displayTypeChoosen:number = null;
  public displayQuantity:any = '1';
  public topSign:number = null;
  public costcentre:number;
  public costcentre_costno:string = '';
  public costcentre_description:string = '';
  public customer:string = '';
  public DC:string = 'DIY';
  public productChoosen:Product = null;
  public SAP:string = '';
  public pit:string = '';
  public desired_date_delivery = '';

  constructor(

    public user: UserService
  ) {
    if(this.user.isLoggedIn){
      this.costcentre = this.user.data.costcentres[0].id;
      this.costcentre_costno = this.user.data.costcentres[0].costno;
      this.costcentre_description = this.user.data.costcentres[0].description;
    }
    else{
      this.user.loggedInStateObserver.subscribe(loggedIn => {
        this.costcentre = this.user.data.costcentres[0].id;
        this.costcentre_costno = this.user.data.costcentres[0].costno;
        this.costcentre_description = this.user.data.costcentres[0].description;
      });
    }
  }

  public clear(){
    this.displayTypeChoosen = null;
    this.displayQuantity = 1;
    this.topSign = null;
    this.costcentre = null;
    this.costcentre_costno = null
    this.costcentre_description = null
    this.productChoosen = null;
    this.SAP = '';
    this.DC = '';
    this.pit = '';
    this.desired_date_delivery = '';
    this.customer = '';
  }
}
