import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { GoogleService } from '../../../services/google.service';
import { TokenService } from '../../../services/token.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from '../../../services/storage.service';


@Component({
  selector: 'app-provider-login',
  imports: [
    CommonModule,
    FormsModule,
    NgbAlert,
    RouterLink
  ],
  templateUrl: './provider-login.component.html',
  styleUrl: './provider-login.component.css'
})
export class ProviderLoginComponent {
  router = inject(Router)
  route = inject(ActivatedRoute)
  renderer = inject(Renderer2)
  tokenService = inject(TokenService)
  // googleService = inject(GoogleService)
  storageService = inject(StorageService)
  httpService = inject(HttpService)
  @ViewChild('lf') lf: ElementRef
  @ViewChild('card') card: ElementRef

  email:string
  password:string
  loginError:boolean
  loggingIn:boolean
  type: string

  constructor() {
    this.lf = {} as ElementRef
    this.card = {} as ElementRef
    this.email = ''
    this.password = ''
    this.loginError = false
    this.loggingIn = false
    this.type = 'password'
  }

  ngOnInit(): void {}

  showPassword() {
    this.type = this.type === 'password'? 'text':'password'
  }

  login(loginForm: any) {
    this.renderer.addClass(this.lf.nativeElement, 'was-validated');
    if (loginForm.form.status === 'VALID') {
      this.loggingIn = true
      let email = loginForm.form.value.email
      let password = loginForm.form.value.password
      this.httpService.providerLogin(email, password)
        .subscribe((resp: any) => {
          if(resp.valid) {
            this.tokenService.setProviderAccessToken(resp.accessToken)
            this.tokenService.setProviderRefreshToken(resp.refreshToken)
            // if (resp.googleAccessToken){
            //   this.googleService.setTimeStamp(resp.expiresIn)
            //   this.googleService.setAccessToken(resp.googleAccessToken)
            //   this.googleService.setEmail(resp.email)
            //   this.googleService.setPicture(resp.picture)
            // }
            this.storageService.setProviderID(resp.tradespersonId)
            if(resp.admin) {
              this.storageService.setAdminID(resp.tradespersonId)
            }
            this.router.navigate(['/provider', resp.tradespersonId])
          } else {
            this.loggingIn = false
            this.loginError = true
          }
        })
    }
  }

  close() {
    this.router.navigateByUrl("/")
  }
}
