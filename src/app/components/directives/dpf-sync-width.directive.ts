import { Directive, ElementRef, ViewChild, Input,  OnChanges, AfterContentInit, QueryList, ContentChildren } from '@angular/core';

@Directive({
  selector:'[dpfSyncWidth]'
})
export class DpfSyncWidth implements AfterContentInit,  OnChanges{
  @Input() toSyncWith:QueryList<ElementRef>;
  @ContentChildren("td", { read: ElementRef }) tableHeads : QueryList<ElementRef>;

  constructor(private el: ElementRef){

  }


  public ngOnChanges(){

    if(this.toSyncWith instanceof QueryList){
      console.log('this.tableHeads');
      console.log(this.tableHeads);
      console.log('this.el.nativeElement');
      console.log(this.el.nativeElement);
      console.log('this.toSyncWith');
      console.log(this.toSyncWith);
    }
  }

  ngAfterContentInit(): void {
    console.log('this.tableHeads');
    console.log(this.tableHeads);
  }
}
