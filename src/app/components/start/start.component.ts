import { Component, OnInit} from '@angular/core';
import { UserService} from '../../services/user.service';
import { DataService } from '../../services/data.service';
import { PromotionImage } from 'src/app/classes/PromotionImage';
import { Image } from '../../classes/Image';
import { ConfigService} from '../../services/config.service';
import { UiService} from '../../services/ui.service';

@Component({
  selector: 'grohe-dpf-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent{
  promotionImages: PromotionImage[] = [];
  promotionImage: PromotionImage = null;
  public images:Image[] = [];
  public imagesById = {};
  public showPromotionImage = true;
  constructor(
    public dataService: DataService,
    public config: ConfigService,
    public user: UserService,
    public ui:UiService
  ) {


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

    if (this.dataService.promotionImages) {
      this.promotionImages = this.dataService.promotionImages;
      for(let i = 0; i < this.promotionImages.length ; i++ ){
        if( this.promotionImages[i].active == 1){
          this.promotionImage = this.promotionImages[i];
        }
      }
    }
    else {
      this.dataService.promotionImagesChange.subscribe(
        (promotionImages: PromotionImage[]) => {
          this.promotionImages = this.dataService.promotionImages;
          for(let i = 0; i < this.promotionImages.length ; i++ ){
            console.log(this.promotionImages[i]);
            if( this.promotionImages[i].active == 1){
              this.promotionImage = this.promotionImages[i];
            }
          }
        }
      );
      this.dataService.loadPromotionImages();
    }
  }

  ngOnInit() {
    this.ui.showOverlay = true;
  }

  public getImage(imageid){
    if(this.imagesById[imageid]){
      return `${this.config.baseURL}uploads/${this.imagesById[imageid].path}`;
    }
    else{
      return `${this.config.baseURL}uploads/no_pic_thumb.jpg`;
    }
  }
}
