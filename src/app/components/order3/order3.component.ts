import { Component } from '@angular/core';
import { OrderService} from '../../services/order.service';
import { UserService} from '../../services/user.service';
import { ConfigService} from '../../services/config.service';
import { TopSign } from '../../classes/TopSign';
import { DataService} from '../../services/data.service';
import { Image } from '../../classes/Image';
import { Display } from '../../classes/display';
import { Router} from '@angular/router';

@Component({
  selector: 'grohe-dpf-order3',
  templateUrl: './order3.component.html',
  styleUrls: ['./order3.component.css']
})
export class Order3Component {
  public topSigns:TopSign[] = [];
  public topSignsById = {};
  public images:Image[] = [];
  public imagesById = {};
  public displays:Display[] = [];
  public displaysById = {};
  public success:boolean = false;
  public topSignsImageStringById = {
    1:'shower',
    2:'kitchen',
    3:'bath'
  };
  constructor(
    public order: OrderService,
    public user: UserService,
    private dataService: DataService,
    public config: ConfigService,
    private router: Router
  ) {

    if(! this.order.productChoosen ){
      this.router.navigate(['/order2']);
    }


    if (this.dataService.topSigns) {
      this.topSigns = this.dataService.topSigns;
      for(var i = 0; i < this.topSigns.length; i++ ){
        this.topSignsById[this.topSigns[i].id] = this.topSigns[i];
      }
      console.log('this.topSignsById');
      console.log(this.topSignsById);
    }
    else {
      this.dataService.topSignsChange.subscribe(
        (topSigns: TopSign[]) => {
          this.topSigns = this.dataService.topSigns;
          for(var i = 0; i < this.topSigns.length; i++ ){
            this.topSignsById[this.topSigns[i].id] = this.topSigns[i];
          }
          console.log('this.topSignsById');
          console.log(this.topSignsById);
        }
      );
      this.dataService.loadTopSigns();
    }
    if (this.dataService.displays) {
      this.displays = this.dataService.displays;
      for(var i = 0; i < this.displays.length; i++ ){
        this.displaysById[this.displays[i].id] = this.displays[i];
      }
    }
    else {
      this.dataService.displaysChange.subscribe(
        (displays: Display[]) => {
          this.displays = this.dataService.displays;
          for(var i = 0; i < this.displays.length; i++ ){
            this.displaysById[this.displays[i].id] = this.displays[i];
          }
        }
      );
      this.dataService.loadDisplays();
    }
    if(this.dataService.images){
      this.images = this.dataService.images;
      for(let i = 0; i < this.images.length ; i++ ){
        this.imagesById[this.images[i].id] = this.images[i];
      }
    }
    else{
      this.dataService.imagesChange.subscribe(
        (images:Image[]) => {
          this.images = images;
          for(let i = 0; i < this.images.length ; i++ ){
            this.imagesById[this.images[i].id] = this.images[i];
          }
        }
      );
      this.dataService.loadImages();
    }
  }



  public getDateStringToday() {
    let date = new Date();
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ', ' + year;
  }

  public getDisplayWeight(){
    let weight = 0;
    if(! this.order.productChoosen ){
      return weight;
    }
    for(var i = 0; i < this.order.productChoosen.display_parts.length; i++){
      weight = weight + ( parseInt(this.order.productChoosen.display_parts[i].weight) * this.order.displayQuantity );
    }
    return Number((weight/1000).toFixed(2));
  }

  public getTopSignWeight(){
    let weight:number = 0;
    if(! this.order.productChoosen || ! this.order.topSign){
      return weight;
    }

    weight = weight + ( this.topSigns[this.order.topSign].weight * this.order.displayQuantity );
    return Number((weight/1000).toFixed(2));
  }

  public getArticleWeight(article){
    let weight:number = 0;
    if(! this.order.productChoosen ){
      return weight;
    }
    weight = weight + ( parseInt(article.weight) * article.units * this.order.displayQuantity );
    return Number((weight/1000).toFixed(2));
  }

  public getArticlesWeight(){
    let weight:number = 0;
    if(! this.order.productChoosen ){
      return weight;
    }

    for(var i = 0; i < this.order.productChoosen.article.length; i++){
      weight = weight + ( parseInt(this.order.productChoosen.article[i].weight) * this.order.productChoosen.article[i].units * this.order.displayQuantity );
    }
    return Number((weight/1000).toFixed(2));
  }

  public getTotalWeight(){
    var total = this.getDisplayWeight() + this.getTopSignWeight() + this.getArticlesWeight();
    return Number((total).toFixed(2));
  }
/*
  public newOrder(){
    this.order.clear();
    this.router.navigate(['/order2']);
  }
*/
  public finishOrder(){
    this.dataService.finishOrder().subscribe(
      result => {
        this.success = true;
        setTimeout(()=>{
          this.order.clear();
          this.router.navigate(['/order2']);
        },2000);
      }
    );
  }
  public getImage(product){
    if(this.displaysById[product.display_id] && this.imagesById[this.displaysById[product.display_id].image]){
      return `${this.config.baseURL}uploads/${this.imagesById[this.displaysById[product.display_id].image].path}`;
    }
    else{
      return `${this.config.baseURL}uploads/no_pic_thumb.jpg`;
    }
  }

  public getImageTopSign(product){
    if(this.topSignsById[product.topsign_id] && this.imagesById[this.topSignsById[product.topsign_id].image]){
      return `${this.config.baseURL}uploads/${this.imagesById[this.topSignsById[product.topsign_id].image].path}`;
    }
    else{
      return `${this.config.baseURL}uploads/no_pic_thumb.jpg`;
    }
  }
}
