import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { Subscription } from 'rxjs';
import { HttpService } from '../../../services/http.service';
import { TokenService } from '../../../services/token.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { PasswordValidationDirective } from '../password-validation.directive';
import { MatomoTracker } from 'ngx-matomo-client';

@Component({
  selector: 'app-provider-signup',
  imports: [CommonModule, FormsModule, NgbAlert, PasswordValidationDirective],
  templateUrl: './provider-signup.component.html',
  styleUrl: './provider-signup.component.css'
})
export class ProviderSignupComponent {
  private router = inject(Router)
  private renderer = inject(Renderer2)
  private httpService = inject(HttpService)
  private tokenService = inject(TokenService)
  private matomoTracker = inject(MatomoTracker)
  // private recaptchaV3Service = inject(ReCaptchaV3Service)
  private storageService = inject(StorageService)

  @ViewChild('sf') sf: ElementRef;
  recaptcha: Subscription;
  email:string
  password:string
  confirmPassword:string
  accountError:boolean
  isDisabled:boolean
  btnClass:string
  type: string
  
  constructor() {
    this.sf = {} as ElementRef
    this.email = ''
    this.password = ''
    this.confirmPassword = ''
    this.accountError = false
    this.isDisabled = false
    this.btnClass = 'btn-secondary'
    this.type = 'password'
    this.recaptcha = new Subscription()
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if(this.recaptcha){
      this.recaptcha.unsubscribe()
    }
  }

  showPassword() {
    this.type = this.type === 'password'? 'text':'password'
  }
 
  signup(signUpForm: any) {
    this.renderer.addClass(this.sf.nativeElement, 'was-validated');
    if (signUpForm.form.status === 'VALID') {
      this.isDisabled = true
      // this.recaptcha = this.recaptchaV3Service.execute('signup')
      //   .subscribe((token) => {
      //     this.isDisabled = true;
      //     let request = {
      //       email:signUpForm.form.value.email,
      //       password:signUpForm.form.value.password,
      //       token
      //     }
      //     this.httpService.createProviderAccount(request)
      //       .subscribe((resp:any) =>{
      //         if(resp.created){
      //           this.tokenService.setProviderAccessToken(resp.accessToken)
      //           this.tokenService.setProviderRefreshToken(resp.refreshToken)
      //           this.storageService.setProviderID(resp.tradespersonId)
      //           sessionStorage.setItem("SYNC", resp.tradespersonId)
      //           this.matomoTracker.trackGoal(1)
      //           location.href = resp.url
      //         } else {
      //           this.isDisabled = false;
      //           this.accountError = true
      //         }
      //       })
      //   });
      
      let request = {
        email:signUpForm.form.value.email,
        password:signUpForm.form.value.password,
        // token
      }
      this.httpService.createProviderAccount(request)
        .subscribe((resp:any) =>{
          if(resp.created){
            this.tokenService.setProviderAccessToken(resp.accessToken)
            this.tokenService.setProviderRefreshToken(resp.refreshToken)
            this.storageService.setProviderID(resp.tradespersonId)
            sessionStorage.setItem("SYNC", resp.tradespersonId)
            this.matomoTracker.trackGoal(1)
            location.href = resp.url
          } else {
            this.isDisabled = false;
            this.accountError = true
          }
        })
    }
  }

  close() {
    this.router.navigate(["/"])
  }
}
