import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService} from '../../services/data.service';
import { ConfigService} from '../../services/config.service';
import { Product } from '../../classes/Product';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ProductsFilter } from '../../pipes/product/productFilter'

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
    price : new FormControl('',[Validators.required, Validators.minLength(2)]),
    pallet_select : new FormControl('',[Validators.required]),
    pallet_disabled : new FormControl(''),
    bypack_disabled : new FormControl(''),
    topsign_upload_disabled : new FormControl(''),
    notopsign_order_disabled : new FormControl(''),
    deliverytime : new FormControl(''),
    hide : new FormControl('')
  });

  public images = {
    1: 'uploads/dp1.jpg',
    2: 'uploads/dp2.jpg',
    3: 'uploads/dp3.jpg',
    10: 'uploads/afd1707d12f77e13ad77ba0fc17e9f83.jpg',
    11: 'uploads/773a7998644c720179ac7636d13db2c8.jpg',
    12: 'uploads/3858f5b37715465e7d7407d14f664a5f.jpg',
    13: 'uploads/b8ab04829399a0a70fdaa2abb4ef7924.jpg',
    14: 'uploads/5f78313fceb9d1ab61815e1cb7ed1969.jpg',
    15: 'uploads/e2f35a7d3761f87697d032ac43fe7081.jpg',
    16: 'uploads/1e7d0d4eeb42492d8138a3decc90955f.jpg',
  };

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

    this.productForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  public getImage(imageid){
      return `${this.config.baseURL}${this.images[imageid]}`;
  }

  public showNew(){
    this.ui.showOverlay = true;
    this.currentDataSet = new Product();

  }

  filterChanges(){
      this.products = this.productsFilter.transform(this.dataService.products, this.filter);
      this.dataSource.data = this.products;
  }

  public save(){
    this.currentDataSet.image = this.productForm.controls['image'].value;
    this.currentDataSet.title = this.productForm.controls['title'].value;
    this.currentDataSet.DFIS = this.productForm.controls['DFID'].value;
    this.currentDataSet.SAP = this.productForm.controls['SAP'].value;
    this.currentDataSet.product_tree = this.productForm.controls['product_tree'].value;
    this.currentDataSet.price = this.productForm.controls['price'].value;
    this.currentDataSet.pallet_select = this.productForm.controls['pallet_select'].value;
    this.currentDataSet.bypack_disabled = this.productForm.controls['bypack_disabled'].value;
    this.currentDataSet.topsign_upload_disabled = this.productForm.controls['topsign_upload_disabled'].value;
    this.dataService.changeProduct(this.currentDataSet);
  }

  public setCurrentDataSet(currentDataSet){

    this.currentDataSet = currentDataSet;
    this.productForm.patchValue({
      image: currentDataSet.image,
      title: currentDataSet.title,
      DFID: currentDataSet.DFIS,
      SAP: currentDataSet.SAP,
      product_tree: currentDataSet.product_tree,
      price: currentDataSet.price,
      pallet_select: currentDataSet.pallet_select,
      pallet_disabled: currentDataSet.pallet_disabled,
      bypack_disabled: currentDataSet.bypack_disabled,
      topsign_upload_disabled: currentDataSet.topsign_upload_disabled
    });
    this.ui.doShowEditNew();
  }

  public showDelete(part) {
    this.dataSetToDelete = part;
    this.ui.doShowDelete();
  }

  public deleteClose(part) {
    this.dataSetToDelete = null;
    this.ui.doCloseDelete();
  }

  public delete(){
    this.dataService.deleteProduct(this.dataSetToDelete);
  }
}
