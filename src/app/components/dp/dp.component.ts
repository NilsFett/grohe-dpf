import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UiService } from '../../services/ui.service';
import { DataService } from '../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Dp } from 'src/app/classes/Dp';


@Component({
  selector: 'app-dp',
  templateUrl: './dp.component.html',
  styleUrls: ['./dp.component.css']
})
export class DpComponent {
  @ViewChild(MatSort) sort: MatSort;

  currentDataSet: Dp = null;
  dataSetToDelete: Dp = null;
  dps: Dp[] = [];
  filter = {
    articlenr: '',
    title: '',
    open_format: '',
    type: '',
    stock: '',
    weight: '',

    hidden: null
  };

  columnsToDisplay = ['title', 'weight', 'articlenr', 'open_format', 'stock', 'deleted', 'edit', 'delete'];
  dataSource: MatTableDataSource<Dp>;
  displayPartForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    articlenr: new FormControl('', [Validators.required, Validators.minLength(2)]),
    open_format: new FormControl(''),
    stock: new FormControl(''),
    weight: new FormControl('', [Validators.required]),
    deleted: new FormControl('')
  });

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,

  ) {
    console.log('constructor');
    
    this.dataSource = new MatTableDataSource(this.dps);

    if (this.dataService.dps) {
      this.dataSource = new MatTableDataSource(this.dataService.dps);
      this.dataSource.sort = this.sort;
    }
    else {
      this.dataService.dpsChange.subscribe(
        (dps: Dp[]) => {
          this.dataSource = new MatTableDataSource(dps);
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadDps();
    }
    console.log(this.dataService.dps);

    this.displayPartForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  public showNew() {
    this.ui.showOverlay = true;
    this.currentDataSet = new Dp();
  }

  filterChanges() {
    // this.dps = this.dpsFilter.transform(this.dataService.dps, this.filter);
    // this.dataSource.data = this.dpsFilter.transform(this.dataService.dps, this.filter);
    this.dps = this.dataService.dps;
    this.dataSource.data =this.dataService.dps;
    console.log(this.dps);

  }

  public save() {
    this.currentDataSet.title = this.displayPartForm.controls['title'].value;
    this.currentDataSet.articlenr = this.displayPartForm.controls['articlenr'].value;
    this.currentDataSet.open_format = this.displayPartForm.controls['open_format'].value;
    this.currentDataSet.stock = this.displayPartForm.controls['stock'].value;
    this.currentDataSet.weight = this.displayPartForm.controls['weight'].value;
    this.currentDataSet.deleted = this.displayPartForm.controls['deleted'].value;
    this.dataService.changeDisplayPart(this.currentDataSet);
  }

  public setCurrentDataSet(currentDataSet) {
    this.ui.showOverlay = true;
    this.currentDataSet = currentDataSet;
    this.displayPartForm.patchValue({
      title: currentDataSet.title,
      articlenr: currentDataSet.articlenr,
      open_format: currentDataSet.open_format,
      stock: currentDataSet.stock,
      weight: currentDataSet.weight,
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
    this.dataService.deleteDisplayPart(this.dataSetToDelete);
  }
}
