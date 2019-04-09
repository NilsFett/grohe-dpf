import { Directive, ElementRef, ViewChild, Input, AfterViewInit, OnChanges, QueryList } from '@angular/core';

@Directive({
  selector:'[dpfSyncWidth]'
})
export class DpfSyncWidth implements AfterViewInit, OnChanges{
  @Input() toSyncWith:QueryList<ElementRef>;
  constructor(private el: ElementRef){

  }

  public ngAfterViewInit(){
    console.log('DpfSyncWidth ngAfterViewInit');
    console.log(this.toSyncWith);
  }

  public ngOnChanges(){
    console.log('DpfSyncWidth ngOnChanges');
    if(this.toSyncWith instanceof QueryList){
      console.log(this.toSyncWith);
    }
  }
}
