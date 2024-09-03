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

  public uploader:FileUploader;

  public images:Image[]=[];
  public tab:string = 'dimages';
  public tabs:any = {1:'dimages',2:'pimages', 3:'tsimages',4:'tspdf'};
  private timeoutHandle;
  constructor(
    private dataService:DataService,
    public ui:UiService,
    public config:ConfigService,

  ) {
    this.uploader = new FileUploader({url: `${this.config.baseURL}uploadImage`});
    console.log('1');
    if(this.ui.currentURL == '/displayCompose'){
      this.tab = 'pimages';
    }
    if(this.ui.currentURL == '/topSigns'){
      this.tab = 'tsimages';
    }
    this.dataService.imagesChange.subscribe(
      (images: Image[]) => {
        this.images = this.dataService.images;
      }
    );
    console.log('2');
    if (this.dataService.images) {
      this.images = this.dataService.images;
    }
    else {

      this.dataService.loadImages();
    }
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    console.log('3');
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
    this.uploader.setOptions({url:`${this.config.baseURL}uploadImage?type=${this.tab}`});
    this.uploader.uploadAll();
    //this.uploader.clearQueue();
  }
}
