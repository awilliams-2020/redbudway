import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { StorageService } from '../../../services/storage.service';
import { ToastService } from '../../../services/toast.service';
import { HttpService } from '../../../services/http.service';
import { environment } from '../../../../environments/environment';
import { CropperComponent } from '../../../modals/cropper/cropper.component';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../../icons/icons.module';
import { ToastComponent } from '../../../components/toast/toast.component';

@Component({
  selector: 'app-branding',
  imports: [CommonModule, NgbNavModule, IconsModule, ToastComponent],
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.css']
})
export class BrandingComponent implements OnInit {
  private modalService = inject(NgbModal)
  private httpService = inject(HttpService)
  private storageService = inject(StorageService)
  private toastService = inject(ToastService)

  @ViewChild("iconInput") iconInput: ElementRef
  @ViewChild("logoInput") logoInput: ElementRef
  @ViewChild("primaryInput") primaryInput: ElementRef
  @ViewChild("secondaryInput") secondaryInput: ElementRef
  logoLoading: boolean
  iconLoading: boolean
  branding: any
  providerId: string
  issued: Date
  due: Date
  provider: any
  active = 1;
  loading: boolean
  service: any
  
  constructor() {
    this.providerId = this.storageService.getProviderID()
    this.logoLoading = true
    this.iconLoading = true
    this.logoInput = {} as ElementRef
    this.iconInput = {} as ElementRef
    this.primaryInput = {} as ElementRef
    this.secondaryInput = {} as ElementRef
    this.loading = true
    this.issued = new Date()
    this.due = new Date()
    this.due.setDate(this.due.getDate()+30)
    this.service = {
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
  }

  ngOnInit(): void {
    this.getProviderBranding()
    this.getProviderProfile()
  }

  getProviderBranding() {
    this.httpService.getBranding(this.providerId).subscribe((branding: any) => {
      this.branding = branding
      if(!branding.logo) {
        this.logoLoading = false
      }
      if(!branding.icon) {
        this.iconLoading = false
      } else {
        this.service.business.icon = branding.icon
      }
      if(branding.primary) {
        this.service.business.primary = branding.primary
      }
      if(branding.secondary) {
        this.service.business.secondary = branding.secondary
      }
      this.loading = false
    })
  }

  getProviderProfile() {
    this.httpService.getProfile(this.providerId).subscribe((provider: any) => {
      this.provider = provider
    })
  }

  onLogoLoad() {
    this.logoLoading = false
  }

  onIconLoad() {
    this.iconLoading = false
  }

  openFileExplorer(type:string) {
    if(type === 'logo') {
      this.logoInput.nativeElement.click()
    } else if (type === 'icon') {
      this.iconInput.nativeElement.click()
    }
  }

  updateLogoImage($event: any) {
    const modalRef = this.modalService.open(CropperComponent, { centered: true });
    modalRef.componentInstance.image = $event
    modalRef.result.then((image:string)=>{
      this.logoLoading = true
      this.branding.logo = image
      this.httpService.updateBranding(this.providerId, this.branding).subscribe((resp: any) => {
        if (!resp.updated) {
          this.toastService.show('Failed to update branding logo', {classname: 'bg-danger text-light', delay: 15000})
        }
      })
      this.logoLoading = false
    }, ()=>{})
  }

  updateIconImage($event: any) {
    const modalRef = this.modalService.open(CropperComponent, { centered: true });
    modalRef.componentInstance.image = $event
    modalRef.result.then((image:string)=>{
      this.iconLoading = true
      this.branding.icon = image
      this.service.business.icon = image
      this.httpService.updateBranding(this.providerId, this.branding).subscribe((resp: any) => {
        if (!resp.updated) {
          this.toastService.show('Failed to update branding icon', {classname: 'bg-danger text-light', delay: 15000})
        }
        this.iconLoading = false
      })
    }, ()=>{})
  }

  remove(type:string) {
    if(type === 'logo') {
      delete this.branding.logo
    } else if(type === 'icon') {
      delete this.branding.icon
    } else if(type ==='primary'){
      delete this.branding.primary
    } else if(type === 'secondary') {
      delete this.branding.secondary
    }
    this.httpService.updateBranding(this.providerId, this.branding).subscribe((resp: any) => {
      if (!resp.updated) {
        this.toastService.show('Failed to update branding', {classname: 'bg-danger text-light', delay: 15000})
      }
    })
  }

  openColorPicker(type:string) {
    if(type === 'primary') {
      this.primaryInput.nativeElement.click()
    } else if (type === 'secondary') {
      this.secondaryInput.nativeElement.click()
    }
  }

  updatePrimaryColor($event: any) {
    this.branding.primary = $event.target.value
    this.service.business.primary = $event.target.value
    this.httpService.updateBranding(this.providerId, this.branding).subscribe((resp: any) => {
      if (!resp.updated) {
        this.toastService.show('Failed to update branding', {classname: 'bg-danger text-light', delay: 15000})
      }
    })
  }

  updateSecondaryColor($event: any) {
    this.branding.secondary = $event.target.value
    this.service.business.secondary = $event.target.value
    this.httpService.updateBranding(this.providerId, this.branding).subscribe((resp: any) => {
      if (!resp.updated) {
        this.toastService.show('Failed to update branding', {classname: 'bg-danger text-light', delay: 15000})
      }
    })
  }

}
