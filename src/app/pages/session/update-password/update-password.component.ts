import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpService } from '../../../services/http.service';
import { PasswordValidationDirective } from '../password-validation.directive';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-password',
  imports: [PasswordValidationDirective, FormsModule, NgbAlert, CommonModule],
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  private router = inject(Router)
  private renderer = inject(Renderer2)
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)

  @ViewChild('pf') pf: ElementRef;
  @ViewChild('card') card: ElementRef

  newPassword: string
  curPassword: string
  confirmPassword: string
  tradespersonId: string
  customerId: string
  passwordUpdated: boolean
  submitted: boolean
  type: string
  loading: boolean

  constructor() {
    this.newPassword = ''
    this.curPassword = ''
    this.confirmPassword = ''
    this.pf = {} as ElementRef;
    this.card = {} as ElementRef
    this.tradespersonId = ''
    this.customerId = ''
    this.passwordUpdated = false
    this.submitted = false
    this.type = 'password'
    this.loading = false
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(filter(params => params['tradespersonId']))
      .subscribe(params => {
        this.tradespersonId = params['tradespersonId']
      })
    this.route.queryParams
      .pipe(filter(params => params['customerId']))
      .subscribe(params => {
        this.customerId = params['customerId']
      })
  }

  showPassword() {
    this.type = this.type === 'password'? 'text':'password'
  }

  update(passwordForm: any) {
    this.renderer.addClass(this.pf.nativeElement, 'was-validated');
    if (passwordForm.form.status === 'VALID') {
      this.loading = true
      let request = {
        curPassword: this.curPassword,
        newPassword: this.newPassword
      }
      if (this.customerId !== '') {
        this.httpService.updateCustomerPassword(request, this.customerId)
          .subscribe((resp: any) => {
            this.loading = false
            this.submitted = true
            this.renderer.removeClass(this.pf.nativeElement, 'was-validated');
            passwordForm.resetForm()
            if(resp.updated) {
              this.passwordUpdated = true
            } else {
              this.passwordUpdated = false
            }
          })
      } else if (this.tradespersonId !== '') {
        this.httpService.updateProviderPassword(request, this.tradespersonId)
          .subscribe((resp: any) => {
            this.loading = false
            this.submitted = true
            this.renderer.removeClass(this.pf.nativeElement, 'was-validated');
            passwordForm.resetForm()
            if(resp.updated) {
              this.passwordUpdated = true
            } else {
              this.passwordUpdated = false
            }
          })
      }
    }
  }

  close() {
    this.router.navigateByUrl("/")
  }

}
