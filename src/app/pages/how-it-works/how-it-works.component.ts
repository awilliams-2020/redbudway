import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GoogleadsService } from '../../services/googleads.service';
import { HttpService } from '../../services/http.service';
import { TokenService } from '../../services/token.service';
import { StorageService } from '../../services/storage.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { PasswordValidationDirective } from '../session/password-validation.directive';
import { FormsModule } from '@angular/forms';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-how-it-works',
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    ServiceCardComponent,
    NgbAlert,
    RouterLink,
    PasswordValidationDirective
  ],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.css'
})
export class HowItWorksComponent {
  private renderer = inject(Renderer2)
  private httpService = inject(HttpService)
  private tokenService = inject(TokenService)
  // private matomoTracker = inject(MatomoTracker)
  // private recaptchaV3Service = inject(ReCaptchaV3Service)
  private storageService = inject(StorageService)
  private googleAds = inject(GoogleadsService)

  @ViewChild("fee") fee: ElementRef
  samples: any[]
  sampleQuotes: any[]

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
    this.fee = {} as ElementRef;
    this.samples = [
      {
        priceId: "1",
        image: `https://${environment.host}/assets/images/examples/catering.webp`,
        title: 'Wedding Catering',
        price: 2000.00,
        subscription: 0,
        interval: '',
        reviews: 5,
        rating: 3.2,
        availableTimeSlots: 54,
        jobs: 10,
        repeat: 3,
        business: {
          name: 'Exquisite Catering',
          vanityURL: "",
        }
      },
      {
        priceId: "2",
        image: `https://${environment.host}/assets/images/examples/baby-sitting.webp`,
        title: 'Baby Sitter',
        price: 35.00,
        subscription: 1,
        interval: 'week',
        reviews: 150,
        rating: 3.75,
        availableTimeSlots: 7,
        jobs: 200,
        repeat: 83,
        business: {
          name: 'Jane Doe',
          vanityURL: "",
        }
      },
      {
        priceId: "3",
        image: `https://${environment.host}/assets/images/examples/car-wash.webp`,
        title: 'Premium Detailing',
        price: 155.99,
        subscription: 1,
        interval: 'month',
        reviews: 10,
        rating: 4.0,
        availableTimeSlots: 100,
        jobs: 64,
        repeat:10,
        business: {
          name: 'ABC Detailing',
          vanityURL: "",
        }
      }
    ]
    this.sampleQuotes = [
      {
        image: `https://${environment.host}/assets/images/examples/landscaping.webp`,
        title: 'Landscaping',
        reviews: 99,
        rating: 3.0,
        description: 'Maintains gardens and lawns, including mowing, trimming, pruning, raking, and weeding ...',
        business: {
          name: 'Jims Landscaping',
          vanityURL: "",
        }
      },
      {
        image: `https://${environment.host}/assets/images/examples/cleaning.webp`,
        title: 'Home Cleaning',
        reviews: 5,
        rating: 5,
        description: 'Perform various cleaning tasks, which include mopping, vacuuming and sweeping flo...',
        business: {
          name: 'MaidsRUs LLC',
          vanityURL: "",
        }
      }
    ]
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

  ngAfterViewInit(): void {
    this.googleAds.pushAd()
    this.googleAds.pushAd()
    this.googleAds.pushAd()
  }

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
      //           // this.matomoTracker.trackGoal(1)
      //           location.href = resp.url
      //         } else {
      //           this.isDisabled = false;
      //           this.accountError = true
      //           this.renderer.removeClass(this.sf.nativeElement, 'was-validated');
      //         }
      //       })
      //   })
    }
  }
}
