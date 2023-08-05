import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService} from '../../services/data.service';
import { DisplaysPart } from '../../classes/DisplaysPart';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DisplayPartsFilter } from '../../pipes/displayParts/displayPartsFilter'

@Component({
  selector: 'grohe-dpf-display-parts',
  templateUrl: './displayParts.component.html',
  styleUrls: ['./displayParts.component.css']
})
export class DisplayPartsComponent  {
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  currentDataSet:DisplaysPart = null;
  dataSetToDelete:DisplaysPart = null;
  displayParts:DisplaysPart[] = [];
  filter = {
    articlenr:'',
    title:'',
    length:'',
    width:'',
    height:'',
    type:'',
    weight:'',
    stock:''
  };

  columnsToDisplay = ['articlenr','title', 'weight', 'length', 'width', 'height', 'edit', 'delete'];
  dataSource :  MatTableDataSource<DisplaysPart>;
  displayPartForm = new FormGroup({
    title : new FormControl('',[Validators.required, Validators.minLength(2)]),
    articlenr : new FormControl('',[Validators.required, Validators.minLength(2)]),
    weight : new FormControl('',[Validators.required]),
    length : new FormControl(''),
    width : new FormControl(''),
    height : new FormControl(''),
    stock : new FormControl('')
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
          console.log(this.dataService.displayParts);
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
    this.clearForm();
  }

  public clearForm(){
    this.displayPartForm = new FormGroup({
      title : new FormControl('',[Validators.required, Validators.minLength(2)]),
      articlenr : new FormControl('',[Validators.required, Validators.minLength(2)]),
      weight : new FormControl('',[Validators.required]),
      length : new FormControl(''),
      width : new FormControl(''),
      height : new FormControl(''),
      stock : new FormControl('')
    });
  }

  filterChanges(){
      this.displayParts = this.displayPartsFilter.transform(this.dataService.displayParts, this.filter);
      this.dataSource.data = this.displayParts;
  }

  public save(){
    if (this.displayPartForm.status == 'VALID') {
      this.currentDataSet.title = this.displayPartForm.controls['title'].value;
      this.currentDataSet.articlenr = Number(this.displayPartForm.controls['articlenr'].value);
      
      this.currentDataSet.weight = Number(this.displayPartForm.controls['weight'].value);
      this.currentDataSet.length = this.displayPartForm.controls['length'].value;
      this.currentDataSet.width = this.displayPartForm.controls['width'].value;
      this.currentDataSet.height = this.displayPartForm.controls['height'].value;
      this.dataService.changeDisplayPart(this.currentDataSet);
    }
  }

  public setCurrentDataSet(currentDataSet){
    this.ui.showOverlay = true;
    this.currentDataSet = currentDataSet;
    this.displayPartForm.patchValue({
      title: currentDataSet.title,
      articlenr: currentDataSet.articlenr,
      length: currentDataSet.length,
      width: currentDataSet.width,
      height: currentDataSet.height,
      stock: currentDataSet.stock,
      weight: currentDataSet.weight
      // deleted: currentDataSet.deleted
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
