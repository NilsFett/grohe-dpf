import { Component, Input, ViewChild, ViewChildren, OnInit, ElementRef, QueryList, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService} from '../../services/data.service';
import { Article } from '../../classes/Article';
import { TopSign } from '../../classes/TopSign';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ArticlesFilter } from '../../pipes/articles/articlesFilter';
import { DpfSyncWidthSource } from '../directives/dpf-sync-width-source.directive';


@Component({
  selector: 'grohe-dpf-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent  implements OnInit{
  @ViewChild(MatSort, {static: false}) sort!: MatSort;

  @ViewChildren(DpfSyncWidthSource, { read: ElementRef }) syncWidthSources : QueryList<ElementRef>;

  currentDataSet:Article = null;
  dataSetToDelete:Article = null;
  articles:Article[] = [];
  topSigns:TopSign[] = [];
  topSignsById = {};
  filter = {
    articlenr:'',
    title:'',
    type:'',
    packaging:'',
    weight:'',
    depth:'',
    width:'',
    height:'',
    topsign:''
  };

  columnsToDisplay = ['articlenr', 'title', 'type', 'packaging', 'weight', 'depth', 'width', 'height',  'topsign', 'edit', 'delete'];
  dataSource: MatTableDataSource<Article> = null;
  articleForm = new FormGroup({
    articlenr : new FormControl('',[Validators.required, Validators.minLength(2)]),
    title : new FormControl('',[Validators.required, Validators.minLength(2)]),
    type : new FormControl('',[Validators.required]),
    packaging : new FormControl('',[Validators.required]),
    weight : new FormControl('',[Validators.required]),
    depth : new FormControl('',[Validators.required]),
    width : new FormControl('',[Validators.required]),
    height : new FormControl(''),
    topsign : new FormControl('')
  });

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private articlesFilter: ArticlesFilter,
    private cd: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource(this.articles);

    if(this.dataService.articles){
      this.articles = this.articlesFilter.transform(this.dataService.articles, this.filter);
      this.dataSource.data = this.articles;
    }
    else{
      this.dataService.articlesChange.subscribe(
        (articles:Article[]) => {
          this.articles = this.articlesFilter.transform(this.dataService.articles, this.filter);
          this.dataSource.data = this.articles;
        }
      );
      this.dataService.loadArticles();
    }
    if(this.dataService.topSigns){
      this.topSigns = this.dataService.topSigns;
      for(var i = 0; i < this.topSigns.length; i++ ){
        this.topSignsById[this.topSigns[i].id] = this.topSigns[i];
      }
    }
    else{
      this.dataService.topSignsChange.subscribe(
        (topSigns:TopSign[]) => {
          this.topSigns = this.dataService.topSigns;
          this.topSigns = this.dataService.topSigns;
          for(var i = 0; i < this.topSigns.length; i++ ){
            this.topSignsById[this.topSigns[i].id] = this.topSigns[i];
          }
        }
      );
      this.dataService.loadTopSigns();
    }
  }

  ngOnInit() {
    this.cd.detectChanges();
    this.dataSource.sort = this.sort;
  }

  filterChanges(){
    this.articles = this.articlesFilter.transform(this.dataService.articles, this.filter);
    this.dataSource.data = this.articlesFilter.transform(this.dataService.articles, this.filter);
  }

  public showNew(){
    this.currentDataSet = new Article();
    this.ui.doShowEditNew();
    this.clearForm();
  }

  public clearForm(){
    this.articleForm = new FormGroup({
      articlenr : new FormControl('',[Validators.required, Validators.minLength(2)]),
      title : new FormControl('',[Validators.required, Validators.minLength(2)]),
      type : new FormControl('',[Validators.required]),
      packaging : new FormControl('',[Validators.required]),
      weight : new FormControl('',[Validators.required]),
      depth : new FormControl('',[Validators.required]),
      width : new FormControl('',[Validators.required]),
      height : new FormControl(''),
      topsign : new FormControl('')
    });
  }

  public save(){
    if (this.articleForm.status == 'VALID') {
      this.currentDataSet.articlenr =+this.articleForm.controls['articlenr'].value;
      this.currentDataSet.title = this.articleForm.controls['title'].value;
      this.currentDataSet.type =+ this.articleForm.controls['type'].value;
      this.currentDataSet.packaging = this.articleForm.controls['packaging'].value;
      this.currentDataSet.weight =+ this.articleForm.controls['weight'].value;
      // this.currentDataSet.weight = +this.articleForm.controls['weight'].value;

      this.currentDataSet.height =+ this.articleForm.controls['height'].value;
      this.currentDataSet.width =+ this.articleForm.controls['width'].value;
      this.currentDataSet.depth =+ this.articleForm.controls['depth'].value;
      this.currentDataSet.topsign =+ this.articleForm.controls['topsign'].value;

      console.log(this.currentDataSet);

      this.dataService.changeArticle(this.currentDataSet);
    }
  }

  public setCurrentDataSet(currentDataSet){
    this.currentDataSet = currentDataSet;
    this.articleForm.patchValue({
      articlenr: currentDataSet.articlenr,
      title: currentDataSet.title,
      type: currentDataSet.type,
      packaging: currentDataSet.packaging,
      weight: currentDataSet.weight,
      height: currentDataSet.height,
      width: currentDataSet.width,
      depth: currentDataSet.depth,
      topsign: currentDataSet.topsign
    });
    this.ui.doShowEditNew();
  }

  public showDelete(part){
    this.dataSetToDelete = part;
    this.ui.doShowDelete();
  }

  public deleteClose(part){
    this.dataSetToDelete = null;
    this.ui.doCloseDelete();
  }

  public delete(){
    this.dataService.deleteArticle(this.dataSetToDelete);
  }

}
