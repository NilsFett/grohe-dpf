import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService} from '../../services/data.service';
import { ConfigService} from '../../services/config.service';
import { Product } from '../../classes/Product';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ProductsFilter } from '../../pipes/product/productFilter'
import { Image } from '../../classes/Image';
import { ProductTree } from '../../classes/ProductTree';
import { Article } from '../../classes/Article';
import { Display } from '../../classes/display';

@Component({
  selector: 'grohe-dpf-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent  {
  @ViewChild(MatSort) sort: MatSort;

  currentDataSet:Product = null;
  dataSetToDelete:Product = null;
  products:Product[] = [];
  categories:ProductTree[] = [];
  filter = {
    title:'',
    DFID:'',
    SAP:''
  };

  columnsToDisplay = ['image', 'title', 'DFID', 'SAP', 'price', 'edit', 'delete'];
  dataSource :  MatTableDataSource<Product>;
  productForm = new FormGroup({
    image : new FormControl(''),
    title : new FormControl('',[Validators.required, Validators.minLength(2)]),
    DFID : new FormControl('',[Validators.required, Validators.minLength(2)]),
    SAP : new FormControl('',[Validators.required, Validators.minLength(2)]),
    product_tree : new FormControl(''),
    display_id : new FormControl('',[Validators.required]),
    price : new FormControl('',[Validators.required, Validators.minLength(2)]),
    pallet_select : new FormControl(''),
    pallet_disabled : new FormControl(''),
    bypack_disabled : new FormControl(''),
    topsign_upload_disabled : new FormControl(''),
    notopsign_order_disabled : new FormControl(''),
    empty_display : new FormControl(''),
    deliverytime : new FormControl('')
  });
  public showArticles = false;
  public images:Image[] = [];
  public imagesById = {};
  public displays:Display[] = [];
  public articles:Article[] = [];
  public articlesById = {};
  public displaysById = {};
  public articleList:Article[] = [];
  public articleSearchword:string = '';

  public catString:string= "Category*";

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    public config: ConfigService,
    private productsFilter: ProductsFilter
  ) {
    this.dataSource = new MatTableDataSource(this.products);

    if(this.dataService.products){
      this.dataSource = new MatTableDataSource(this.dataService.products);
      this.dataSource.sort = this.sort;
    }
    else{
      this.dataService.productsChange.subscribe(
        (products:Product[]) => {
          this.dataSource = new MatTableDataSource(products);
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadProducts();
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
    if(this.dataService.categories){
      this.categories = this.dataService.categories;
    }
    else{
      this.dataService.categoriesChange.subscribe(
        (categories:ProductTree[]) => {
          this.categories = categories;
        }
      );
      this.dataService.loadCategories();
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
    if (this.dataService.displays) {
      this.displays = this.dataService.displays;
      console.log('this.displays');
      console.log(this.displays);
      for(var i = 0; i < this.displays.length; i++ ){
        this.displaysById[this.displays[i].id] = this.displays[i];
      }
    }
    else {
      this.dataService.displaysChange.subscribe(
        (displays: Display[]) => {
          this.displays = this.dataService.displays;
          console.log('this.displays');
          console.log(this.displays);
          for(var i = 0; i < this.displays.length; i++ ){
            this.displaysById[this.displays[i].id] = this.displays[i];
          }
        }
      );
      this.dataService.loadDisplays();
    }
    this.ui.imageChoosen.subscribe( (image:Image)=>{
      this.currentDataSet.image = image.id;
      this.ui.doHideMedias();
    });
    this.ui.categorySelected.subscribe( (catId:number)=>{
      this.currentDataSet.product_tree = catId;
    });
  }

  public showNew(){
    this.ui.doShowEditNew();;
    this.currentDataSet = new Product();
    this.clearForm();
  }

  public clearForm(){
    this.productForm = new FormGroup({
      image : new FormControl(''),
      title : new FormControl('',[Validators.required, Validators.minLength(2)]),
      DFID : new FormControl('',[Validators.required, Validators.minLength(2)]),
      SAP : new FormControl('',[Validators.required, Validators.minLength(2)]),
      product_tree : new FormControl(''),
      price : new FormControl('',[Validators.required, Validators.minLength(2)]),
      pallet_select : new FormControl(''),
      pallet_disabled : new FormControl(''),
      bypack_disabled : new FormControl(''),
      topsign_upload_disabled : new FormControl(''),
      notopsign_order_disabled : new FormControl(''),
      empty_display : new FormControl(''),
      deliverytime : new FormControl(''),
      hide : new FormControl('')
    });
  }

  filterChanges(){
      this.products = this.productsFilter.transform(this.dataService.products, this.filter);
      this.dataSource.data = this.products;
  }

  public getImage(imageid){
    if(this.imagesById[imageid]){
      return `${this.config.baseURL}uploads/thumbs/${this.imagesById[imageid].path}`;
    }
    else{
      return `${this.config.baseURL}uploads/no_pic_thumb.jpg`;
    }
  }

  public removeArticleFromArticleList(article:Article){
    if( article.units == 1){
      let index = this.articleList.indexOf(article);
      if( index > -1 ){
        this.articleList.splice(index,1);
      }
    }
    else{
      article.units--;
    }
  }

  public addArticleToArticleList(article:Article){
    var i;
    var found = false;
    for(i = 0; i < this.articleList.length; i++){
      if( this.articleList[i].articlenr  == article.articlenr ){
        this.articleList[i].units++;
        found = true;
      }
    }
    if(!found){
      article.units = 1;
      this.articleList.push(article);
    }
  }

  public articleSearchwordChanged(searchword){
    this.articleSearchword = searchword;
  }
/*
  public save(){
    if (this.productForm.status == 'VALID') {
      this.currentDataSet.title = this.productForm.controls['title'].value;
      this.currentDataSet.DFID = this.productForm.controls['DFID'].value;
      this.currentDataSet.SAP = this.productForm.controls['SAP'].value;
      this.currentDataSet.price = this.productForm.controls['price'].value;
      this.currentDataSet.pallet_select = this.productForm.controls['pallet_select'].value;
      this.currentDataSet.bypack_disabled = this.productForm.controls['bypack_disabled'].value;
      this.currentDataSet.topsign_upload_disabled = this.productForm.controls['topsign_upload_disabled'].value;
      this.dataService.changeProduct(this.currentDataSet);
    }
  }
*/
  public setCurrentDataSet(currentDataSet){
    console.log('setCurrentDataSet');
    console.log(currentDataSet);
    this.currentDataSet = currentDataSet;
    this.ui.doShowEditNew();
    this.updateFormValues();

    if(this.dataService.articlesByProductId[currentDataSet.id]){
      this.articleList = this.dataService.articlesByProductId[currentDataSet.id];
    }
    else{
      this.dataService.articlesByProductIdChange.subscribe((articleList: Article[]) => {
        this.articleList = articleList;
      });
      this.dataService.loadArticlesByProductId(currentDataSet.id);
    }
  }

  private updateFormValues(){
    var pallet_select,pallet_disabled,bypack_disabled,topsign_upload_disabled,notopsign_order_disabled,empty_display=true;
    if(this.currentDataSet.pallet_select == 1){
      pallet_select = true;
    }
    if(this.currentDataSet.pallet_disabled == 1){
      pallet_disabled = true;
    }
    if(this.currentDataSet.bypack_disabled == 1){
      bypack_disabled = true;
    }
    if(this.currentDataSet.topsign_upload_disabled == 1){
      topsign_upload_disabled = true;
    }
    if(this.currentDataSet.notopsign_order_disabled == 1){
      notopsign_order_disabled = true;
    }
    if(this.currentDataSet.empty_display == 1){
      empty_display = true;
    }

    this.productForm.patchValue({
      image: this.currentDataSet.image,
      title: this.currentDataSet.title,
      DFID: this.currentDataSet.DFID,
      SAP: this.currentDataSet.SAP,
      product_tree: this.currentDataSet.product_tree,
      price: this.currentDataSet.price,
      pallet_select: pallet_select,
      pallet_disabled: pallet_disabled,
      bypack_disabled: bypack_disabled,
      topsign_upload_disabled: topsign_upload_disabled,
      notopsign_order_disabled: notopsign_order_disabled,
      empty_display:empty_display,
      deliverytime:this.currentDataSet.deliverytime
    });
  }

  public saveProductAndArticleList(){
    if (this.productForm.status == 'VALID') {
      this.currentDataSet.title = this.productForm.controls['title'].value;
      this.currentDataSet.DFID = this.productForm.controls['DFID'].value;
      this.currentDataSet.SAP = this.productForm.controls['SAP'].value;
      //this.currentDataSet.product_tree = this.productForm.controls['product_tree'].value;
      this.currentDataSet.price = this.productForm.controls['price'].value;
      if(this.productForm.controls['pallet_select'].value){
        this.currentDataSet.pallet_select = 1;
      }
      else{
        this.currentDataSet.pallet_select = 0;
      }
      if(this.productForm.controls['pallet_disabled'].value){
        this.currentDataSet.pallet_disabled = 1;
      }
      else{
        this.currentDataSet.pallet_disabled = 0;
      }
      if(this.productForm.controls['bypack_disabled'].value){
        this.currentDataSet.bypack_disabled = 1;
      }
      else{
        this.currentDataSet.bypack_disabled = 0;
      }
      if(this.productForm.controls['topsign_upload_disabled'].value){
        this.currentDataSet.topsign_upload_disabled = 1;
      }
      else{
        this.currentDataSet.topsign_upload_disabled = 0;
      }
      if(this.productForm.controls['notopsign_order_disabled'].value){
        this.currentDataSet.notopsign_order_disabled = 1;
      }
      else{
        this.currentDataSet.notopsign_order_disabled = 0;
      }
      if(this.productForm.controls['empty_display'].value){
        this.currentDataSet.empty_display = 1;
      }
      else{
        this.currentDataSet.empty_display = 0;
      }

      this.currentDataSet.deliverytime = this.productForm.controls['deliverytime'].value;
      console.log(this.currentDataSet);
      this.dataService.saveProductAndArticleList(this.currentDataSet, this.articleList);
    }
    else{
      this.showArticles = false;
      this.productForm.updateValueAndValidity();
    }
  }

  public showDelete(part){
    this.ui.doShowDelete();
    this.dataSetToDelete = part;
  }

  public deleteClose() {
    this.dataSetToDelete = null;
    this.ui.doCloseDelete();
  }

  public delete(){
    this.dataService.deleteProduct(this.dataSetToDelete);
  }

  public selectImage(){
    this.ui.doShowMedias();
  }


  public articlesSearchwordChanged(searchword){
    this.articleSearchword = searchword;
  }
}
