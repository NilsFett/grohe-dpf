import { Component, Input, ViewChild, OnDestroy} from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService } from '../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
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
  @ViewChild(MatSort, {static: false}) sort!: MatSort;
  currentDataSet: Display = null;
  dataSetToDelete: Display = null;
  displays:Display[] = [];
  showAssembly:boolean=false;
  showChooseTemplate:boolean=false;
  displayParts:DisplaysPart[] = [];
  displayPartsById = {}
  partsSearchword:string = '';

  columnsToDisplay = [ 'image', 'title', 'articlenr', 'displaytype'/*, 'topsign_punch'*/, 'instruction', 'edit', 'delete'];
  dataSource: MatTableDataSource<Display>;
  displayForm = new FormGroup({
    image: new FormControl(''),
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    articlenr: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(8)]),
    displaytype: new FormControl(''),
    /*topsign_punch: new FormControl(''),*/
    instruction: new FormControl('', [Validators.required])
  });
  filter = {
    title: '',
    articlenr: '',
    displaytype: ''/*,
    topsign_punch: ''*/
  };

  instructions = [
    "","Euphoria","Rainshower","Standard"
  ];

  public images:Image[] = [];
  public imagesById = {};
  public partsList:DisplaysPart[] = [];

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private displayFilter: DisplaysFilter,
    public config: ConfigService
  ) {
    this.ui.view = 'admin';
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
      for(let i = 0; i < this.displayParts.length ; i++ ){
        this.displayPartsById[this.displayParts[i].articlenr] = this.displayParts[i];
      }
    }
    else{
      this.dataService.displayPartsChange.subscribe(
        (displayParts:DisplaysPart[]) => {
          this.displayParts = displayParts;
          for(let i = 0; i < this.displayParts.length ; i++ ){
            this.displayPartsById[this.displayParts[i].articlenr] = this.displayParts[i];
          }
        }
      );
      this.dataService.loadDisplayParts();
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
      this.currentDataSet.image = image.id;
      this.ui.doHideMedias();
    });
  }

  public filterChanges() {
    this.displays = this.displayFilter.transform(this.dataService.displays, this.filter);
    this.dataSource.data = this.displays;
  }

  public getImage(display){
      let imageNumber = (parseInt(display.base_display_template_id));
      if(this.imagesById[display.image]){
        return `${this.config.baseURL}uploads/thumbs/${this.imagesById[display.image].path}`;
      }
      return `${this.config.baseURL}uploads/dp${imageNumber}fwp_v1.jpg`;
  }

  public showNew() {
    this.ui.doShowEditNew();
    this.showChooseTemplate = false;
    this.currentDataSet = new Display();
    this.updateFormValues();
  }

  public templateChoosen(templateid){
    this.currentDataSet = displayTemplates.displayTemplates[templateid].display;

    this.partsList = [];
    for(let i = 0; i < displayTemplates.displayTemplates[templateid].parts.length; i++){
      if(this.displayPartsById[displayTemplates.displayTemplates[templateid].parts[i].articlenr]){
        let displayPart = this.displayPartsById[displayTemplates.displayTemplates[templateid].parts[i].articlenr];
        displayPart.units = displayTemplates.displayTemplates[templateid].parts[i].units;
        this.partsList.push(this.displayPartsById[displayTemplates.displayTemplates[templateid].parts[i].articlenr]);
      }
    }

    //this.partsList = displayTemplates.displayTemplates[templateid].parts;
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
      /*topsign_punch: this.currentDataSet.topsign_punch,*/
      instruction: this.currentDataSet.instruction.toString()
      
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
      /*this.currentDataSet.topsign_punch = this.displayForm.controls['topsign_punch'].value;*/
      this.currentDataSet.instruction = Number(this.displayForm.controls['instruction'].value);
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
    //this.ui.imageChoosen.unsubscribe();
  }



}
