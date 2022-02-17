import { Directive, ElementRef, ViewChild, Input, AfterViewInit, OnChanges } from '@angular/core';

@Directive({
  selector:'[dpfSyncWidthSource]'
})
export class DpfSyncWidthSource implements AfterViewInit, OnChanges{

  constructor(private el: ElementRef){
    console.log('constructor dpfSyncWidthSource');
    console.log(this.el);
  }

  public ngAfterViewInit(){
    console.log('dpfSyncWidthSource ngAfterViewInit');
  }

  public ngOnChanges(){
    console.log('dpfSyncWidthSource ngOnChanges');
  }
}
