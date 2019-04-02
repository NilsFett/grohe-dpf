import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService} from '../../services/data.service';
import { DisplaysPart } from '../../classes/DisplaysPart';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { DisplayPartsFilter } from '../../pipes/displayParts/displayPartsFilter'

@Component({
  selector: 'grohe-dpf-display-parts',
  templateUrl: './displayParts.component.html',
  styleUrls: ['./displayParts.component.css']
})
export class DisplayPartsComponent  {
  @ViewChild(MatSort) sort: MatSort;

  currentDataSet:DisplaysPart = null;
  dataSetToDelete:DisplaysPart = null;
  displayParts:DisplaysPart[] = [];
  filter = {
    articlenr:'',
    title:'',
    open_format:'',
    type:'',
    weight:''
  };

  columnsToDisplay = ['articlenr','title', 'weight', 'open_format', 'edit', 'delete'];
  dataSource :  MatTableDataSource<DisplaysPart>;
  displayPartForm = new FormGroup({
    title : new FormControl('',[Validators.required, Validators.minLength(2)]),
    articlenr : new FormControl('',[Validators.required, Validators.minLength(2)]),
    open_format : new FormControl('',[Validators.required, Validators.minLength(2)]),
    weight : new FormControl('',[Validators.required])
  });

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private displayPartsFilter: DisplayPartsFilter
  ) {
    this.dataSource = new MatTableDataSource(this.displayParts);

    if(this.dataService.displayParts){
      this.displayParts = this.displayPartsFilter.transform(this.dataService.displayParts, this.filter);
      this.dataSource.data = this.displayParts;
    }
    else{
      this.dataService.displayPartsChange.subscribe(
        (displayParts:DisplaysPart[]) => {
          this.displayParts = this.displayPartsFilter.transform(this.dataService.displayParts, this.filter);
          this.dataSource.data = this.displayParts;
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadDisplayParts();
    }
  }

  public showNew(){
    this.ui.doShowEditNew();;
    this.currentDataSet = new DisplaysPart();
  }

  filterChanges(){
      this.displayParts = this.displayPartsFilter.transform(this.dataService.displayParts, this.filter);
      this.dataSource.data = this.displayParts;
  }

  public save(){
    if (this.displayPartForm.status == 'VALID') {
      this.currentDataSet.title = this.displayPartForm.controls['title'].value;
      this.currentDataSet.articlenr = this.displayPartForm.controls['articlenr'].value;
      this.currentDataSet.open_format = this.displayPartForm.controls['open_format'].value;
      this.currentDataSet.weight = this.displayPartForm.controls['weight'].value;
      this.dataService.changeDisplayPart(this.currentDataSet);
    }
  }

  public setCurrentDataSet(currentDataSet){
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
    this.ui.doShowEditNew();
  }

  public showDelete(part){
    this.ui.doShowDelete();
    this.dataSetToDelete = part;
  }

  public deleteClose(part){
    this.dataSetToDelete = null;
    this.ui.showOverlay = false;
    this.ui.deleteSuccess = false;
  }

  public delete(){
    this.dataService.deleteDisplayPart(this.dataSetToDelete);
  }
}
