import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userFilter',
  pure: false
})
export class UserFilter implements PipeTransform{
  transform(items:any[], filter: any): any {
    console.log('UserFilter');
    console.log(filter);
    if( !items  || ! filter ){
      return items;
    }
    console.log(filter);

    return items.filter(
      item => {
        if( item.userEmail.toLowerCase().indexOf(filter.articlenr.toLowerCase()) !== -1
        &&  item.firstName.toLowerCase().indexOf(filter.title.toLowerCase()) !== -1
        &&  item.lastName.toLowerCase().indexOf(filter.extra.toLowerCase()) !== -1
        &&  item.type.toLowerCase().indexOf(filter.type.toLowerCase()) !== -1
        &&  (item.hidden == filter.hidden || filter.hidden == null) ){
          return true;
        }
      }
    )
  }
}
