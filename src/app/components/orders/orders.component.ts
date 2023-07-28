import { Component, Input, ViewChild, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UiService } from '../../services/ui.service';
import { DataService } from '../../services/data.service';
import { ConfigService } from '../../services/config.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Order } from 'src/app/classes/Order';
import { OrderFilter } from 'src/app/pipes/order/orderFilter';

@Component({
  selector: 'grohe-dpf-user',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit{
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  public currentSorting = {active: "timestamp", direction: "asc"};

  currentDataSet: Order = null;
  orders: Order[] = [  ];
  filter = {
    dfid: '',
    orderId: '',
    sap: '',
    pit: '',
    topSign: '',
    status: [],
    from:null,
    until:null
  };
  public statusGetParams:string = '';

  columnsToDisplay = [ 'timestamp', 'DFID','hex', 'cross_charge','out', 'SAP', 'promotion_title', 'status', 'topsign', 'display',  'displayParts', 'edit'];
  dataSource: MatTableDataSource<Order> = null;
  orderForm = new FormGroup({
    status: new FormControl(''),
    mad: new FormControl(''),
    net_sales: new FormControl(''),
    filled_empty: new FormControl(''),
    dt: new FormControl('')

  });

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private orderFilter: OrderFilter,
    private cd: ChangeDetectorRef,
    public config: ConfigService
  ) {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.filter.from = new Date(y, m, 1);
    this.filter.until = new Date(y, m + 1, 0);
    this.filter.status = ['ordered'];
    this.dataSource = new MatTableDataSource(this.orders);
    this.ui.view = 'admin';
    if (this.dataService.orders) {
      //this.orders = this.dataService.orders;
      this.orders = this.orderFilter.transform(this.dataService.orders, this.filter);

      this.dataSource.data = this.orders;
      this.dataService.ordersChange.subscribe(
        (orders: Order[]) => {
          this.orders = this.dataService.orders;
          this.orders = this.orderFilter.transform(this.dataService.orders, this.filter);
          this.dataSource.data = this.orders;
        }
      );
    }
    else {
      this.dataService.ordersChange.subscribe(
        (orders: Order[]) => {
          this.orders = this.dataService.orders;
          this.orders = this.orderFilter.transform(this.dataService.orders, this.filter);
          this.dataSource.data = this.orders;
        }
      );

    }
    this.dataService.loadOrders(this.filter.from, this.filter.until);
  }

  public loadOrders(){

    this.dataService.loadOrders(this.filter.from, this.filter.until);
  }

  ngOnInit() {
    this.cd.detectChanges();
    console.log(this.dataSource);
    console.log(this.sort);
    this.dataSource.sort = this.sort;
    this.orderForm.valueChanges.subscribe(val => {
        this.currentDataSet.status = val.status;
        this.currentDataSet.mad = val.mad;
        this.currentDataSet.net_sales = val.net_sales;
        this.currentDataSet.filled_empty = val.filled_empty;
        this.currentDataSet.dt = val.dt;
    });
    this.setFilterParams();
  }

  private serialize(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(("status[]=" + encodeURIComponent(obj[p])));
      }
    return str.join("&");
  }

  filterChanges() {

    this.orders = this.orderFilter.transform(this.dataService.orders, this.filter);
    this.dataSource.data = this.orderFilter.transform(this.dataService.orders, this.filter);
    this.setFilterParams();
  }

  private setFilterParams(){
    console.log(this.filter);
    if(this.filter.status.length){
      let arrStr = this.serialize(this.filter.status);
      console.log('this.filter.status');
      console.log(this.filter.status);

      this.statusGetParams =  '&'+arrStr;
      console.log('this.statusGetParams');
      console.log(this.statusGetParams);
    }
    else{
      this.statusGetParams =  '';
    }

  }

  crosschargeChange($event){
    console.log(this.currentDataSet.crosscharge);
    if(this.currentDataSet.crosscharge == 1){
      this.currentDataSet.crosscharge = 0;
    }
    else{
        this.currentDataSet.crosscharge = 1;
    }
  }

  trackingChange($event){
    if(this.currentDataSet.tracking == 1){
      this.currentDataSet.tracking = 0;
    }
    else{
      this.currentDataSet.tracking = 1;
    }
  }

  madChange($event){
    console.log($event);
  }

  public save() {
    if (this.orderForm.status == 'VALID') {
      this.currentDataSet.status = this.orderForm.controls['status'].value;
      let saveObject = {
        id:this.currentDataSet.id,
        tracking:this.currentDataSet.tracking,
        crosscharge:this.currentDataSet.crosscharge,
        status:this.currentDataSet.status,
        mad:this.currentDataSet.mad,
        net_sales:this.currentDataSet.net_sales,
        filled_empty:this.currentDataSet.filled_empty,
        dt:this.currentDataSet.dt
      }
      console.log(saveObject);
      this.dataService.changeOrder(saveObject, this.filter.from, this.filter.until);
    }
  }

  public setCurrentDataSet(currentDataSet) {
    this.ui.showOverlay = true;
    this.currentDataSet = currentDataSet;
    this.updateFormValues();
  }

  private updateFormValues(){
    this.orderForm.patchValue({
      status: this.currentDataSet.status,
      net_sales:this.currentDataSet.net_sales
    });
  }

  public tracking():boolean{
    return (this.currentDataSet.status == 'archive' || this.currentDataSet.status == 'storno')
  }

  public sortChange(sorting){
    this.currentSorting = sorting;
  }
}
