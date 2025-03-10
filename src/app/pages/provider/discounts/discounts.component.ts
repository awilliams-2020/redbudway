import { Component, inject } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../services/http.service';
import { ToastService } from '../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../../icons/icons.module';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { StorageService } from '../../../services/storage.service';
import { ContinueComponent } from '../../../modals/continue/continue.component';
import { CouponNameComponent } from './coupon-name/coupon-name.component';
import { CouponServicesComponent } from './coupon-services/coupon-services.component';

@Component({
  selector: 'app-discounts',
  imports: [CommonModule, FormsModule, IconsModule, InfiniteScrollDirective],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.css'
})
export class DiscountsComponent {
  private router = inject(Router)
  private storageService = inject(StorageService)
  private httpService = inject(HttpService)
  private modalService = inject(NgbModal)
  private toastService = inject(ToastService)

  providerId: string
  discounts: any[]
  maxPages: number
  page: number
  loading: boolean
  today: Date
  dirty:boolean
  addingPromo: boolean

  constructor() {
    this.providerId = this.storageService.getProviderID()
    this.discounts = []
    this.loading = false
    this.maxPages = 1
    this.page = 1
    this.today = new Date()
    this.dirty = false
    this.addingPromo = false
  }

  ngOnInit(): void {
    this.getDiscounts()
  }

  createCoupon() {
    this.router.navigate(["/provider", "discounts", "coupon"])
  }

  getDiscounts() {
    this.httpService.getDiscounts(this.providerId)
      .subscribe((discounts:any) => {
        for (let discount of discounts) {
          discount.expired = false
          if(discount.redeemBy !== "0") {
            discount.redeemBy = new Date(this.format(discount.redeemBy))
            discount.expired = discount.redeemBy < this.today.getTime()
          }
          discount.redeemed = false
          if(discount.maxRedemptions && discount.timesRedeemed===discount.maxRedemptions){
            discount.redeemed = true
          }
        }
        this.discounts = discounts
      })
  }

  format(epoch: string) {
    return parseInt(epoch) * 1000
  }

  deleteCoupon(index: number) {
    const modalRef = this.modalService.open(ContinueComponent, { centered: true });
    modalRef.componentInstance.message = 'Are you sure you want to delete this coupon?'
    modalRef.result.then(() => {
      let discount = this.discounts[index]
      this.httpService.deleteCoupon(this.providerId, discount.id)
        .subscribe((resp:any)=>{
          if(!resp.deleted){
            this.toastService.show('Failed to delete coupon', {classname: 'bg-danger text-light', delay: 15000})
          } else {
            this.discounts.splice(index, 1)
          }
        })
    }, (reason: any) => {});
  }

  editCouponName(discount:any) {
    const modalRef = this.modalService.open(CouponNameComponent, { centered: true });
    modalRef.componentInstance.providerId = this.providerId
    modalRef.componentInstance.coupon = discount
    modalRef.result.then((name:any)=>{
      discount.name = name
    }, ()=>{})
  }

  editCouponServices(discount:any) {
    const modalRef = this.modalService.open(CouponServicesComponent, { centered: true });
    modalRef.componentInstance.providerId = this.providerId
    modalRef.componentInstance.coupon = discount
    modalRef.result.then((services:any)=>{
      discount.services = services
    }, ()=>{})
  }

  createPromo(discount:any, code:string, event:any) {
    this.httpService.createPromo(this.providerId, discount.id, code)
      .subscribe((resp:any) => {
        if(resp.created) {
          discount.promos.push(resp.promo)
        } else {
          event.target.value = ''
          event.target.hidden = false
          event.target.nextSibling.hidden = true
          this.toastService.show('Failed to create promo code', {classname: 'bg-danger text-light', delay: 15000})
        }
      })
  }

  createPromoCode(event:any, discount:any, code:NgModel) {
    event.target.hidden = true
    event.target.nextSibling.hidden = false
    if(!code.valid) {
      if(code.value !== '') {
        event.target.value = ''
        this.toastService.show('Promo code can not contain special characters', {classname: 'bg-danger text-light', delay: 15000})
      }
      event.target.hidden = false
      event.target.nextSibling.hidden = true
      return
    }
    this.createPromo(discount, code.value, event)
  }

  generatePromoCode(event:any, discount:any) {
    event.target.hidden = true
    event.target.nextSibling.hidden = false
    this.createPromo(discount, "", event)
  }

  updatePromo(event:any, promo:any) {
    let request = {
      ...promo,
      active: event.target.checked
    }
    this.httpService.updatePromo(this.providerId, promo.id, request)
      .subscribe((resp:any) => {
        if(resp.updated) {
          promo.active = event.target.checked
        } else {
          this.toastService.show('Failed to disable promo code', {classname: 'bg-danger text-light', delay: 15000})
        }
      })
  }
  
  onScroll() {
    if (!this.loading) {
      // this.getCoupons()
    }
  }
}
