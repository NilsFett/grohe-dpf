import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderFilter',
  pure: false
})
export class OrderFilter implements PipeTransform{
  transform(items:any[], filter: any): any {
    if( !items  || ! filter ){
      return items;
    }

    console.log(items);
    console.log(filter);

    return items.filter(

      item => {
        if( item.hex.toLowerCase().indexOf(filter.orderId.toLowerCase()) !== -1
        &&  item.SAP.toLowerCase().indexOf(filter.sap.toLowerCase()) !== -1
        &&  item.promotion_title.toLowerCase().indexOf(filter.pit.toLowerCase()) !== -1
        &&  filter.status.indexOf(item.status.toLowerCase()) !== -1){

          return true;
        }
      }
    )
  }
}
