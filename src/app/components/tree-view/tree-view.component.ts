import { Component,  Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UiService } from 'src/app/services/ui.service';
import { DataService } from 'src/app/services/data.service';
import { ProductTree } from 'src/app/classes/ProductTree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface FoodNode {
  id:number;
  name: string;
  children?: FoodNode[];
}

interface FlatNode {
  id:number;
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'grohe-dpf-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent  {
  @Input() selectedCategory:number=102;
  @Input() label:string;
  public selecting:boolean=false;
  public categories: ProductTree[] = [];
  public categoriesById={};
  private transformer = (node: FoodNode, level: number) => {
    return {
      id: node.id,
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level
    };
  }
  treeControl = new FlatTreeControl<FlatNode>(node => node.level, node => node.expandable);
  treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  hasChild = (_: number, node: FlatNode) => node.expandable;
  public ready = false



  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
  ) {
    console.log('constructor');
    if(this.dataService.categories){
      this.categories = this.dataService.categories;
      this.dataSource.data = this.categories;
      this.flatenCategories(this.categories);
    }
    else{
      this.dataService.categoriesChange.subscribe(
        (categories:ProductTree[]) => {
          console.log('loaded');
          this.categories = categories;
          console.log(this.categories);
          this.dataSource.data = this.categories;
          this.flatenCategories(this.categories);
        }
      );
      this.dataService.loadCategories();
    }


  }

  private flatenCategories(categories:ProductTree[]){
    console.log('flatenCategories')
    let firstId = null;
    for(let i = 0; i < categories.length; i++){
      if( ! firstId )firstId = categories[i].id;
      this.categoriesById[categories[i].id] = categories[i];

      if(categories[i].children.length){
        this.flatenCategories(categories[i].children);
      }
    }
    if( ! this.categoriesById[this.selectedCategory] ){
      this.selectedCategory = firstId;
    }
    this.ready = true;
    console.log(this.selectedCategory);
    console.log(this.categoriesById);
    console.log('ready')
  }

  public nodeClicked(node){
    this.selecting = false;
    this.selectedCategory=node.id;
    this.ui.emitCategorySelected(node.id);
  }


/*
  async ngOnInit() {

    await this.getProductTrees();
    var a = this.flatListToTreeViewData(this.pts);
    console.log('TREE');
    console.log(a);
    return;
    this.dataSource.data = a;
  }

  flatListToTreeViewData(dataList) {
    var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

    for (var i = 0, len = dataList.length; i < len; i++) {
      arrElem = dataList[i];
      mappedArr[arrElem.id] = arrElem;
      mappedArr[arrElem.id]['children'] = [];
    }

    for (var id in mappedArr) {
      console.log(id);
      if (mappedArr.hasOwnProperty(id)) {
        console.log("-1");

        mappedElem = mappedArr[id];
        console.log("-2");

        if (mappedElem.parent) {
          console.log("-3");
          console.log(mappedArr[mappedElem['parent']]);
          mappedArr[mappedElem['parent']]['children'].push(mappedElem);
        } else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }

  async getProductTrees() {
    let r = await this.dataService.getProductTrees();
    if (r != null) {
      for (let index = 0; index < r.length; index++) {
        if (r[index]) {
          this.pts.push(r[index]);
        }
      }
      this.pts.forEach(element => {
        if (!element.parent) {
          element.parent = 0;
        }
      });
    }
    else {
      console.log("err");
    }
  }
*/
}
