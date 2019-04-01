import { Component} from '@angular/core';
import { DataService} from '../../services/data.service';
import { ConfigService} from '../../services/config.service';
import { UiService} from '../../services/ui.service';
import { Image} from '../../classes/Image';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'grohe-dpf-medias',
  templateUrl: './medias.component.html',
  styleUrls: ['./medias.component.css']
})
export class MediasComponent{

  //public uploader:FileUploader = new FileUploader({url: `${this.config.baseURL}uploadImage`});
  public uploader: FileUploader = new FileUploader({url: `${this.config.baseURL}uploadImage`, itemAlias: 'media'});
  public images:Image[]=[];
  constructor(
    private dataService:DataService,
    private ui:UiService,
    public config:ConfigService
  ) {
    if (this.dataService.images) {
      this.images = this.dataService.images;
    }
    else {
      this.dataService.imagesChange.subscribe(
        (images: Image[]) => {
          this.images = this.dataService.images;
        }
      );
      this.dataService.loadImages();
    }
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
         let obj = JSON.parse(response);
         if(obj.success == true){
           setTimeout(()=>{
             this.dataService.loadImages();
           },500);
         }
     };
  }

  public imageChoosen(image){
    this.ui.emitImageChoosen(image);
  }
}
