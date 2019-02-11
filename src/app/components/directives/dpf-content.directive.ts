import { Directive, ElementRef, ContentChild, AfterViewInit, HostListener } from '@angular/core';
import { DpfOverflowWrapperDirective } from './dpf-overflow-wrapper.directive';
@Directive({
  selector:'[dpfContent]'
})
export class DpfContentDirective implements AfterViewInit{
  @HostListener('window:resize', ['$event']) onResize(event) {
    this.checkOverflow();
  }
  @ContentChild(DpfOverflowWrapperDirective) overflowWrapper: DpfOverflowWrapperDirective;
  constructor(private el: ElementRef){

  }

  ngAfterViewInit(){
    this.checkOverflow();

  }

  private checkOverflow(){

  }
}
