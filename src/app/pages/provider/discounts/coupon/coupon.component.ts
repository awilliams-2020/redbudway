import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../../../services/data.service';
import { HttpService } from '../../../../services/http.service';
import { ToastService } from '../../../../services/toast.service';
import { StorageService } from '../../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../../../components/toast/toast.component';

@Component({
  selector: 'app-coupon',
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './coupon.component.html',
  styleUrl: './coupon.component.css'
})
export class CouponComponent {
  private storageService = inject(StorageService)
  private router = inject(Router)
  private renderer = inject(Renderer2)
  private httpService = inject(HttpService)
  private toastService = inject(ToastService)

  @ViewChild('cf') cf: ElementRef;
  providerId: any
  sent: boolean
  type: string
  name: string
  amountOff: number
  percentOff: number
  duration: string
  months: number
  subscriptions: boolean
  maxRedemption: boolean
  maxRedemptions: number
  services: any[]
  selectedServices: any[]
  limitedTime: boolean
  redeemBy: string

  constructor() {
    this.providerId = this.storageService.getProviderID()
    this.cf = {} as ElementRef
    this.sent = false
    this.type = 'percent_off'
    this.name = ''
    this.amountOff = 0
    this.percentOff = 0
    this.duration = 'once'
    this.months = 1
    this.subscriptions = false
    this.maxRedemption = false
    this.maxRedemptions = 0
    this.services = []
    this.selectedServices = []
    this.limitedTime = false
    this.redeemBy = ''
  }

  ngOnInit(): void {
    this.getServices()
  }

  updateDuration() {
    this.duration = !this.subscriptions ? "repeating" : "once"
  }

  getServices() {
    this.httpService.getServices(this.providerId)
      .subscribe((services: any) => {
        this.services = services
      })
  }

  close() {
    this.router.navigate(["/provider", 'discounts'])
  }

  create(couponForm: any) {
    this.renderer.addClass(this.cf.nativeElement, 'was-validated');
    if (couponForm.form.status === 'VALID') {
      couponForm.form.value.percent = Math.floor(couponForm.form.value.percent)
      this.sent = true
      let redeemBy = '0'
      if (this.limitedTime) {
        // redeemBy = formatInTimeZone(couponForm.form.value.redeemBy, Intl.DateTimeFormat().resolvedOptions().timeZone, 'yyyy-MM-dd\'T\'HH:mm:ssXXX')
      }
      let request = {
        ...couponForm.form.value,
        redeemBy,
        duration: this.duration
      }
      this.httpService.createCoupon(this.providerId, request)
        .subscribe((resp: any) => {
          if (resp.created) {
            this.router.navigate(['/provider', 'discounts'])
          } else {
            this.sent = false
            this.toastService.show('Failed to create coupon', { classname: 'bg-danger text-light', delay: 15000 })
          }
        })
    }
  }
}
