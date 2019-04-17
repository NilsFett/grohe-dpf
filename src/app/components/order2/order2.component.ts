import { Component} from '@angular/core';
import { OrderService} from '../../services/order.service';
import { DataService} from '../../services/data.service';
import { ConfigService} from '../../services/config.service';
import { displayTemplates } from '../../classes/DisplayTemplates';
import { Router} from '@angular/router';
import { Product } from '../../classes/Product';

@Component({
  selector: 'grohe-dpf-order2',
  templateUrl: './order2.component.html',
  styleUrls: ['./order2.component.css']
})
export class Order2Component{
  productsWithArticlesAndProductPath:Product[] = [];

  constructor(
    private order: OrderService,
    private dataService: DataService,
    public config: ConfigService,
    private router: Router
  ) {
    if(this.order.displayTypeChoosen === null){
      this.router.navigate(['/order1']);
      return;
    }

    if(this.dataService.productsWithArticlesAndProductPath){
      this.productsWithArticlesAndProductPath = this.dataService.productsWithArticlesAndProductPath;
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
  }
}
