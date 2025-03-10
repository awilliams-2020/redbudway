import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpService } from '../../../services/http.service';
import { PasswordValidationDirective } from '../password-validation.directive';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from '../../../icons/icons.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, PasswordValidationDirective, FormsModule, NgbAlert, IconsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private router = inject(Router)
  private renderer = inject(Renderer2)
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)

  @ViewChild('pf') pf: ElementRef;
  @ViewChild('card') card: ElementRef

  password: string
  confirmPassword: string
  token: string
  accountType: string
  error: boolean
  type: string
  loading: boolean

  constructor() {
    this.password = ''
    this.confirmPassword = ''
    this.pf = {} as ElementRef;
    this.card = {} as ElementRef
    this.token = ''
    this.accountType = ''
    this.error = false
    this.type = 'password'
    this.loading = false
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(filter(params => params['token']))
      .subscribe(params => {
        this.token = params['token']
      })
    this.route.queryParams
      .pipe(filter(params => params['accountType']))
      .subscribe(params => {
        this.accountType = params['accountType']
      })
  }

  ngAfterViewInit(): void {
    if(this.token === '') {
      this.router.navigateByUrl('/')
    }
  }

  showPassword() {
    this.type = this.type === 'password'? 'text':'password'
  }

  reset(passwordForm: any) {
    this.renderer.addClass(this.pf.nativeElement, 'was-validated');
    if (passwordForm.form.status === 'VALID') {
      this.loading = true
      let request = {
        password: this.password,
        accountType:this.accountType
      }
      this.httpService.resetPassword(this.token, request)
        .subscribe((resp: any) => {
          if (resp.updated) {
            if (this.accountType === 'provider') {
              this.router.navigateByUrl('/session/provider-login')
            } else {
              this.router.navigateByUrl('/session/customer-login')
            }
          } else {
            this.error = true
            this.renderer.removeClass(this.pf.nativeElement, 'was-validated');
            passwordForm.resetForm()
          }
          this.loading = false
        })
    }
  }

  close() {
    this.router.navigateByUrl("/")
  }

}
