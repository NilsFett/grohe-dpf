import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { UserService} from '../../services/user.service';
import { UiService} from '../../services/ui.service';
import { DataService} from '../../services/data.service';
import { Article } from '../../classes/Article';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSort, MatTableDataSource } from '@angular/material';
import { ArticlesFilter } from '../../pipes/articles/articlesFilter'


@Component({
  selector: 'grohe-dpf-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent  implements OnInit{
  @ViewChild(MatSort) sort: MatSort;

  currentDataSet:Article = null;
  dataSetToDelete:Article = null;
  articles:Article[] = [];
  filter = {
    articlenr:'',
    title:'',
    extra:'',
    type:'',
    packaging:'',
    weight:'',
    topsign:'',
    hidden:null
  };

  columnsToDisplay = ['articlenr', 'title', 'extra', 'type', 'packaging', 'weight', 'topsign', 'hidden', 'edit', 'delete'];
  dataSource: MatTableDataSource<Article> = null;
  articleForm = new FormGroup({
    articlenr : new FormControl('',[Validators.required, Validators.minLength(2)]),
    title : new FormControl('',[Validators.required, Validators.minLength(2)]),
    extra : new FormControl(''),
    type : new FormControl(''),
    packaging : new FormControl(''),
    weight : new FormControl('',[Validators.required]),
    topsign : new FormControl('',[Validators.required]),
    hidden : new FormControl('')
  });

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
    private articlesFilter: ArticlesFilter
  ) {
    this.dataSource = new MatTableDataSource(this.articles);
    if(this.dataService.articles){
      this.articles = this.articlesFilter.transform(this.dataService.articles, this.filter);
      this.dataSource = new MatTableDataSource(this.articles);
      this.dataSource.sort = this.sort;
    }
    else{
      this.dataService.articlesChange.subscribe(
        (articles:Article[]) => {
          this.articles = articles;
          this.dataSource = new MatTableDataSource(this.articles);
          this.dataSource.sort = this.sort;
        }
      );
      this.dataService.loadArticles();
    }

    this.articleForm.valueChanges.subscribe(val => {
      console.log(val);
    });
  }

  ngOnInit() {
      this.dataSource.sort = this.sort;
  }

  filterChanges(){
    this.articles = this.articlesFilter.transform(this.dataService.articles, this.filter);
    this.dataSource.data = this.articlesFilter.transform(this.dataService.articles, this.filter);
    //this.dataSource = new MatTableDataSource(this.displayParts);
  }

  public showNew(){
    this.ui.showOverlay = true;
    this.currentDataSet = new Article();
  }

  public save(){
    this.currentDataSet.articlenr = this.articleForm.controls['articlenr'].value;
    this.currentDataSet.title = this.articleForm.controls['title'].value;
    this.currentDataSet.extra = this.articleForm.controls['extra'].value;
    this.currentDataSet.type = this.articleForm.controls['type'].value;
    this.currentDataSet.packaging = this.articleForm.controls['packaging'].value;
    this.currentDataSet.weight = this.articleForm.controls['weight'].value;
    this.currentDataSet.topsign = this.articleForm.controls['topsign'].value;
    this.currentDataSet.hidden = this.articleForm.controls['hidden'].value;
    this.dataService.changeArticle(this.currentDataSet);
  }

  public setCurrentDataSet(currentDataSet){
    this.currentDataSet = currentDataSet;
    this.articleForm.patchValue({
      articlenr: currentDataSet.articlenr,
      title: currentDataSet.title,
      extra: currentDataSet.extra,
      type: currentDataSet.type,
      packaging: currentDataSet.packaging,
      weight: currentDataSet.weight,
      topsign: currentDataSet.topsign,
      deleted: currentDataSet.deleted
    });
    this.ui.doShowEditNew();
  }

  public showDelete(part){
    this.ui.showOverlay = true;
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
