import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService} from '../../services/data.service';
import { TopSign } from '../../classes/TopSign';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { TopSignsFilter } from '../../pipes/topSigns/topSignsFilter'

@Component({
  selector: 'grohe-dpf-topsigns',
  templateUrl: './topSigns.component.html',
  styleUrls: ['./topSigns.component.css']
})
export class TopSignsComponent  {
  @ViewChild(MatSort) sort: MatSort;

  currentDataSet:TopSign = null;
  dataSetToDelete:TopSign = null;
  topSigns:TopSign[] = [];
  filter = {
    articlenr:'',
    title:'',
    weight:''
  };

  columnsToDisplay = ['image','articlenr','title', 'weight', 'edit', 'delete'];
  dataSource :  MatTableDataSource<TopSign>;
  topSignForm = new FormGroup({
    title : new FormControl('',[Validators.required, Validators.minLength(2)]),
    articlenr : new FormControl('',[Validators.required, Validators.minLength(2)]),
    weight : new FormControl('',[Validators.required])
  });

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private topSignsFilter: TopSignsFilter
  ) {
    this.dataSource = new MatTableDataSource(this.topSigns);

    if(this.dataService.topSigns){
      this.topSigns = this.topSignsFilter.transform(this.dataService.topSigns, this.filter);
      this.dataSource.data = this.topSigns;
    }
    else{
      this.dataService.topSignsChange.subscribe(
        (topSigns:TopSign[]) => {
          this.topSigns = this.topSignsFilter.transform(this.dataService.topSigns, this.filter);
          this.dataSource.data = this.topSigns;
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadTopSigns();
    }
  }

  public showNew(){
    this.ui.doShowEditNew();;
    this.currentDataSet = new TopSign();
  }

  filterChanges(){
      this.topSigns = this.topSignsFilter.transform(this.dataService.topSigns, this.filter);
      this.dataSource.data = this.topSigns;
  }

  public save(){
    if (this.topSignForm.status == 'VALID') {
      this.currentDataSet.title = this.topSignForm.controls['title'].value;
      this.currentDataSet.articlenr = this.topSignForm.controls['articlenr'].value;
      this.currentDataSet.weight = this.topSignForm.controls['weight'].value;
      this.dataService.changeTopSign(this.currentDataSet);
    }
  }

  public setCurrentDataSet(currentDataSet){
    this.ui.showOverlay = true;
    this.currentDataSet = currentDataSet;
    this.topSignForm.patchValue({
      title: currentDataSet.title,
      articlenr: currentDataSet.articlenr,
      weight: currentDataSet.weight
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
    this.dataService.deleteTopSign(this.dataSetToDelete);
  }
}
