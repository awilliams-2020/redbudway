import { CommonModule, NgTemplateOutlet, PlatformLocation } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-appointments',
  imports: [NgTemplateOutlet, CommonModule],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {
  public activeModal = inject(NgbActiveModal)
  private location = inject(PlatformLocation)
  private httpService = inject(HttpService)
  private router = inject(Router)

  @Input() providerId: string
  @Input() title: string
  @Input() subscription: boolean
  @Input() interval: string
  @Input() price: number
  @Input() startTime: string
  @Input() endTime: string
  @Input() customers: any[]
  index: number
  showAlert: boolean
  loading: boolean
  customer: string

  constructor() {
    this.location.onPopState(() => {this.activeModal.close()});
    this.providerId = ''
    this.title = ''
    this.subscription = false
    this.interval = ''
    this.price = 0
    this.startTime = ''
    this.endTime = ''
    this.customers = []
    this.index = -1
    this.showAlert = false
    this.loading = false
    this.customer = ''
  }

  ngOnInit(): void {}

  alert(index:number) {
    this.customer = this.customers[index].info.name
    this.index = index
    this.showAlert = true
  }

  continue() {
    this.loading = true
    const customer = this.customers[this.index]
    if(this.subscription) {
      this.cancelSubscription(customer.stripeId, customer.subscriptionId)
    } else {
      if(customer.status === 'draft'){
        this.deleteInvoice(customer.invoiceId)
      } else if(customer.status === 'open') {
        this.voidInvoice(customer.invoiceId)
      }
    }
  }

  cancel() {
    this.index = -1
    this.showAlert = false
  }

  cancelSubscription(cuStripeId:string, subscriptionId: string) {
    this.httpService.cancelSubscriptions(this.providerId, cuStripeId, [subscriptionId])
    .subscribe((resp:any) =>{
      if(resp.canceled) {
        this.customers.splice(this.index, 1)
        if(!this.customers.length) {
          this.activeModal.close(true)
        }
        this.showAlert = false
        this.loading = false
      }
    })
  }

  deleteInvoice(invoiceId:string) {
    this.httpService.deleteProviderInvoice(this.providerId, invoiceId)
      .subscribe((resp: any) => {
        if (resp.deleted) {
          this.customers.splice(this.index, 1)
          if(!this.customers.length) {
            this.activeModal.close(true)
          }
          this.showAlert = false
          this.loading = false
        }
      })
  }

  voidInvoice(invoiceId:string) {
    this.httpService.voidInvoice(this.providerId, invoiceId)
      .subscribe((resp: any) => {
        if (resp.voided) {
          this.customers.splice(this.index, 1)
          if(!this.customers.length) {
            this.activeModal.close(true)
          }
          this.showAlert = false
          this.loading = false
        }
      })
  }

  viewInvoice(invoiceId:string) {
    this.router.navigate(['/provider', this.providerId, 'billing', invoiceId])
    this.activeModal.close(false)
  }

  viewSubscriptions(stripeId:string) {
    this.router.navigate(['/provider', this.providerId, 'billing', 'subscriptions', stripeId])
    this.activeModal.close(false)
  }

}
