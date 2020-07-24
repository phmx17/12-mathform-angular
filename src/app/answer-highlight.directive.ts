import { Directive, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';
import { map } from 'rxjs/operators';

@Directive({
  selector: '[appAnswerHighlight]'
})
export class AnswerHighlightDirective {

  constructor(private el: ElementRef, private controlName: NgControl) {
  }
  ngOnInit() {    
    this.controlName.control.parent.valueChanges
    .pipe(
      map(({ a, b, answer }) => Math.abs((a + b - answer) / (a + b))) // calculate distance from correct answer;
    )
    .subscribe(value => {  // valueChanges is an RxJs observable
      if (value < 0.2) {  // apply only if within 0.2 of answer, otherwise remove
        this.el.nativeElement.classList.add('close'); // meaning close to answer; CSS rule applies to this class to give it some yellow shade;
      } else {
        this.el.nativeElement.classList.remove('close');
      }
    }); 
   }
}
