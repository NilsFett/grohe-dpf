import { Component} from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService} from '../../services/data.service';
import { DisplaysPart } from '../../classes/DisplaysPart';

@Component({
  selector: 'grohe-dpf-display-parts',
  templateUrl: './displayParts.component.html',
  styleUrls: ['./displayParts.component.css']
})
export class DisplayPartsComponent{
  displayParts:DisplaysPart[] = null;
  columnsToDisplay = ['title', 'weight', 'articlenr', 'open_format', 'stock', 'deleted'];


  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService
  ) {
    if(this.dataService.displayParts){
      this.displayParts = this.dataService.displayParts;
    }
    else{
      this.dataService.displayPartsChange.subscribe(
        (displayParts:DisplaysPart[]) => {
          this.displayParts = displayParts;
          console.log(this.displayParts);
        }
      );
      this.dataService.loadDisplays();
    }
  }


}
