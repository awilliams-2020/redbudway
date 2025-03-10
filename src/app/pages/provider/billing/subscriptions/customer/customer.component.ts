import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StorageService } from '../../../../../services/storage.service';
import { HttpService } from '../../../../../services/http.service';
import { ToastService } from '../../../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../../../../components/toast/toast.component';

@Component({
  selector: 'app-customer',
  imports: [CommonModule, RouterLink, ToastComponent],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private toastService = inject(ToastService)
  private storageService = inject(StorageService)

  loading: boolean
  providerID:any
  cuStripeId:any
  customer:any
  subscriptionsToCancel:string[]
  cancelSent:boolean

  constructor() {
    this.loading = true
    this.providerID = this.storageService.getProviderID()
    this.cuStripeId = ''
    this.customer = {}
    this.subscriptionsToCancel = []
    this.cancelSent = false
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params) => {
        this.cuStripeId = params.get("cuStripeId")
        this.getSubscriptions()
      })
  }
  
  getSubscriptions() {
    this.httpService.getCustomerSubscriptions(this.providerID,this.cuStripeId)
      .subscribe((customer:any) =>{
        this.customer = customer
        this.loading = false
      })
  }
  
  selectSubscriptionToCancel(i:number,j:number,) {
    let subscriptionId = this.customer.subscriptions[i].details[j].subscriptionId
    if(!this.subscriptionsToCancel.includes(subscriptionId)) {
      this.subscriptionsToCancel.push(subscriptionId)
    } else {
      let index =  this.subscriptionsToCancel.indexOf(subscriptionId)
      this.subscriptionsToCancel.splice(index, 1)
    }
  }

  cancelSubscriptions() {
    if(this.subscriptionsToCancel.length !== 0){
      this.cancelSent = true
      this.httpService.cancelSubscriptions(this.providerID, this.cuStripeId, this.subscriptionsToCancel)
        .subscribe((resp:any) =>{
          if(resp.canceled) {
            this.loading = true
            this.router.navigate(["/provider", 'billing', 'subscriptions'])
          } else {
            this.toastService.show('Failed to cancel subscription', {classname: 'bg-danger text-light', delay: 15000})
          }
        })
    }
  }

  createInvoice() {
    this.router.navigate(['/provider', 'billing', 'invoices', 'manual'])
  }

  close() {
    this.router.navigate(["/provider", 'billing', 'subscriptions'])
  }


}
