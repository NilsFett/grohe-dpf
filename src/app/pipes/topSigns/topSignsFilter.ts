import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'topSignsFilter',
  pure: false
})
export class TopSignsFilter implements PipeTransform{
  transform(items:any[], filter: any): any {
    if( !items  || ! filter ){
      return items;
    }

    return items.filter(
      item => {
        if( item.title.toLowerCase().indexOf(filter.title.toLowerCase()) !== -1
        &&  item.articlenr.toLowerCase().indexOf(filter.articlenr.toLowerCase()) !== -1
        &&  item.weight.toString().toLowerCase().indexOf(filter.weight.toString().toLowerCase()) !== -1){
          return true;
        }
      }
    )
  }
}
