import { Component, Input, ViewChild, OnDestroy} from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService } from '../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Display } from '../../classes/display';
import { Image } from '../../classes/Image';
import { DisplaysPart } from '../../classes/DisplaysPart';
import { ConfigService } from '../../services/config.service';
import { DisplaysFilter } from '../../pipes/displays/displaysFilter';
import { displayTemplates } from '../../classes/DisplayTemplates';


@Component({
  selector: 'grohe-dpf-login',
  templateUrl: './displayCompose.component.html',
  styleUrls: ['./displayCompose.component.css']
})
export class DisplayComposeComponent implements OnDestroy{
  @ViewChild(MatSort) sort: MatSort;
  currentDataSet: Display = null;
  dataSetToDelete: Display = null;
  displays:Display[] = [];
  showAssembly:boolean=false;
  showChooseTemplate:boolean=false;
  displayParts:DisplaysPart[] = [];
  partsSearchword:string = '';

  columnsToDisplay = [ 'image', 'title', 'articlenr', 'displaytype', 'topsign_punch', 'instruction', 'edit', 'delete'];
  dataSource: MatTableDataSource<Display>;
  displayForm = new FormGroup({
    image: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    articlenr: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(8)]),
    displaytype: new FormControl(''),
    topsign_punch: new FormControl(''),
    instruction: new FormControl('', [Validators.required])
  });
  filter = {
    title: '',
    articlenr: '',
    displaytype: '',
    topsign_punch: ''
  };
  public images = {
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

  public partsList:DisplaysPart[] = [];

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private displayFilter: DisplaysFilter,
    public config: ConfigService
  ) {
    this.dataSource = new MatTableDataSource(this.displays);

    if (this.dataService.displays) {
      this.displays = this.displayFilter.transform(this.dataService.displays, this.filter);
      this.dataSource.data = this.displays;
      this.dataSource.sort = this.sort;
    }
    else {
      this.dataService.displaysChange.subscribe(
        (users: Display[]) => {
          this.displays = this.displayFilter.transform(this.dataService.displays, this.filter);
          this.dataSource.data = this.displays;
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadDisplays();
    }

    if(this.dataService.displayParts){
      this.displayParts = this.dataService.displayParts;
    }
    else{
      this.dataService.displayPartsChange.subscribe(
        (displayParts:DisplaysPart[]) => {
          this.displayParts = displayParts;
        }
      );
      this.dataService.loadDisplayParts();
    }
    this.ui.imageChoosen.subscribe( (image:Image)=>{
      this.currentDataSet.image = image.id;
      this.ui.doHideMedias();

    });
  }

  public filterChanges() {
    this.displays = this.displayFilter.transform(this.dataService.displays, this.filter);
    this.dataSource.data = this.displays;
  }

  public getImage(imageid){
      return `${this.config.baseURL}${this.images[imageid]}`;
  }

  public showNew() {
    this.ui.doShowEditNew();
    this.showChooseTemplate = false;
    this.currentDataSet = new Display();
    this.updateFormValues();
  }

  public templateChoosen(templateid){
    this.currentDataSet = displayTemplates.displayTemplates[templateid].display;
    this.partsList = displayTemplates.displayTemplates[templateid].parts;
    this.ui.showOverlay = true;
    this.showChooseTemplate = false;
    this.showAssembly = true;
    this.ui.doShowEditNew();
    this.updateFormValues();
  }

  public showChooseTemplateOverlay(){
    this.showChooseTemplate = true;
    this.ui.showOverlay = true;
  }

  public hideChooseTemplateOverlay(){
    this.showChooseTemplate = false;
    this.ui.showOverlay = false;
  }

  public setCurrentDataSet(currentDataSet:Display) {

    this.currentDataSet = currentDataSet;
    this.ui.doShowEditNew();
    this.updateFormValues();

    if(this.dataService.displayPartsByDisplayId[currentDataSet.id]){
      this.partsList = this.dataService.displayPartsByDisplayId[currentDataSet.id];
    }
    else{
      this.dataService.displayPartsByDisplayIdChange.subscribe((displayParts: DisplaysPart[]) => {
        this.partsList = displayParts;
      });
      this.dataService.loadDisplasPartsByDisplayId(currentDataSet.id);
    }
  }

  private updateFormValues(){
    this.displayForm.patchValue({
      title: this.currentDataSet.title,
      articlenr: this.currentDataSet.articlenr,
      displaytype: this.currentDataSet.displaytype,
      topsign_punch: this.currentDataSet.topsign_punch,
      instruction: this.currentDataSet.instruction
    });
  }

  public showDelete(part) {
    this.dataSetToDelete = part;
    this.ui.doShowDelete();
  }

  public deleteClose(part) {
    this.dataSetToDelete = null;
    this.ui.doCloseDelete();
  }

  public delete() {
    this.dataService.deleteDisplay(this.dataSetToDelete);
  }

  public partsSearchwordChanged(searchword){
    this.partsSearchword = searchword;
  }

  public removeDisplayPartFromPartList(diplayPart:DisplaysPart){
    if( diplayPart.units == 1){
      let index = this.partsList.indexOf(diplayPart);
      if( index > -1 ){
        this.partsList.splice(index,1);
      }
    }
    else{
      diplayPart.units--;
    }
  }

  public addDisplayPartToPartList(diplayPart:DisplaysPart){
    var i;
    var found = false;
    for(i = 0; i < this.partsList.length; i++){
      if( this.partsList[i].articlenr  == diplayPart.articlenr ){
        this.partsList[i].units++;
        found = true;
      }
    }
    if(!found){
      diplayPart.units = 1;
      this.partsList.push(diplayPart);
    }
  }

  public saveDisplaysAndPartList(){
    if (this.displayForm.status == 'VALID') {
      this.currentDataSet.title = this.displayForm.controls['title'].value;
      this.currentDataSet.articlenr = this.displayForm.controls['articlenr'].value;
      this.currentDataSet.displaytype = this.displayForm.controls['displaytype'].value;
      this.currentDataSet.topsign_punch = this.displayForm.controls['topsign_punch'].value;
      this.currentDataSet.instruction = this.displayForm.controls['instruction'].value;
      this.dataService.saveDisplayAndPartList(this.currentDataSet, this.partsList);
    }
    else{
      this.showAssembly = false;
      this.displayForm.updateValueAndValidity();
    }
  }

  public testOutput(){
    this.updateFormValues();
  }

  public formValidateAfterIf(){
    Object.keys(this.displayForm.controls).forEach(field => { // {1}
      const control = this.displayForm.get(field);            // {2}
      control.markAsTouched({ onlySelf: true });       // {3}
    });
  }

  public selectImage(){
    this.ui.doShowMedias();
  }

  ngOnDestroy(){
    this.ui.imageChoosen.unsubscribe();
  }
}
