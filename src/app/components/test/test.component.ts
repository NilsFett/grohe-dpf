import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UiService } from 'src/app/services/ui.service';
import { DataService } from 'src/app/services/data.service';
import { User } from 'src/app/classes/User';
import {MatSort, MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  users: User[] = [];

  displayedColumns: string[] = ['id','mail', 'name','surname','parent'];
  dataSource = new MatTableDataSource(this.users);
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
  ) { }

  async ngOnInit() {
    //await this.getUsers();
    this.dataSource.sort = this.sort;
    console.log("mapping...");
    var a= this.flatListToTreeViewData(this.users);
    console.log(a);

    console.log("mapping...OK");

  }

  flatListToTreeViewData(dataList) {
    var tree = [],
        mappedArr = {},
        arrElem,
        mappedElem;

    for (var i = 0, len = dataList.length; i < len; i++) {
        arrElem = dataList[i];
        mappedArr[arrElem.id] = arrElem;
        mappedArr[arrElem.id]['children'] = [];
    }

    for (var id in mappedArr) {
      console.log(id);
        if (mappedArr.hasOwnProperty(id)) {
          console.log("-1");

            mappedElem = mappedArr[id];
            console.log("-2");

            if (mappedElem.parent) {
              console.log("-3");
              console.log(mappedArr[mappedElem['parent']]);
                mappedArr[mappedElem['parent']]['children'].push(mappedElem);
            }else {
                tree.push(mappedElem);
            }
        }
    }
    return tree;
}
/*
  async getUsers() {
    let r = await this.dataService.getUsers();
    if (r != null) {
      for (let index = 0; index < 116; index++) {
        if(r[index]){
          this.users.push(r[index]);
          }
      }
      var i=0;
      this.users.forEach(element => {
        i++;
        if(i<10){
          element.parent = 0;
        }
        else if(i<20){
          element.parent = this.users[0].id;
        }
        else if(i<30){
          element.parent = this.users[1].id;
        }
        else if(i<40){
          element.parent = this.users[2].id;
        }
        else if(i<50){
          element.parent = this.users[12].id;
        }
        // else if(i<100){
        //   element.parent = 6;
        // }
        else element.parent = this.users[3].id;

      });
    }
    else {
      console.log("err");

    }
  }
*/
}
