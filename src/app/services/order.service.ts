import { Injectable } from '@angular/core';
import { DataService } from './data.service';

@Injectable()
export class OrderService {
  public displayTypeChoosen:number = null;
  constructor(
    private data:DataService
  ) {

  }
}
