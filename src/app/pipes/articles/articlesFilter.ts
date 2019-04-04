import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'articlesFilter',
  pure: false
})
export class ArticlesFilter implements PipeTransform{
  transform(items:any[], filter: any): any {
    if( !items  || ! filter ){
      return items;
    }

    return items.filter(
      item => {
        if( item.articlenr.toLowerCase().indexOf(filter.articlenr.toLowerCase()) !== -1
        &&  item.title.toLowerCase().indexOf(filter.title.toLowerCase()) !== -1
        &&  item.extra.toLowerCase().indexOf(filter.extra.toLowerCase()) !== -1
        &&  item.type.toLowerCase().indexOf(filter.type.toLowerCase()) !== -1
        &&  item.packaging.toLowerCase().indexOf(filter.packaging.toLowerCase()) !== -1
        &&  item.weight.toLowerCase().indexOf(filter.weight.toLowerCase()) !== -1
        &&  item.height.toLowerCase().indexOf(filter.height.toLowerCase()) !== -1
        &&  item.width.toLowerCase().indexOf(filter.width.toLowerCase()) !== -1
        &&  item.depth.toLowerCase().indexOf(filter.depth.toLowerCase()) !== -1
        ){
          return true;
        }
      }
    )
  }
}
