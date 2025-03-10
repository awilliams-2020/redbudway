import { Directive, ElementRef, Input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appPasswordValidation]'
})
export class PasswordValidationDirective {
  @Input('appPasswordValidation') password = ''

  constructor(private el:ElementRef) { }

  validate(control: AbstractControl): ValidationErrors | null {
    let equals = control.value === this.password
    equals? this.el.nativeElement.setCustomValidity(""): this.el.nativeElement.setCustomValidity("error")
    return equals? null: {'password': true}
  }
}
