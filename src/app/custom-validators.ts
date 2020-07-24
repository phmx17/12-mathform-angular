// exported custom validator, as it does not belowg inside the equation component
import { AbstractControl } from '@angular/forms';

//  making validator reusable for callers that don't use 'a', 'b', 'answer'
export class CustomValidators {
  static addition(target: string, sourceOne: string, sourceTwo: string) {   // static means no instance required to access function; but also NO access to instance variables; makes clear that only passed arguments can be used
    return(form: AbstractControl) => {    // function returning a function 
      const sum = form.value[target]; // target, sourceOne and sourceTwo are string literals !!
      const firstNumber = form.value[sourceOne];
      const secondNumber = form.value[sourceTwo];
      const{ a, b, answer } = form.value
        if (firstNumber + secondNumber === parseInt(sum)) {
          return null;
        };
        return { addition: false };      
    }
  };
  
}
