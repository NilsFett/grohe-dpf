import { Component, Input, ViewChild} from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService } from '../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Display } from '../../classes/display';
import { DisplaysPart } from '../../classes/DisplaysPart';
import { ConfigService } from '../../services/config.service';
import { DisplaysFilter } from '../../pipes/displays/displaysFilter';

@Component({
  selector: 'grohe-dpf-login',
  templateUrl: './displayCompose.component.html',
  styleUrls: ['./displayCompose.component.css']
})
export class DisplayComposeComponent{
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
    title: new FormControl('', [Validators.required, Validators.minLength(2)]),
    articlenr: new FormControl('', [Validators.required, Validators.minLength(2)]),
    displaytype: new FormControl(''),
    topsign_punch: new FormControl(''),
    instruction: new FormControl('')
  });
  filter = {
    title: '',
    articlenr: '',
    displaytype: '',
    topsign_punch: ''
  };
  public images = {
    10: 'uploads/afd1707d12f77e13ad77ba0fc17e9f83.jpg',
    11: 'uploads/773a7998644c720179ac7636d13db2c8.jpg',
    12: 'uploads/3858f5b37715465e7d7407d14f664a5f.jpg',
    13: 'uploads/b8ab04829399a0a70fdaa2abb4ef7924.jpg',
    14: 'uploads/5f78313fceb9d1ab61815e1cb7ed1969.jpg',
    15: 'uploads/e2f35a7d3761f87697d032ac43fe7081.jpg',
    16: 'uploads/1e7d0d4eeb42492d8138a3decc90955f.jpg',
  };

  public partsList = {
      1:[{
        sapid:'98001202',
        title:'Sockel gestanzt, aus 2 gleichen Teilen zusammen ge	',
        units:1
      },{
        sapid:'98001206',
        title:'Stapelschütte gestanzt, zum Krempeln	',
        units:2
      },{
        sapid:'98001220',
        title:'Stapelschütte gestanzt, zum Krempeln	',
        units:2
      },{
        sapid:'98001240',
        title:'	Stülper groß - Halbfaltkiste mit zusammen stoßende',
        units:1
      },{
        sapid:'98001200',
        title:'Technosteg',
        units:1
      }
    ],
    2:[{
      sapid:'98001209',
      title:'Halterung gestanzt, zum Einkleben mit 2 Dekopunkte',
      units:1
    },{
      sapid:'98001210',
      title:'Dekopunkt Durchmesser 30 mm',
      units:2
    },{
      sapid:'98001240',
      title:'Stülper groß - Halbfaltkiste mit zusammen stoßende',
      units:1
    },{
      sapid:'98001295',
      title:'Mantel gestanzt, 2-tlg. Geklebt',
      units:1
    }
    ],
    3:[{
      sapid:'98001202',
      title:'Sockel gestanzt, aus 2 gleichen Teilen zusammen ge',
      units:1
    },{
      sapid:'98001205',
      title:'Dekopunkt Durchmesser 30 mm',
      units:2
    },{
      sapid:'98001208',
      title:'Abdeckplatte gestanzt, wird in der Ummantelung auf',
      units:1
    },{
      sapid:'98001240',
      title:'Stülper groß - Halbfaltkiste mit zusammen stoßende',
      units:1
    }
    ]
  };
  public currentDisplaysParts = null;

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
  }


  public filterChanges() {
    this.displays = this.displayFilter.transform(this.dataService.displays, this.filter);
    this.dataSource.data = this.displays;
  }


  public getImage(imageid){
      return `${this.config.baseURL}${this.images[imageid]}`;
  }

  public showNew() {
    this.ui.showOverlay = true;
    this.showChooseTemplate = false;
    this.currentDataSet = new Display();
    this.updateFormValues();
  }

  public templateChoosen(templateid){
    console.log(templateid);
    console.log(this.partsList);
    this.currentDisplaysParts = this.partsList[templateid];
    console.log(this.currentDisplaysParts);
    this.showNew();
    this.showAssembly = true;
  }

  public showChooseTemplateOverlay(){
    this.showChooseTemplate = true;
    this.ui.showOverlay = true;
  }

  public hideChooseTemplateOverlay(){
    this.showChooseTemplate = false;
    this.ui.showOverlay = false;
  }


  public save() {
    if (this.displayForm.status == 'VALID') {
      this.currentDataSet.title = this.displayForm.controls['title'].value;
      this.currentDataSet.articlenr = this.displayForm.controls['articlenr'].value;
      this.currentDataSet.displaytype = this.displayForm.controls['displaytype'].value;
      this.currentDataSet.topsign_punch = this.displayForm.controls['topsign_punch'].value;
      this.currentDataSet.instruction = this.displayForm.controls['instruction'].value;
      this.dataService.changeUser(this.currentDataSet);
    }
  }

  public setCurrentDataSet(currentDataSet) {
    this.ui.showOverlay = true;
    this.currentDataSet = currentDataSet;
    this.updateFormValues();
    /*
    this.DisplayPart = this.dataService.loadDisplayPartsByDisplayId(currentDataSet.id).subscripe(

    );
    */
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
    this.ui.showOverlay = true;
    this.dataSetToDelete = part;
  }

  public deleteClose(part) {
    this.dataSetToDelete = null;
    this.ui.showOverlay = false;
    this.ui.deleteSuccess = false;
  }

  public delete() {
    this.dataService.deleteUser(this.dataSetToDelete);
  }

  public partsSearchwordChanged(searchword){
    console.log(searchword);
    this.partsSearchword = searchword;
  }
}
