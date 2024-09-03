import { Component, Input, ViewChild, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs'
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService} from '../../services/data.service';
import { ConfigService} from '../../services/config.service';
import { Product } from '../../classes/Product';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProductsFilter } from '../../pipes/product/productFilter'
import { Image } from '../../classes/Image';
import { ProductTree } from '../../classes/ProductTree';
import { Article } from '../../classes/Article';
import { Display } from '../../classes/display';
import { TopSign } from '../../classes/TopSign';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'grohe-dpf-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements AfterViewChecked, OnInit {
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  currentDataSet:Product = null;
  dataSetToDelete:Product = null;
  products:Product[] = [];
  categories:ProductTree[] = [];
  filter = {
    title:'',
    DFID:'',
    SAP:'',
    TopSign:'',
    showHidden:false
  };

  columnsToDisplay = ['image', 'title', 'DFID', 'SAP', 'TopSign', 'price', 'edit', 'delete', 'hide'];
  dataSource :  MatTableDataSource<Product>;
  productForm = new FormGroup({
    image : new FormControl(''),
    title : new FormControl('',[Validators.required, Validators.minLength(2)]),
    DFID : new FormControl('',[Validators.required, Validators.minLength(2)]),
    SAP : new FormControl('',[Validators.required, Validators.minLength(2)]),
    supplier : new FormControl('',[Validators.required]),
    product_tree : new FormControl(''),
    display_id : new FormControl('',[Validators.required]),
    topsign_id : new FormControl(''),
    promotion_material_id : new FormControl(''),
    price : new FormControl('',[Validators.required, Validators.minLength(2)]),

    deliverytime : new FormControl('')
  });
  public currentTab = 1;
  public images:Image[] = [];
  public imagesById = {};
  public displays:Display[] = [];
  public articles:Article[] = [];
  public topSigns:TopSign[] = [];
  public articlesById = {};
  public displaysById = {};
  public topSignsById = {};
  public articleList:Article[] = [];
  public articleSearchword:string = '';
  public promotionMaterialSearchWord: string = '';
  public promotionMaterials:TopSign[] = [];

  public catString:string= "Display Types*";


  private refreshing:boolean = false;
  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    public config: ConfigService,
    private productsFilter: ProductsFilter,
    private activeRoute: ActivatedRoute,
    private changeDetectionRef:ChangeDetectorRef
  ) {
    this.ui.view = 'admin';
    this.dataSource = new MatTableDataSource(this.dataService.products);
    this.dataSource.sort = this.sort;
    this.ui.view = 'admin';
    this.refreshing = false;

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


    this.ui.imageChoosen.subscribe( (image:Image)=>{
      this.currentDataSet.image = image.id;
      this.ui.doHideMedias();
    });
    this.ui.categorySelected.subscribe( (catId:number)=>{
      this.currentDataSet.product_tree = catId;
    });

    if(this.dataService.products){
      this.products = this.productsFilter.transform(this.dataService.products, this.filter);
      this.dataSource.data = this.products;
    }
    else{
      this.dataService.productsChange.subscribe(
        (products:Product[]) => {
          this.products = this.productsFilter.transform(this.dataService.products, this.filter);
          this.dataSource.data = this.products;
          this.refreshing = true;
        }
      );
    }

    this.activeRoute.params.subscribe(
      routeParams => {
        this.dataService.products = [];
        this.products = [];
        this.dataService.loadProducts(routeParams);
      }
    )
  }

  ngAfterViewChecked(){

    this.products = this.productsFilter.transform(this.dataService.products, this.filter);
    this.dataSource.data = this.products;
  //  this.dataSource.sort = this.sort;
    this.changeDetectionRef.detectChanges();
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
      //this.changeDetectionRef.detectChanges();

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
       supplier : new FormControl('',[Validators.required]),
       product_tree : new FormControl(''),
       display_id : new FormControl('',[Validators.required]),
       topsign_id : new FormControl(''),
       promotion_material_id : new FormControl(''),
       price : new FormControl('',[Validators.required, Validators.minLength(1)]),
       deliverytime : new FormControl('')
     });
     this.articleList = [];
     this.promotionMaterials = [];
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

  public getImageTopSign(product){
    if(this.topSignsById[product.topsign_id] && this.imagesById[this.topSignsById[product.topsign_id].image]){
      return `${this.config.baseURL}uploads/${this.imagesById[this.topSignsById[product.topsign_id].image].path}`;
    }
    else{
      return `${this.config.baseURL}uploads/no_pic_thumb.jpg`;
    }
  }
  public getImageProduct(product){
    if(this.displaysById[product.display_id] && this.imagesById[this.displaysById[product.display_id].image]){
      return `${this.config.baseURL}uploads/${this.imagesById[this.displaysById[product.display_id].image].path}`;
    }
    else{
      return `${this.config.baseURL}uploads/no_pic_thumb.jpg`;
    }
  }

  public getImageDisplayType(imageid){
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

  public removePMFromPMList(pm:TopSign){
    if( pm.units == 1){
      let index = this.promotionMaterials.indexOf(pm);
      if( index > -1 ){
        this.promotionMaterials.splice(index,1);
      }
    }
    else{
      pm.units--;
    }
  }

  public addArticleToArticleList(article:Article){
    var count = (document.getElementById('countArticle'+article.articlenr) as HTMLTextAreaElement).value
    var i;
    var found = false;
    for(i = 0; i < this.articleList.length; i++){
      if( this.articleList[i].articlenr  == article.articlenr ){
        if(count == ''){
          this.articleList[i].units++;
        }
        else{
          this.articleList[i].units = parseInt(count);
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
      this.articleList.push(article);
    }
  }

  public addPMToPMList(pm:TopSign){
    var count = (document.getElementById('countPM'+pm.id) as HTMLTextAreaElement).value
    var i;
    var found = false;
    for(i = 0; i < this.promotionMaterials.length; i++){
      if( this.promotionMaterials[i].id  == pm.id ){
        if(count == ''){
          this.promotionMaterials[i].units++;
        }
        else{
          this.promotionMaterials[i].units = parseInt(count);
        }
        found = true;
      }
    }
    if(!found){
      if(count == ''){
        pm.units = 1;
      }
      else{
        pm.units = parseInt(count);
      }
      this.promotionMaterials.push(pm);
    }
  }


  public articleSearchwordChanged(searchword){
    this.articleSearchword = searchword;
  }

  public setCurrentDataSet(currentDataSet){

    this.currentDataSet = currentDataSet;
    this.ui.doShowEditNew();
    this.updateFormValues();

    if(this.dataService.articlesByProductId[currentDataSet.id]){
      this.articleList = this.dataService.articlesByProductId[currentDataSet.id].articles;
      this.promotionMaterials  = this.dataService.articlesByProductId[currentDataSet.id].topsigns;
    }
    else{
      this.dataService.articlesByProductIdChange.subscribe((articleList: any) => {
        this.articleList = articleList.articles;
        this.promotionMaterials  = articleList.topsigns;
      });
      this.dataService.loadArticlesByProductId(currentDataSet.id);
    }
  }

  private updateFormValues(){
    var pallet_select,pallet_disabled,bypack_disabled,topsign_upload_disabled,notopsign_order_disabled,empty_display=true;


    this.productForm.patchValue({
      image: this.currentDataSet.image.toString(),
      title: this.currentDataSet.title,
      DFID: this.currentDataSet.DFID,
      SAP: this.currentDataSet.SAP,
      supplier: this.currentDataSet.supplier,
      display_id : this.currentDataSet.display_id.toString(),
      topsign_id : this.currentDataSet.topsign_id.toString(),
      promotion_material_id : this.currentDataSet.promotion_material_id.toString(),
      product_tree: this.currentDataSet.product_tree.toString(),
      price: this.currentDataSet.price.toString(),
      deliverytime:this.currentDataSet.deliverytime.toString()
    });
  }

  public saveProductAndArticleList(){
    if (this.productForm.status == 'VALID') {
      this.currentDataSet.title = this.productForm.controls['title'].value;
      this.currentDataSet.DFID = this.productForm.controls['DFID'].value;
      this.currentDataSet.SAP = this.productForm.controls['SAP'].value;
      this.currentDataSet.supplier = this.productForm.controls['supplier'].value;
      this.currentDataSet.display_id = Number(this.productForm.controls['display_id'].value),
      this.currentDataSet.topsign_id = Number(this.productForm.controls['topsign_id'].value),
      this.currentDataSet.promotion_material_id = Number(this.productForm.controls['promotion_material_id'].value),
      this.currentDataSet.price = Number(this.productForm.controls['price'].value);
      this.currentDataSet.deliverytime = Number(this.productForm.controls['deliverytime'].value);
      this.dataService.saveProductAndArticleList(this.currentDataSet, this.articleList, this.promotionMaterials);
    }
    else{
      this.currentTab = 1;
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

  public hide(part){
    //console.log(part);
    this.dataService.hideProduct(part);
  }

  public selectImage(){
    this.ui.doShowMedias();
  }
  public articlesSearchwordChanged(searchword){
    this.articleSearchword = searchword;
  }

  public promotionMaterialSearchWordChanged(searchword){
    this.promotionMaterialSearchWord = searchword;
  }

  ngOnDestroy(){
    console.log('ngOnDestroy');

/*
    this.unsubscribeOnDestroy.forEach( item => {
      item.unsubscribe();
    });

    this.unsubscribeOnDestroy = [];
*/
  }

}
