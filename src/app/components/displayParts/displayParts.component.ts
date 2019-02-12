import { Component, Input} from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService} from '../../services/data.service';
import { DisplaysPart } from '../../classes/DisplaysPart';
import { FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'grohe-dpf-display-parts',
  templateUrl: './displayParts.component.html',
  styleUrls: ['./displayParts.component.css']
})
export class DisplayPartsComponent{
  currentDataSet:DisplaysPart = null;
  displayParts:DisplaysPart[] = null;

  columnsToDisplay = ['title', 'weight', 'articlenr', 'open_format', 'stock', 'deleted', 'edit'];

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
    public dataService: DataService
  ) {
    if(this.dataService.displayParts){
      this.displayParts = this.dataService.displayParts;
      //this.currentDataSet = this.displayParts[0];
    }
    else{
      this.dataService.displayPartsChange.subscribe(
        (displayParts:DisplaysPart[]) => {
          this.displayParts = displayParts;
        }
      );
      this.dataService.loadDisplayParts();
    }

    this.displayPartForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  public save(){
    console.log(this.displayPartForm.controls['title'].value);

    console.log(this.currentDataSet.title);
    this.currentDataSet.title = this.displayPartForm.controls['title'].value;
    this.currentDataSet.articlenr = this.displayPartForm.controls['articlenr'].value;
    this.currentDataSet.open_format = this.displayPartForm.controls['open_format'].value;
    this.currentDataSet.stock = this.displayPartForm.controls['stock'].value;
    this.currentDataSet.weight = this.displayPartForm.controls['weight'].value;
    this.currentDataSet.deleted = this.displayPartForm.controls['deleted'].value;
    this.dataService.changeDisplayPart(this.currentDataSet);
  }

  public setCurrentDataSet(currentDataSet){

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


}
