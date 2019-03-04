import { Component, Input, ViewChild, OnInit } from '@angular/core';
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
export class DisplayPartsComponent  implements OnInit{
  @ViewChild(MatSort) sort: MatSort;

  currentDataSet:DisplaysPart = null;
  dataSetToDelete:DisplaysPart = null;
  displayParts:DisplaysPart[] = [];
  filter = {
    title:'',
    articlenr:'',
    weight:'',
    open_format:'',
    stock:'',
    hidden:null
  };

  columnsToDisplay = ['title', 'articlenr', 'weight', 'open_format', 'stock', 'deleted', 'edit', 'delete'];
  dataSource: MatTableDataSource<DisplaysPart> = null;
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
      this.dataSource = new MatTableDataSource(this.displayParts);
      this.dataSource.sort = this.sort;
      //this.currentDataSet = this.displayParts[0];
    }
    else{
      this.dataService.displayPartsChange.subscribe(
        (displayParts:DisplaysPart[]) => {
          this.displayParts = displayParts;
          this.dataSource = new MatTableDataSource(this.displayParts);
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadDisplayParts();
    }

    this.displayPartForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  ngOnInit() {
      this.dataSource.sort = this.sort;
  }

  filterChanges(){
    this.displayParts = this.displayPartsFilter.transform(this.dataService.displayParts, this.filter);
    this.dataSource.data = this.displayPartsFilter.transform(this.dataService.displayParts, this.filter);
    //this.dataSource = new MatTableDataSource(this.displayParts);
  }

  public showNew(){
    this.ui.showOverlay = true;
    this.currentDataSet = new DisplaysPart();
  }

  public save(){
    this.currentDataSet.title = this.displayPartForm.controls['title'].value;
    this.currentDataSet.articlenr = this.displayPartForm.controls['articlenr'].value;
    this.currentDataSet.open_format = this.displayPartForm.controls['open_format'].value;
    this.currentDataSet.stock = this.displayPartForm.controls['stock'].value;
    this.currentDataSet.weight = this.displayPartForm.controls['weight'].value;
    this.currentDataSet.deleted = this.displayPartForm.controls['deleted'].value;
    this.dataService.changeDisplayPart(this.currentDataSet);
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
