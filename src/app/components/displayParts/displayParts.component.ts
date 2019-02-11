import { Component} from '@angular/core';
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
  displayParts:DisplaysPart[] = null;
  currentDataSet:DisplaysPart = null;
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
      console.log(this.displayParts);
      this.currentDataSet = this.displayParts[0];
      console.log(this.currentDataSet);
    }
    else{
      this.dataService.displayPartsChange.subscribe(
        (displayParts:DisplaysPart[]) => {
          this.displayParts = displayParts;
          console.log(this.displayParts);
          this.currentDataSet = this.displayParts[0];
          console.log(this.currentDataSet);
        }
      );
      this.dataService.loadDisplays();
    }
  }


}
