import { Component} from '@angular/core';
import { DataService} from '../../services/data.service';
import { ConfigService} from '../../services/config.service';
import { UiService} from '../../services/ui.service';
import { Image} from '../../classes/Image';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'grohe-dpf-promotion-uploads',
  templateUrl: './promotionUploads.component.html',
  styleUrls: ['./promotionUploads.component.css']
})
export class PromotionUploads{

  public uploader: FileUploader = new FileUploader({url: `${this.config.baseURL}uploadImage?type=5`, itemAlias: 'media'});
  public images:Image[]=[];

  private timeoutHandle;
  constructor(
    private dataService:DataService,
    public ui:UiService,
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
         item.remove();
         if(obj.success == true){
           if(this.timeoutHandle){
             clearTimeout(this.timeoutHandle);
           }
           this.timeoutHandle = setTimeout(()=>{
             this.dataService.loadImages();
           },500);
         }
     };
  }

  public imageChoosen(image){
    this.ui.emitImageChoosen(image);
  }

  public deleteImage(image){
    this.dataService.deleteImage(image);
  }

  public openFileBrowser(){
    document.getElementById('fileinput').click();
  }

  public uploadAll(){

    this.uploader.uploadAll();
    //this.uploader.clearQueue();
  }
}
