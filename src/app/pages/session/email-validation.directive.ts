import { Directive, ElementRef } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appEmailValidation]'
})
export class EmailValidationDirective {
  constructor(private el:ElementRef) {}
    
  validate(control: AbstractControl): ValidationErrors | null {
    let emailRe = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi
    let valid = emailRe.test(control.value)
    valid? this.el.nativeElement.setCustomValidity(""): this.el.nativeElement.setCustomValidity("error")
    return valid? null: {'email': true}
  }
}
