import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UiService } from '../../services/ui.service';
import { DataService } from '../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { User } from 'src/app/classes/User';
import { UserFilter } from 'src/app/pipes/user/userFilter';

@Component({
  selector: 'grohe-dpf-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @ViewChild(MatSort) sort: MatSort;

  currentDataSet: User = null;
  dataSetToDelete: User = null;
  users: User[] = [];
  filter = {
    mail: '',
    name: '',
    surname: '',
    department: '',
    city: '',
    hidden: null
  };

  columnsToDisplay = [ 'name', 'surname', 'mail', 'department', 'city', 'country', 'usertype', 'deleted', 'edit', 'delete'];
  dataSource: MatTableDataSource<User>;
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    surname: new FormControl(''),
    mail: new FormControl('', [Validators.required, Validators.minLength(2)]),
    department: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl(''),
    usertype: new FormControl(''),
    deleted: new FormControl('')
  });

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private userFilter: UserFilter
  ) {
    this.dataSource = new MatTableDataSource(this.users);

    if (this.dataService.users) {
      this.dataSource = new MatTableDataSource(this.dataService.users);
      this.dataSource.sort = this.sort;
    }
    else {
      this.dataService.userChange.subscribe(
        (users: User[]) => {
          this.dataSource = new MatTableDataSource(users);
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadUsers();
    }
    console.log(this.dataService.users);

    this.userForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  public showNew() {
    this.ui.showOverlay = true;
    this.currentDataSet = new User();
  }

  filterChanges() {
    this.users = this.dataService.users;
    this.dataSource.data = this.dataService.users;
    // this.users = this.userFilter.transform(this.dataService.users, this.filter);
    // this.dataSource.data = this.userFilter.transform(this.dataService.users, this.filter);
  }

  public save() {
    this.currentDataSet.mail = this.userForm.controls['mail'].value;
    this.currentDataSet.name = this.userForm.controls['name'].value;
    this.currentDataSet.surname = this.userForm.controls['surname'].value;
    this.currentDataSet.department = this.userForm.controls['department'].value;
    this.currentDataSet.city = this.userForm.controls['city'].value;
    this.currentDataSet.deleted = this.userForm.controls['deleted'].value;
    // this.dataService.changeUSer(this.currentDataSet);
  }

  public setCurrentDataSet(currentDataSet) {
    this.ui.showOverlay = true;
    this.currentDataSet = currentDataSet;
    this.userForm.patchValue({
      mail: currentDataSet.mail,
      name: currentDataSet.name,
      surname: currentDataSet.surname,
      department: currentDataSet.department,
      city: currentDataSet.city,
      deleted: currentDataSet.deleted
    });
  }

  public showDelete(part) {
    this.ui.showOverlay = true;
    this.dataSetToDelete = part;
  }

  public deleteClose(part) {
    this.dataSetToDelete = null;
    this.ui.showOverlay = false;
    this.ui.deleteSuccess = false;
  }

  public delete() {
    // this.dataService.deleteUser(this.dataSetToDelete);
  }
}
