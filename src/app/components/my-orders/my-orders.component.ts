import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UiService } from '../../services/ui.service';
import { DataService } from '../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Order } from 'src/app/classes/Order';
import { OrderFilter } from 'src/app/pipes/order/orderFilter';

@Component({
  selector: 'grohe-dpf-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {
  @ViewChild(MatSort, {static: false}) sort!: MatSort;


  orders: Order[] = [];
  filter = {
    dfid: '',
    orderId: '',
    sap: '',
    pit: '',
    status: [],
    from:null,
    until:null
  };
  public statusGetParams:string = '';

  columnsToDisplay = [ 'timestamp', 'orderId', 'sap', 'pit', 'status', 'topsign', 'display'];
  dataSource: MatTableDataSource<Order>;


  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private orderFilter: OrderFilter
  ) {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    this.filter.from = new Date(y, m, 1);
    this.filter.until = new Date(y, m + 1, 0);
    this.filter.status = ['ordered'];
    this.dataSource = new MatTableDataSource(this.orders);

    if (this.dataService.orders) {
      this.orders = this.orderFilter.transform(this.dataService.orders, this.filter);

      this.dataSource.sort = this.sort;

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
          this.orders = this.orderFilter.transform(this.dataService.orders, this.filter);
          this.dataSource.data = this.orders;
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadMyOrders(this.filter.from, this.filter.until);
    }
  }

  public loadOrders(){

    this.dataService.loadMyOrders(this.filter.from, this.filter.until);
  }

  ngOnInit() {
      this.dataSource.sort = this.sort;
  }

  filterChanges() {
    this.dataSource.data = this.orderFilter.transform(this.dataService.orders, this.filter);
    let arrStr = encodeURIComponent(JSON.stringify(this.filter.status));
    this.statusGetParams =  arrStr;

  }
}
