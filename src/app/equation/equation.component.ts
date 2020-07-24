import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CustomValidators } from '../custom-validators';
import { delay, filter,scan } from 'rxjs/operators';

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.css']
})
export class EquationComponent implements OnInit {
  secondsPerSolution = 0; // implementing user-performance feature;

  mathForm = new FormGroup({
    a: new FormControl(this.randomNumber(20)),
    b: new FormControl(this.randomNumber(10)),
    answer: new FormControl('') 
  },
  [
    CustomValidators.addition('answer', 'a', 'b'),  // no () function call here, just a reference!! String literals for controls!
  ]   
);
  // our custom validator will apply to the whole formGroup object as opposed to individual controls
  // form: refers to our mathForm obj; AbstractControl describes how FormGroups and FormControls behave
  // the returned object of the call back is what defines the mathForm.errors property; it also flags the .valid property to false
  // return of null sets .valid property to true

  constructor() { }

  // getters - very cool !
  get a() {
    return this.mathForm.value.a
  };

  get b() {
    return this.mathForm.value.b
  };

  ngOnInit(): void {
    // implementing a timer - user performance feature
    // const startTime = new Date();  // don't need because using scan operator in pipe now
    // let numberSolved = 0;  

    // resetting form with new values as soon as it comes back 'VALID'
    this.mathForm.statusChanges
    .pipe(  // introducing pipe actions
      filter(value => value === 'VALID'),  // filter out anything but true for expression, ie continue pipe only if valid; 
      delay(400),   // keep correct answer up 400ms for user to see
      scan((acc) => { // using scan operator for user-performance feature instead of previous (standard) method;
        return {
          numberSolved: acc.numberSolved + 1,
          startTime: acc.startTime
        }
      }, { numberSolved: 0, startTime: new Date() })
    )
    .subscribe(({ numberSolved, startTime }) => {  // RxJs subscirption; update whenever anything changes in mathForm; interesting stuff here
      // numberSolved ++  // out because using scan operator instead  // otheriwse division by zero; 
      this.secondsPerSolution = ( //  user-performance part
        new Date().getTime() - startTime.getTime()
      ) / numberSolved / 1000 // calculate average time to solve each problem     
      this.mathForm.setValue({    // set new values the proper way BUT: must update all values, otherwise use patchValue
        a: this.randomNumber(20),
        b: this.randomNumber(10),
        answer: ''
      });
    });
  };
  // helper functions
  randomNumber(max: number) {
   return Math.floor(Math.random() * max);
  };
}
