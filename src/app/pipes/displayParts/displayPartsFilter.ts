import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displayPartsFilter',
  pure: false
})
export class DisplayPartsFilter implements PipeTransform{
  transform(items:any[], filter: any): any {
    if( !items  || ! filter ){
      return items;
    }
    console.log(items);
    console.log(filter);
    return items.filter(
      item => {
        if( item.title.toLowerCase().indexOf(filter.title.toLowerCase()) !== -1
        &&  item.articlenr.toLowerCase().indexOf(filter.articlenr.toLowerCase()) !== -1
        &&  ( filter.weight == '' || item.weight.toString().toLowerCase().indexOf(filter.weight.toString().toLowerCase()) !== -1 )
        &&  ( filter.length == '' || item.length && item.length.toLowerCase().indexOf(filter.length.toLowerCase()) !== -1 )
        &&  item.width.toLowerCase().indexOf(filter.width.toLowerCase()) !== -1
        &&  item.height.toLowerCase().indexOf(filter.height.toLowerCase()) !== -1){
          return true;
        }
      }
    )
  }
}
