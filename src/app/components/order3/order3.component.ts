import { Component} from '@angular/core';
import { OrderService} from '../../services/order.service';
import { UserService} from '../../services/user.service';
import { ConfigService} from '../../services/config.service';

@Component({
  selector: 'grohe-dpf-order3',
  templateUrl: './order3.component.html',
  styleUrls: ['./order3.component.css']
})
export class Order3Component{
  constructor(
    private order: OrderService,
    public user: UserService,
    public config: ConfigService
  ) {
    console.log(this.user)
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
}
