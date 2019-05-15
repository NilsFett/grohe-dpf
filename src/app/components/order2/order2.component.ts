import { Component} from '@angular/core';
import { OrderService} from '../../services/order.service';
import { DataService} from '../../services/data.service';
import { ConfigService} from '../../services/config.service';
import { displayTemplates } from '../../classes/DisplayTemplates';
import { UiService} from '../../services/ui.service';
import { Router} from '@angular/router';
import { Product } from '../../classes/Product';
import { Article } from '../../classes/Article';
import { TopSign } from '../../classes/TopSign';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { UserService} from '../../services/user.service';

@Component({
  selector: 'grohe-dpf-order2',
  templateUrl: './order2.component.html',
  styleUrls: ['./order2.component.css']
})
export class Order2Component{
  public productsWithArticlesAndProductPath:Product[] = [];
  public productsSearchWord:string = '';
  public productChoosen:Product = null;
  public productChoosenCopy:Product = null;
  public articles:Article[] = [];
  public articlesById = {};
  public articleSearchword:string = '';
  public topSigns:TopSign[] = [];
  public topSignsById = {};
  public topSignsImageStringById = {
    1:'shower',
    2:'kitchen',
    3:'bath'
  };


  constructor(
    public order: OrderService,
    private dataService: DataService,
    public config: ConfigService,
    public ui: UiService,
    private router: Router,
    public user: UserService
  ) {
    if(this.dataService.productsWithArticlesAndProductPath){
      this.productsWithArticlesAndProductPath = this.dataService.productsWithArticlesAndProductPath;
      console.log('this.productsWithArticlesAndProductPath');
      console.log(this.productsWithArticlesAndProductPath);
    }
    else{
      this.dataService.productsWithArticlesAndProductPathChange.subscribe(
        (products:Product[]) => {
          this.productsWithArticlesAndProductPath = this.dataService.productsWithArticlesAndProductPath;
          console.log('this.productsWithArticlesAndProductPath');
          console.log(this.productsWithArticlesAndProductPath);
        }
      );
      this.dataService.loadProductsWithArticlesAndProductPath();
    }
    if(this.dataService.articles){
      this.articles = this.dataService.articles;
      for(var i = 0; i < this.articles.length; i++ ){
        this.articlesById[this.articles[i].id] = this.articles[i];
      }
    }
    else{
      this.dataService.articlesChange.subscribe(
        (articles:Article[]) => {
          this.articles = this.dataService.articles;
          for(var i = 0; i < this.articles.length; i++ ){
            this.articlesById[this.articles[i].id] = this.articles[i];
          }
        }
      );
      this.dataService.loadArticles();
    }
    if (this.dataService.topSigns) {
      this.topSigns = this.dataService.topSigns;
      for(var i = 0; i < this.topSigns.length; i++ ){
        this.topSignsById[this.topSigns[i].id] = this.topSigns[i];
      }
    }
    else {
      this.dataService.topSignsChange.subscribe(
        (topSigns: TopSign[]) => {
          this.topSigns = this.dataService.topSigns;
          for(var i = 0; i < this.topSigns.length; i++ ){
            this.topSignsById[this.topSigns[i].id] = this.topSigns[i];
          }
        }
      );
      this.dataService.loadTopSigns();
    }
  }

  public productsSearchWordChanged(searchword){
    this.productsSearchWord = searchword;
  }

  public productSelected(product){
    this.order.productChoosen = product;
  }

  public removeSelected(){
    this.order.productChoosen = null;
  }

  public showEditArticleList(){
    this.productChoosenCopy = Object.assign({}, this.order.productChoosen);
    this.productChoosenCopy.article = this.order.productChoosen.article.slice(0);
    this.ui.doShowEditNew();
  }

  public changeArticleList(){
    this.order.productChoosen = Object.assign({}, this.productChoosenCopy);
    this.order.productChoosen.article = this.productChoosenCopy.article.slice(0);
    this.ui.doCloseEditNew();
  }

  public removeArticleFromArticleList(article:Article){
    if( article.units == 1){
      let index = this.productChoosenCopy.article.indexOf(article);
      if( index > -1 ){
        this.productChoosenCopy.article.splice(index,1);
      }
    }
    else{
      article.units--;
    }
  }

  public addArticleToArticleList(article:Article){
    var count = (document.getElementById('countArticle'+article.articlenr) as HTMLTextAreaElement).value
    var i;
    var found = false;
    for(i = 0; i < this.productChoosenCopy.article.length; i++){
      if( this.productChoosenCopy.article[i].articlenr  == article.articlenr ){
        if(count == ''){
          this.productChoosenCopy.article[i].units++;
        }
        else{
          this.productChoosenCopy.article[i].units = parseInt(count);
        }
        found = true;
      }
    }
    if(!found){
      if(count == ''){
        article.units = 1;
      }
      else{
        article.units = parseInt(count);
      }
      this.productChoosenCopy.article.push(article);
    }
  }

  public articleSearchwordChanged(searchword){
    this.articleSearchword = searchword;
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
    if(! this.order.productChoosen || ! this.topSignsById[this.order.productChoosen.topsign_id] ){
      return weight;
    }
    weight = weight + ( this.topSignsById[this.order.productChoosen.topsign_id].weight * this.order.displayQuantity );
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

  public filterArticleList(product){
    var matching = false;
    if(
          product.DFID.toLowerCase().indexOf(this.productsSearchWord.toLowerCase()) !== -1
      ||  product.SAP.toLowerCase().indexOf(this.productsSearchWord.toLowerCase()) !== -1
      ||  product.path.path.toLowerCase().indexOf(this.productsSearchWord.toLowerCase()) !== -1
    )
    {
      matching = true;
    }
    for(var i = 0; i < product.article.length; i++){
      if(
          product.article[i].title.toLowerCase().indexOf(this.productsSearchWord.toLowerCase()) !== -1
      ||  product.article[i].articlenr.toLowerCase().indexOf(this.productsSearchWord.toLowerCase()) !== -1
      ||  product.article[i].type.toLowerCase().indexOf(this.productsSearchWord.toLowerCase()) !== -1
      ){
        matching = true;
      }
    }
    return matching;
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

  public showNewDialog(){
    this.ui.doShowEditNew();
  }

  public finishOrder(){
    this.dataService.finishOrder().subscribe(
      result => {
        this.router.navigate(['/order3']);
      }
    );
  }
  public quantityChanged(event){
    console.log(this.order.displayQuantity);
    this.order.displayQuantity = this.order.displayQuantity.replace(/\D/g, '');
    if(this.order.displayQuantity < 1){
      this.order.displayQuantity = '1';
    }
  }
  //.replace(/\D/g, '');
}
