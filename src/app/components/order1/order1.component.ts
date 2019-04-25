import { Component} from '@angular/core';
import { OrderService} from '../../services/order.service';
import { ConfigService} from '../../services/config.service';
import { displayTemplates } from '../../classes/DisplayTemplates';

@Component({
  selector: 'grohe-dpf-order1',
  templateUrl: './order1.component.html',
  styleUrls: ['./order1.component.css']
})
export class Order1Component{
  constructor(
    private order: OrderService,
    public config: ConfigService
  ) {
    order.displayTypeChoosen = 1;
    order.displayQuantity = 1;
    order.topSign = null;
    order.productChoosen = null;
    order.SAP = '';
  }

  public displayChoosen(id){
    this.order.displayTypeChoosen = id;
  }
}
