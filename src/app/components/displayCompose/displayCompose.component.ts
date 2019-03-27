import { Component, Input, ViewChild} from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService } from '../../services/data.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { Display } from '../../classes/display';
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
    this.currentDataSet = new Display();
    this.updateFormValues();
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
}
