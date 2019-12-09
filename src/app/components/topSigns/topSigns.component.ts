import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService} from '../../services/data.service';
import { TopSign } from '../../classes/TopSign';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { TopSignsFilter } from '../../pipes/topSigns/topSignsFilter';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'grohe-dpf-topsigns',
  templateUrl: './topSigns.component.html',
  styleUrls: ['./topSigns.component.css']
})
export class TopSignsComponent  {
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  currentDataSet:TopSign = null;
  dataSetToDelete:TopSign = null;
  topSigns:TopSign[] = [];
  filter = {
    articlenr:'',
    title:'',
    weight:''
  };
  public images = {
    0: 'uploads/no_pic_thumb.jpg',
    1: 'uploads/dp1.jpg',
    2: 'uploads/dp2.jpg',
    3: 'uploads/dp3.jpg',
    10: 'uploads/afd1707d12f77e13ad77ba0fc17e9f83.jpg',
    11: 'uploads/773a7998644c720179ac7636d13db2c8.jpg',
    12: 'uploads/3858f5b37715465e7d7407d14f664a5f.jpg',
    13: 'uploads/b8ab04829399a0a70fdaa2abb4ef7924.jpg',
    14: 'uploads/5f78313fceb9d1ab61815e1cb7ed1969.jpg',
    15: 'uploads/e2f35a7d3761f87697d032ac43fe7081.jpg',
    16: 'uploads/1e7d0d4eeb42492d8138a3decc90955f.jpg',
  };
  columnsToDisplay = ['image','articlenr','title', 'weight', 'type', 'edit', 'delete'];
  dataSource :  MatTableDataSource<TopSign>;
  topSignForm = new FormGroup({
    image: new FormControl(''),
    title : new FormControl('',[Validators.required, Validators.minLength(2)]),
    type: new FormControl(''),
    articlenr : new FormControl('',[Validators.required, Validators.minLength(2)]),
    weight : new FormControl('',[Validators.required])
  });
  types=['','Top Sign', 'Promotion Material'];

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private topSignsFilter: TopSignsFilter,
    public config: ConfigService
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

  public getImage(imageid){

    if(imageid && this.images[imageid]){
      return `${this.config.baseURL}${this.images[imageid]}`;
    }
    else{
      return `${this.config.baseURL}${this.images[0]}`;
    }
  }

  public save(){
    if (this.topSignForm.status == 'VALID') {
      this.currentDataSet.title = this.topSignForm.controls['title'].value;
      this.currentDataSet.articlenr = this.topSignForm.controls['articlenr'].value;
      this.currentDataSet.type = this.topSignForm.controls['type'].value;
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
      type: currentDataSet.type,
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

  public selectImage(){
    this.ui.doShowMedias();
  }
/*
  ngOnDestroy(){
    this.ui.imageChoosen.unsubscribe();
  }
*/
}
