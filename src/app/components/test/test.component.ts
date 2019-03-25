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

  displayedColumns: string[] = ['id','mail', 'name','surname'];
  dataSource = new MatTableDataSource(this.users);
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
  ) { }

  async ngOnInit() {
    await this.getUsers();
    this.dataSource.sort = this.sort;
  }

  async getUsers() {
    let r = await this.dataService.getUsers();
    if (r != null) {
      for (let index = 0; index < 116; index++) {
        if(r[index]){
          this.users.push(r[index]);
          }
      }
    }
    else {
      console.log("err");
      
    }
  }

}
