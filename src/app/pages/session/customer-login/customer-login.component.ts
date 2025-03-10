import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StorageService } from '../../../services/storage.service';
import { HttpService } from '../../../services/http.service';
import { TokenService } from '../../../services/token.service';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-login',
  imports: [CommonModule, RouterLink, FormsModule, NgbAlert],
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.css']
})
export class CustomerLoginComponent implements OnInit {
  private router = inject(Router)
  private renderer = inject(Renderer2)
  private httpService = inject(HttpService)
  private route = inject(ActivatedRoute)
  private tokenService = inject(TokenService)
  private storageService = inject(StorageService)

  @ViewChild('lf') lf: ElementRef;
  @ViewChild('card') card: ElementRef

  email: string
  password: string
  priceId: any
  customerId: any
  quoteId: any
  loginError: boolean
  loggingIn: boolean
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

  ngOnInit(): void {
    let customerId = this.storageService.getCustomerID()
    let tradespersonId = this.storageService.getProviderID()
    if (customerId !== '' || tradespersonId !== '') {
      this.router.navigate(['/'])
    }
    this.route.queryParams
      .pipe(filter(params => params['priceId']))
      .subscribe(params => {
        this.priceId = params['priceId']
      })

    this.route.queryParams
      .pipe(filter(params => params['quoteId']))
      .subscribe(params => {
        this.quoteId = params['quoteId']
      })

    this.route.queryParams
      .pipe(filter(params => params['customerId']))
      .subscribe(params => {
        this.customerId = params['customerId']
      })
  }

  showPassword() {
    this.type = this.type === 'password' ? 'text' : 'password'
  }

  login(loginForm: any) {
    this.renderer.addClass(this.lf.nativeElement, 'was-validated');
    if (loginForm.form.status === 'VALID') {
      this.loggingIn = true
      let email = loginForm.form.value.email
      let password = loginForm.form.value.password
      this.httpService.customerLogin(email, password)
        .subscribe((resp: any) => {
          if (resp.valid) {
            this.tokenService.setCustomerAccessToken(resp.accessToken)
            this.tokenService.setCustomerRefreshToken(resp.refreshToken)
            this.storageService.setCustomerID(resp.customerId)

            if (this.priceId) {
              this.router.navigateByUrl('/fixed-price/' + this.priceId)
            } else if (this.quoteId && this.customerId == null) {
              this.router.navigateByUrl('/quote/' + this.quoteId)
            } else if (this.quoteId && this.customerId) {
              this.router.navigate(['/customer', this.customerId, 'quotes', this.quoteId])
            } else {
              this.router.navigateByUrl('/')
            }
          } else {
            this.loggingIn = false
            this.loginError = true
          }
        })
    }
  }

  close() {
    this.router.navigate(["/"])
  }
}
