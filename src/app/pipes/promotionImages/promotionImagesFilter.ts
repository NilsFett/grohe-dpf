import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'promotionImages',
  pure: false
})
export class PromotionImagesFilter implements PipeTransform{
  transform(items:any[], filter: any): any {
    if( !items  || ! filter ){
      return items;
    }

    return items.filter(

      item => {
        if( item.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1 ){
          return true;
        }
      }
    )
  }
}
