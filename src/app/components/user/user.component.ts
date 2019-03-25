import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UiService } from 'src/app/services/ui.service';
import { DataService } from 'src/app/services/data.service';
import { UserFilter } from 'src/app/pipes/user/userFilter';
import { MatSort, MatTableDataSource } from '@angular/material';
import { User } from 'src/app/classes/User';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  currentDataSet: User = null;
  dataSetToDelete: User = null;
  users: User[] = [];
  filter = {
    userEmail: '',
    firstName: '',
    lastName: '',
    type: '',
    hidden: null
  };

  columnsToDisplay = ['userEmail', 'firstName', 'lastName', 'type', 'hidden', 'edit', 'delete'];
  dataSource: MatTableDataSource<User> = null;
  userForm = new FormGroup({
    userEmail: new FormControl('', [Validators.required, Validators.minLength(2)]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl(''),
    type: new FormControl(''),
    hidden: new FormControl('')
  });

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private userFilter: UserFilter
  ) {
    
    this.dataSource = new MatTableDataSource(this.users);
    if (this.dataService.users) {
      this.users = this.userFilter.transform(this.dataService.users, this.filter);
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
    }
    else {
      this.dataService.userChange.subscribe(
        (users: User[]) => {
          this.users = users;
          this.dataSource = new MatTableDataSource(this.users);
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadArticles();
    }
    console.log(this.users);
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
  }

  filterChanges() {
    this.users = this.userFilter.transform(this.dataService.users, this.filter);
    this.dataSource.data = this.userFilter.transform(this.dataService.users, this.filter);
  }

  public showNew() {
    this.ui.showOverlay = true;
    this.currentDataSet = new User();
  }

  public save() {
    this.currentDataSet.email = this.userForm.controls['userEmail'].value;
    this.currentDataSet.firstName = this.userForm.controls['fisrtName'].value;
    this.currentDataSet.lastName = this.userForm.controls['lastName'].value;
    this.currentDataSet.type = this.userForm.controls['type'].value;
    this.currentDataSet.hidden = this.userForm.controls['hidden'].value;
  }

  public setCurrentDataSet(currentDataSet) {
    this.ui.showOverlay = true;
    this.currentDataSet = currentDataSet;
    this.userForm.patchValue({
      userEmail: currentDataSet.userEmail,
      firstName: currentDataSet.firstName,
      lastName: currentDataSet.lastName,
      type: currentDataSet.type
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
  }
}
