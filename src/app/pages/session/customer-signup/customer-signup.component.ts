import { AfterViewInit, Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { HttpService } from '../../../services/http.service';
import { TokenService } from '../../../services/token.service';
import { UnitedStatesService } from '../../../services/united-states.service';
import { PasswordValidationDirective } from '../password-validation.directive';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-signup',
  imports: [CommonModule, PasswordValidationDirective, FormsModule, NgbAlert],
  templateUrl: './customer-signup.component.html',
  styleUrls: ['./customer-signup.component.css']
})
export class CustomerSignupComponent implements OnInit, AfterViewInit {
  private router = inject(Router)
  private renderer = inject(Renderer2)
  private httpService = inject(HttpService)
  private tokenService = inject(TokenService)
  private storageService = inject(StorageService)
  private unitedState = inject(UnitedStatesService)
  // private matomoTracker = inject(MatomoTracker)

  @ViewChild('sf') sf: ElementRef  = {} as ElementRef
  @ViewChild('card') card: ElementRef = {} as ElementRef

  states: any[] = this.unitedState.getUS()
  cities: any[] = []
  firstName:string = ''
  lastName:string = ''
  number:string = ''
  addressLineOne:string = ''
  addressLineTwo:string = ''
  state:string = ''
  city:string = ''
  zipcode:string = ''
  email:string = ''
  password:string = ''
  confirmPassword:string = ''
  accountError:boolean = false
  disableSignUp:boolean = false
  btnClass:string = 'btn-secondary'
  type: string = 'password'

  constructor() {}

  ngOnInit(): void {
    let customerId = this.storageService.getCustomerID()
    let providerId = this.storageService.getProviderID()
    if (customerId !== '' || providerId !== '') {
      this.router.navigate(['/'])
    }
  }

  ngAfterViewInit(): void {
    window.scrollTo({
      top:0,
      left:0,
      behavior:'smooth'
    })
  }

  selectedState($event:any) {
    for(let state of this.states) {
      if(state.state === $event.target.value) {
        this.cities = state.cities
      }
    }
  }

  addHyphen($event:any) {
    if(this.number.length === 3){
      this.number += '-'
    } else if(this.number.length === 7) {
      this.number += '-'
    }
  }

  showPassword() {
    this.type = this.type === 'password'? 'text':'password'
  }

  signup(signUpForm: any) {
    this.renderer.addClass(this.sf.nativeElement, 'was-validated');
    if (signUpForm.form.status === 'VALID') {
      this.disableSignUp = true
      let request = {
        name: signUpForm.form.value.firstName+' '+signUpForm.form.value.lastName,
        number:signUpForm.form.value.number,
        email:signUpForm.form.value.email,
        password:signUpForm.form.value.password,
        address: {
          lineOne:signUpForm.form.value.addressLineOne,
          lineTwo:signUpForm.form.value.addressLineTwo,
          state:signUpForm.form.value.state,
          city:signUpForm.form.value.city,
          zipcode:signUpForm.form.value.zipcode,
        }
      }
      this.httpService.createCustomerAccount(request)
        .subscribe((resp:any) =>{
          if(resp.created){
            this.tokenService.setCustomerAccessToken(resp.accessToken)
            this.tokenService.setCustomerRefreshToken(resp.refreshToken)
            this.storageService.setCustomerID(resp.customerId)
            // this.matomoTracker.trackGoal(2)
            this.router.navigateByUrl('/')
          } else {
            this.disableSignUp = false
            this.accountError = true
          }
        })
    }
  }

  close() {
    this.router.navigate(["/"])
  }
}
