import { Component, Input, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UiService } from '../../services/ui.service';
import { DataService } from '../../services/data.service';
import { ConfigService} from '../../services/config.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { PromotionImage } from 'src/app/classes/PromotionImage';
import { PromotionImagesFilter } from 'src/app/pipes/promotionImages/promotionImagesFilter';
import { Image } from '../../classes/Image';

@Component({
  selector: 'grohe-dpf-promotion-images',
  templateUrl: './promotionImages.component.html',
  styleUrls: ['./promotionImages.component.css']
})
export class PromotionImages {
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  currentDataSet: PromotionImage = null;
  dataSetToDelete: PromotionImage = null;
  promotionImages: PromotionImage[] = [];
  filter = {
    name: ''
  };

  columnsToDisplay = [ 'name', 'image', 'active', 'edit', 'delete'];
  dataSource: MatTableDataSource<PromotionImage>;
  promotionImageForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    image_id: new FormControl(''),
    active: new FormControl('')
  });
  public images:Image[] = [];
  public imagesById = {};

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private promotionImagesFilter: PromotionImagesFilter,
    public config: ConfigService
  ) {
    this.dataSource = new MatTableDataSource(this.promotionImages);
    this.ui.view = 'admin';

    console.log('this.dataService.images');
    console.log(this.dataService.images);
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
      this.promotionImages = this.promotionImagesFilter.transform(this.dataService.promotionImages, this.filter);
      this.dataSource.data = this.promotionImages;
      this.dataSource.sort = this.sort;
    }
    else {
      this.dataService.promotionImagesChange.subscribe(
        (promotionImages: PromotionImage[]) => {
          this.promotionImages = this.promotionImagesFilter.transform(this.dataService.promotionImages, this.filter);
          this.dataSource.data = this.promotionImages;
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadPromotionImages();
    }
    this.ui.imageChoosen.subscribe( (image:Image)=>{
      console.log('imageChoosen');
      console.log(image);
      this.currentDataSet.image_id = image.id;
      this.ui.doHideMedias();
    });
  }

  ngOnInit() {
      this.dataSource.sort = this.sort;
  }

  filterChanges() {
    this.promotionImages = this.promotionImagesFilter.transform(this.dataService.promotionImages, this.filter);
    this.dataSource.data = this.promotionImagesFilter.transform(this.dataService.promotionImages, this.filter);
  }

  public showNew() {
    this.ui.doShowEditNew();
    this.currentDataSet = new PromotionImage();
    this.updateFormValues();
  }

  public save() {
    if (this.promotionImageForm.status == 'VALID') {
      this.currentDataSet.name = this.promotionImageForm.controls['name'].value;
      //this.currentDataSet.image_id = this.promotionImageForm.controls['image_id'].value;
      //this.currentDataSet.active = this.promotionImageForm.controls['active'].value;
      this.dataService.changePromotionImage(this.currentDataSet);
    }
  }

  public setCurrentDataSet(currentDataSet) {
    this.ui.showOverlay = true;
    this.currentDataSet = currentDataSet;
    this.updateFormValues();
  }

  private updateFormValues(){
    this.promotionImageForm.patchValue({
      name: this.currentDataSet.name,
      image_id: this.currentDataSet.image_id,
      active: this.currentDataSet.active
    });
  }

  public showDelete(part) {
    this.ui.doShowDelete();
    this.dataSetToDelete = part;
  }

  public deleteClose(part) {
    this.dataSetToDelete = null;
    this.ui.showOverlay = false;
    this.ui.deleteSuccess = false;
  }

  public delete() {
    this.dataService.deletePromotionImage(this.dataSetToDelete);
  }

  activeChange($event){
    console.log('activeChange');
    console.log(this.currentDataSet.active);
    if(this.currentDataSet.active == 1){
      this.currentDataSet.active = 0;
    }
    else{
        this.currentDataSet.active = 1;
    }
  }

  public getImage(imageid){
    if(this.imagesById[imageid]){
      return `${this.config.baseURL}uploads/thumbs/${this.imagesById[imageid].path}`;
    }
    else{
      return `${this.config.baseURL}uploads/no_pic_thumb.jpg`;
    }
  }

  public selectImage(){
    this.ui.doShowMedias();
  }
}
