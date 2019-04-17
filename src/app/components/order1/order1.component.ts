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

  }

  public displayChoosen(id){
    console.log('displayChoosen');
    console.log(id);
    this.order.displayTypeChoosen = id;
    console.log(this.order.displayTypeChoosen);
  }
}
