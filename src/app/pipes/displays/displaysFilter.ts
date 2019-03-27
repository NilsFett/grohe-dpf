import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'displaysFilter',
  pure: false
})
export class DisplaysFilter implements PipeTransform{
  transform(items:any[], filter: any): any {

    if( !items  || ! filter ){
      return items;
    }

    return items.filter(
      item => {

        if( item.title.toLowerCase().indexOf(filter.title.toLowerCase()) !== -1
        &&  item.articlenr.toLowerCase().indexOf(filter.articlenr.toLowerCase()) !== -1
        &&  item.displaytype.toLowerCase().indexOf(filter.displaytype.toLowerCase()) !== -1
        &&  item.topsign_punch.toLowerCase().indexOf(filter.topsign_punch.toLowerCase()) !== -1
        ){
          return true;
        }
      }
    )
  }
}
