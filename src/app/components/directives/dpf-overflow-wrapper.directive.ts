import { Directive, ElementRef, ViewChild } from '@angular/core';

@Directive({
  selector:'[dpfOverflowWrapper]'
})
export class DpfOverflowWrapperDirective{
  constructor(private el: ElementRef){

  }
}
