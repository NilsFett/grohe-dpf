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
        &&  item.type.toLowerCase().indexOf(filter.type.toLowerCase()) !== -1
        &&  item.packaging.toLowerCase().indexOf(filter.packaging.toLowerCase()) !== -1
        &&  item.weight.toString().toLowerCase().indexOf(filter.weight.toString().toLowerCase()) !== -1
        &&  item.height.toString().toLowerCase().indexOf(filter.height.toString().toLowerCase()) !== -1
        &&  item.width.toString().toLowerCase().indexOf(filter.width.toString().toLowerCase()) !== -1
        &&  item.depth.toString().toLowerCase().indexOf(filter.depth.toString().toLowerCase()) !== -1){
          return true;
        }
      }
    )
  }
}
