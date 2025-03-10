import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { ToastComponent } from '../../../components/toast/toast.component';
import { IconsModule } from '../../../icons/icons.module';
import { NgbModal, NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../services/http.service';
import { ToastService } from '../../../services/toast.service';
import { StorageService } from '../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddressFormComponent } from './address-form/address-form.component';
import { EmailFormComponent } from './email-form/email-form.component';
import { NameFormComponent } from './name-form/name-form.component';
import { NumberFormComponent } from './number-form/number-form.component';
import { DescriptionComponent } from '../../../modals/description/description.component';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, NgbRating, ToastComponent, IconsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  private httpService = inject(HttpService)
  private dataService = inject(StorageService)
  private modalService = inject(NgbModal)
  private renderer = inject(Renderer2)
  private toastService = inject(ToastService)

  @ViewChild('vf') vf: ElementRef;
  @ViewChild("vanityURLInput") vanityURLInput: ElementRef
  @ViewChild("input") input: ElementRef
  @ViewChild("google") google: ElementRef

  enabled: boolean
  onboarded: boolean
  providerId: any
  provider: any
  loading: boolean
  imageLoading:boolean
  emailSwitch: boolean
  numberSwitch: boolean
  addressSwitch: boolean
  vanityURL: string
  url: string
  userInfo: any
  googleSync: boolean
  isVanitySaving: boolean
  timeZone: string
  isTimeZoneSaving: boolean
  errorMsg: string
  timeZoneInput: string

  constructor() {
    this.loading = true
    this.imageLoading = false
    this.enabled = false
    this.providerId = this.dataService.getProviderID()
    this.onboarded = false
    this.isVanitySaving = false
    this.isTimeZoneSaving = false
    this.errorMsg = ''
    this.timeZoneInput = ''
    this.vanityURLInput = {} as ElementRef
    this.input = {} as ElementRef
    this.vf = {} as ElementRef
    this.google = {} as ElementRef
    this.emailSwitch = true
    this.numberSwitch = true
    this.addressSwitch = true
    this.vanityURL = ''
    this.url = ''
    this.googleSync = false
    // googleService.sync.subscribe((userInfo: any) => {
    //   if(userInfo.unsync) {
    //     this.userInfo = null
    //     this.googleSync = false
    //   } else {
    //     this.userInfo = userInfo
    //     this.googleSync = true
    //   }
    // })
    this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  ngOnInit(): void {
    // if(this.googleService.getEmail()) {
    //   this.googleSync = true
    //   this.userInfo = {}
    //   this.userInfo.email = this.googleService.getEmail()
    //   this.userInfo.picture = this.googleService.getPicture()
    // }
    this.syncProfile()
  }

  async syncProfile() {
    if(sessionStorage.getItem("SYNC")) {
      await this.httpService.syncProfile(this.providerId)
      sessionStorage.removeItem("SYNC")
    }
    this.getProviderProfile()
  }

  getProviderProfile() {
    this.httpService.getProfile(this.providerId)
      .subscribe((provider: any) => {
        this.provider = provider
        this.provider.image = this.provider.image === '' ? "assets/images/placeholder.svg" : this.provider.image
        this.getProviderProfileSettings()
      })
  }

  onLoad() {
    this.imageLoading = false
  }

  getProviderProfileSettings() {
    this.httpService.getProfileSettings(this.providerId)
      .subscribe((settings: any) => {
        this.vanityURL = settings.vanityURL == '' ? this.providerId : settings.vanityURL
        this.url = 'https://redbudway.com/profile/' + this.vanityURL
        this.emailSwitch = settings.displayEmail
        this.numberSwitch = settings.displayNumber
        this.addressSwitch = settings.displayAddress
        if(settings.timeZone) {
          this.timeZone = settings.timeZone
        }
        this.loading = false
      })
  }

  updateDescription() {
    const modalRef = this.modalService.open(DescriptionComponent, { centered: true });
    modalRef.componentInstance.description = this.provider.description
    modalRef.result.then((description: string) => {
      this.httpService.updateProfile(this.providerId, {description})
        .subscribe((resp: any) => {
          if (resp.updated) {
            this.provider.description = description
          } else {
            this.toastService.show('Failed to update profile description.', {classname: 'bg-danger text-light', delay: 15000})
          }
        })
    }, ()=>{})
  }

  updateProfileSettings(emailSwitch:boolean, numberSwitch:boolean, addressSwitch:boolean) {
    this.emailSwitch = emailSwitch
    this.numberSwitch = numberSwitch
    this.addressSwitch = addressSwitch
    let request = {
      displayEmail: emailSwitch,
      displayNumber: numberSwitch,
      displayAddress: addressSwitch,
      vanityURL: this.vanityURL
    }
    this.httpService.updateSettings(this.providerId, request)
      .subscribe((resp: any) => {
        if (!resp.updated) {
          this.toastService.show('Failed to update profile settings.', {classname: 'bg-danger text-light', delay: 15000})
        }
      })
  }

  openFileExplorer() {
    this.input.nativeElement.click()
  }

  getTimeZone() {
    this.isTimeZoneSaving = true
    this.httpService.getAddress(this.timeZoneInput)
      .subscribe((location:any)=>{
        if(location.timeZone !== ''){
          this.saveTimeZone(location.timeZone)
        } else {
          this.isTimeZoneSaving = false
          this.errorMsg = 'Failed to find '+this.input
        }
      })
  }

  saveTimeZone(timeZone:string) {
    this.httpService.updateTimeZone(this.providerId, {timeZone})
      .subscribe((resp:any)=>{
        this.isTimeZoneSaving = false
        if(resp.updated){
          this.timeZone = timeZone
          this.timeZoneInput = ''
        } else {
          this.errorMsg = `Failed to save time zone ${timeZone}`
        }
      })
  }

  updateProfileImage($event: any) {
    // const modalRef = this.modalService.open(CropperComponent, { centered: true });
    // modalRef.componentInstance.image = $event
    // modalRef.result.then((image:string)=>{
    //   this.httpService.updateProfile(this.providerId, {image}).subscribe((resp: any) => {
    //     if (resp.updated) {
    //       this.provider.image = image
    //     } else {
    //       this.toastService.show('Failed to update profile picture.', {classname: 'bg-danger text-light', delay: 15000})
    //     }
    //   })
    // }, ()=>{})
  }

  updateVanityURL(profileForm: any) {
    this.isVanitySaving = true
    this.renderer.addClass(this.vf.nativeElement, 'was-validated');
    this.vanityURLInput.nativeElement.setCustomValidity("")
    if (profileForm.form.status === 'VALID') {
      this.vanityURL = this.vanityURL.replace(/[?\s]/g, "")
      let request = {
        displayEmail: this.emailSwitch,
        displayNumber: this.numberSwitch,
        displayAddress: this.addressSwitch,
        vanityURL: this.vanityURL
      }
      this.httpService.updateSettings(this.providerId, request)
        .subscribe((resp: any) => {
          this.isVanitySaving = false
          this.renderer.removeClass(this.vf.nativeElement, 'was-validated')
          if (resp.updated) {
            if (this.vanityURL === '') {
              this.vanityURL = this.providerId
            }
          } else {
            this.vanityURLInput.nativeElement.setCustomValidity("taken")
          }
        })
    }
  }

  openAddressForm() {
    const modalRef = this.modalService.open(AddressFormComponent, { centered: true });
    modalRef.componentInstance.providerId = this.providerId
    modalRef.componentInstance.address = this.provider.address
    modalRef.result.then((address:any)=>{
      this.provider.address = address
    }, ()=>{})
  }

  openNameForm() {
    const modalRef = this.modalService.open(NameFormComponent, { centered: true });
    modalRef.componentInstance.providerId = this.providerId
    modalRef.componentInstance._name = this.provider.name
    modalRef.result.then((name:any)=>{
      this.provider.name = name
    }, ()=>{})
  }

  openNumberForm() {
    const modalRef = this.modalService.open(NumberFormComponent, { centered: true });
    modalRef.componentInstance.providerId = this.providerId
    modalRef.componentInstance._number = this.provider.number
    modalRef.result.then((number:any)=>{
      this.provider.number = number
    }, ()=>{})
  }

  openEmailForm() {
    const modalRef = this.modalService.open(EmailFormComponent, { centered: true });
    modalRef.componentInstance.providerId = this.providerId
    modalRef.componentInstance._email = this.provider.email
    modalRef.result.then((email:any)=>{
      this.provider.email = email
    }, ()=>{})
  }
}
