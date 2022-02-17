import { Directive, AfterContentInit, EventEmitter, Output } from '@angular/core';

@Directive({selector: '[form-validate-after-if]'})
export class DpfFormValidateAfterIfDirective implements AfterContentInit {
    @Output('form-validate-after-if')
    public after: EventEmitter<DpfFormValidateAfterIfDirective> = new EventEmitter();

    public ngAfterContentInit(): void {
        setTimeout(()=>{

           // timeout helps prevent unexpected change errors
           this.after.next(this);
        },500);
    }
}
