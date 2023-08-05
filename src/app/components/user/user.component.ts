import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UiService } from '../../services/ui.service';
import { DataService } from '../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/classes/User';
import { UserFilter } from 'src/app/pipes/user/userFilter';

@Component({
  selector: 'grohe-dpf-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  currentDataSet: User = null;
  dataSetToDelete: User = null;
  users: User[] = [];
  filter = {
    name: '',
    surname: '',
    city: '',
    country: '',
    department: '',
    mail: '',
    usertype: '',
    deleted:null
  };

  columnsToDisplay = [ 'surname', 'name',  'city', 'country', 'department', 'mail', 'costno','description', 'usertype', 'deleted', 'edit', 'delete'];
  dataSource: MatTableDataSource<User>;
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    surname: new FormControl(''),
    city: new FormControl(''),
    country: new FormControl(''),
    department: new FormControl(''),
    mail: new FormControl('', [Validators.required, Validators.minLength(2)]),
    phone: new FormControl(''),
    fax: new FormControl(''),
    usertype: new FormControl(''),
    costno: new FormControl(''),
    description: new FormControl(''),
    deleted: new FormControl()
  });

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private userFilter: UserFilter
  ) {
    this.dataSource = new MatTableDataSource(this.users);
    this.ui.view = 'admin';
    if (this.dataService.users) {
      this.users = this.userFilter.transform(this.dataService.users, this.filter);
      this.dataSource.data = this.users;
      this.dataSource.sort = this.sort;
    }
    else {
      this.dataService.userChange.subscribe(
        (users: User[]) => {
          this.users = this.userFilter.transform(this.dataService.users, this.filter);
          this.dataSource.data = this.users;
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadUsers();
    }

/*
    this.userForm.valueChanges.subscribe(val => {
      console.log(val);
    });
*/
  }

  ngOnInit() {
      this.dataSource.sort = this.sort;
  }

  filterChanges() {
    this.users = this.userFilter.transform(this.dataService.users, this.filter);
    this.dataSource.data = this.userFilter.transform(this.dataService.users, this.filter);
  }

  public showNew() {
    this.ui.doShowEditNew();
    this.currentDataSet = new User();
    this.updateFormValues();
  }

  public save() {
    if (this.userForm.status == 'VALID') {
      this.currentDataSet.mail = this.userForm.controls['mail'].value;
      this.currentDataSet.name = this.userForm.controls['name'].value;
      this.currentDataSet.surname = this.userForm.controls['surname'].value;
      this.currentDataSet.department = this.userForm.controls['department'].value;
      this.currentDataSet.city = this.userForm.controls['city'].value;
      this.currentDataSet.costno = this.userForm.controls['costno'].value;
      this.currentDataSet.description = this.userForm.controls['description'].value;
      if( this.userForm.controls['deleted'].value === true ){
        this.currentDataSet.deleted = 1;
      }
      else{
        this.currentDataSet.deleted = 0;
      }
      this.dataService.changeUser(this.currentDataSet);
    }
  }

  public setCurrentDataSet(currentDataSet) {
    this.ui.showOverlay = true;
    this.currentDataSet = currentDataSet;
    this.updateFormValues();
  }

  private updateFormValues(){
    this.userForm.patchValue({
      name: this.currentDataSet.name,
      surname: this.currentDataSet.surname,
      city: this.currentDataSet.city,
      country: this.currentDataSet.country,
      department: this.currentDataSet.department,
      mail: this.currentDataSet.mail,
      phone: this.currentDataSet.phone,
      fax: this.currentDataSet.fax,
      usertype: this.currentDataSet.usertype,
      costno: this.currentDataSet.costno,
      description: this.currentDataSet.description,
      deleted: this.currentDataSet.deleted.toString()
    });
  }

  public showDelete(part) {
    this.ui.doShowDelete();
    this.dataSetToDelete = part;
  }

  public deleteClose(part) {
    this.dataSetToDelete = null;
    this.ui.showOverlay = false;
    this.ui.deleteSuccess = false;
  }

  public delete() {
    this.dataService.deleteUser(this.dataSetToDelete);
  }

  public sendPassword(){
    this.dataService.sendPassword(this.currentDataSet);


  }
}
