import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productsFilter',
  pure: false
})
export class ProductsFilter implements PipeTransform{
  transform(items:any[], filter: any): any {
    if( !items  || ! filter ){
      return items;
    }
    return items.filter(
      item => {
        if( item.DFID.toLowerCase().indexOf(filter.DFID.toLowerCase()) !== -1
        &&  item.SAP.toLowerCase().indexOf(filter.SAP.toLowerCase()) !== -1
        &&  item.title.toLowerCase().indexOf(filter.title.toLowerCase()) !== -1
        &&  (!item.top_sign_title || item.top_sign_title.toLowerCase().indexOf(filter.TopSign.toLowerCase()) !== -1)
        && (item.hide === '0' || filter.showHidden === true)

      ){
          return true;
        }
      }
    )
  }
}
