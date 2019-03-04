import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'articlesFilter',
  pure: false
})
export class ArticlesFilter implements PipeTransform{
  transform(items:any[], filter: any): any {
    console.log('DisplayPartsFilter');
    console.log(filter);
    if( !items  || ! filter ){
      return items;
    }
    console.log(filter);

    return items.filter(
      item => {
        if( item.articlenr.toLowerCase().indexOf(filter.articlenr.toLowerCase()) !== -1
        &&  item.title.toLowerCase().indexOf(filter.title.toLowerCase()) !== -1
        &&  item.extra.toLowerCase().indexOf(filter.extra.toLowerCase()) !== -1
        &&  item.type.toLowerCase().indexOf(filter.type.toLowerCase()) !== -1
        &&  item.packaging.toLowerCase().indexOf(filter.packaging.toLowerCase()) !== -1
        &&  item.weight.toLowerCase().indexOf(filter.weight.toLowerCase()) !== -1
        &&  item.topsign.toLowerCase().indexOf(filter.topsign.toLowerCase()) !== -1
        &&  (item.hidden == filter.hidden || filter.hidden == null) ){
          return true;
        }
      }
    )
  }
}
