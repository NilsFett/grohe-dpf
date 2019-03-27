import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayPartsFilter',
  pure: false
})
export class DisplayPartsFilter implements PipeTransform{
  transform(items:any[], filter: any): any {
    console.log('DisplayPartsFilter');
    console.log(filter);
    if( !items  || ! filter ){
      return items;
    }
    console.log(filter);

    return items.filter(
      item => {
        if( item.title.toLowerCase().indexOf(filter.title.toLowerCase()) !== -1
        &&  item.articlenr.toLowerCase().indexOf(filter.articlenr.toLowerCase()) !== -1
        &&  item.weight.toLowerCase().indexOf(filter.weight.toLowerCase()) !== -1
        &&  item.open_format.toLowerCase().indexOf(filter.open_format.toLowerCase()) !== -1
        &&  item.stock.toLowerCase().indexOf(filter.stock.toLowerCase()) !== -1
        &&  (item.hidden == filter.hidden || filter.hidden == null) ){
          return true;
        }
      }
    )
  }
}
