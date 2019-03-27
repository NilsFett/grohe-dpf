import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { UiService } from 'src/app/services/ui.service';
import { DataService } from 'src/app/services/data.service';
import { ProductTree } from 'src/app/classes/ProductTree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})
export class TreeViewComponent implements OnInit {
  pts: ProductTree[] = [];

  private transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this.transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(
    public user: UserService,
    public ui: UiService,
    public dataService: DataService,
  ) { }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  async ngOnInit() {
    await this.getProductTrees();
    var a = this.flatListToTreeViewData(this.pts);
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

}
