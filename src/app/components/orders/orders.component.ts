import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UiService } from '../../services/ui.service';
import { DataService } from '../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Order } from 'src/app/classes/Order';
import { OrderFilter } from 'src/app/pipes/order/orderFilter';

@Component({
  selector: 'grohe-dpf-user',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  @ViewChild(MatSort) sort: MatSort;

  currentDataSet: Order = null;
  orders: Order[] = [];
  filter = {

    orderId: '',
    sap: '',
    pit: '',
    status: ''
  };

  columnsToDisplay = [ 'date', 'orderId',  'sap', 'pit', 'status', 'topsign', 'display',  'displayParts', 'edit'];
  dataSource: MatTableDataSource<Order>;
  orderForm = new FormGroup({
    status: new FormControl(''),
    mad: new FormControl('')
  });

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private orderFilter: OrderFilter
  ) {
    this.dataSource = new MatTableDataSource(this.orders);
    this.ui.view = 'admin';
    if (this.dataService.orders) {
      this.orders = this.orderFilter.transform(this.dataService.orders, this.filter);
      this.dataSource.data = this.orders;
      this.dataSource.sort = this.sort;
    }
    else {
      this.dataService.ordersChange.subscribe(
        (orders: Order[]) => {
          this.orders = this.orderFilter.transform(this.dataService.orders, this.filter);
          this.dataSource.data = this.orders;
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadOrders();
    }

  }

  ngOnInit() {
      this.dataSource.sort = this.sort;
      this.orderForm.valueChanges.subscribe(val => {
        console.log(val);

        this.currentDataSet.status = val.status;
    });
  }

  filterChanges() {
    this.orders = this.orderFilter.transform(this.dataService.orders, this.filter);
    this.dataSource.data = this.orderFilter.transform(this.dataService.orders, this.filter);
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
      this.dataService.changeOrder(this.currentDataSet);
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
    });
  }

  public tracking():boolean{
    return (this.currentDataSet.status == 'archive' || this.currentDataSet.status == 'storno')
  }
}
