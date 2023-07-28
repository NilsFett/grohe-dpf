import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService} from '../../services/data.service';
import { TopSign } from '../../classes/TopSign';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { TopSignsFilter } from '../../pipes/topSigns/topSignsFilter';
import { ConfigService } from '../../services/config.service';
import { Image } from '../../classes/Image';

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

  public images:Image[] = [];
  public imagesById = {};
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
    if(this.dataService.images){
      this.images = this.dataService.images;
      for(let i = 0; i < this.images.length ; i++ ){
        this.imagesById[this.images[i].id] = this.images[i];
      }
    }
    else{
      this.dataService.imagesChange.subscribe(
        (images:Image[]) => {
          this.images = images;
          for(let i = 0; i < this.images.length ; i++ ){
            this.imagesById[this.images[i].id] = this.images[i];
          }
        }
      );
      this.dataService.loadImages();
    }
    this.ui.imageChoosen.subscribe( (image:Image)=>{
      console.log('dfsdf');
      this.currentDataSet.image = image.id;
      console.log(image);
      console.log(this.currentDataSet.image);
      this.ui.doHideMedias();
    });
  }

  public clearForm(){
    this.topSignForm = new FormGroup({
      image: new FormControl(''),
      title : new FormControl('',[Validators.required, Validators.minLength(2)]),
      type: new FormControl(''),
      articlenr : new FormControl('',[Validators.required, Validators.minLength(2)]),
      weight : new FormControl('',[Validators.required])
    });
  }

  public showNew(){
    this.clearForm();
    this.ui.doShowEditNew();
    this.currentDataSet = new TopSign();
  }

  filterChanges(){
      this.topSigns = this.topSignsFilter.transform(this.dataService.topSigns, this.filter);
      this.dataSource.data = this.topSigns;
  }

  public getImage(imageid){
    if(imageid && this.imagesById[imageid]){

      return `${this.config.baseURL}uploads/${this.imagesById[imageid].path}`;
    }
    else{
      return `${this.config.baseURL}uploads/no_pic_thumb.jpg`;
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
