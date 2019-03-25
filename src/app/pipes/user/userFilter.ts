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
        if( item.mail.toLowerCase().indexOf(filter.mail.toLowerCase()) !== -1
        &&  item.name.toLowerCase().indexOf(filter.name.toLowerCase()) !== -1
        &&  item.surname.toLowerCase().indexOf(filter.surname.toLowerCase()) !== -1
        &&  item.department.toLowerCase().indexOf(filter.department.toLowerCase()) !== -1
        &&  item.city.toLowerCase().indexOf(filter.city.toLowerCase()) !== -1
        &&  (item.hidden == filter.hidden || filter.hidden == null) ){
          return true;
        }
      }
    )
  }
}
