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
    stock:'',
    weight:'',
    hidden:null
  };

  columnsToDisplay = ['title', 'weight', 'articlenr', 'open_format', 'stock', 'deleted', 'edit', 'delete'];
  dataSource :  MatTableDataSource<DisplaysPart>;
  displayPartForm = new FormGroup({
    title : new FormControl('',[Validators.required, Validators.minLength(2)]),
    articlenr : new FormControl('',[Validators.required, Validators.minLength(2)]),
    open_format : new FormControl(''),
    stock : new FormControl(''),
    weight : new FormControl('',[Validators.required]),
    deleted : new FormControl('')
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
      this.dataSource.data = this.displayParts
      this.dataSource.sort = this.sort;
    }
    else{
      this.dataService.displayPartsChange.subscribe(
        (displayParts:DisplaysPart[]) => {
          console.log(this.dataService.displayParts);
          this.displayParts = this.displayPartsFilter.transform(this.dataService.displayParts, this.filter);
          this.dataSource.data = this.displayParts
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadDisplayParts();
    }

    this.displayPartForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  public showNew(){
    this.ui.showOverlay = true;
    this.currentDataSet = new DisplaysPart();
    this.updateForm();
  }

  filterChanges(){
      this.displayParts = this.displayPartsFilter.transform(this.dataService.displayParts, this.filter);
      this.dataSource.data = this.displayPartsFilter.transform(this.dataService.displayParts, this.filter);
  }

  public save(){
    if (this.displayPartForm.status == 'VALID') {
      this.currentDataSet.title = this.displayPartForm.controls['title'].value;
      this.currentDataSet.articlenr = this.displayPartForm.controls['articlenr'].value;
      this.currentDataSet.open_format = this.displayPartForm.controls['open_format'].value;
      this.currentDataSet.stock = this.displayPartForm.controls['stock'].value;
      this.currentDataSet.weight = this.displayPartForm.controls['weight'].value;
      if( this.displayPartForm.controls['deleted'].value === true ){
        this.currentDataSet.deleted = 1;
      }
      else{
        this.currentDataSet.deleted = 0;
      }

      this.dataService.changeDisplayPart(this.currentDataSet);
    }
  }

  public setCurrentDataSet(currentDataSet){
    this.ui.showOverlay = true;
    this.currentDataSet = currentDataSet;
    this.updateForm();
  }

  private updateForm(){
    this.displayPartForm.patchValue({
      title: this.currentDataSet.title,
      articlenr: this.currentDataSet.articlenr,
      open_format: this.currentDataSet.open_format,
      stock: this.currentDataSet.stock,
      weight: this.currentDataSet.weight,
      deleted: this.currentDataSet.deleted
    });
  }

  public showDelete(part){
    this.ui.showOverlay = true;
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
