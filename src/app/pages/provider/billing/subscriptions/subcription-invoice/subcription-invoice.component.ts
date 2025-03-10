import { Component, inject, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { DataService } from '../../../../../services/data.service';
import { HttpService } from '../../../../../services/http.service';
import { ToastService } from '../../../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../../../../components/toast/toast.component';
import { StorageService } from '../../../../../services/storage.service';

@Component({
  selector: 'app-subcription-invoice',
  imports: [CommonModule, ToastComponent],
  templateUrl: './subcription-invoice.component.html',
  styleUrls: ['./subcription-invoice.component.css']
})
export class SubcriptionInvoiceComponent implements OnInit {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private toastService = inject(ToastService)
  private renderer = inject(Renderer2)
  private storageService = inject(StorageService)

  loading: boolean
  providerID: any
  cuStripeId:any
  invoiceId: any
  invoice: any
  subscriptionId:any
  
  constructor() {
    this.loading = true
    this.providerID = this.storageService.getProviderID()
    this.cuStripeId = ''
    this.invoiceId = ''
    this.invoice = {}
    this.subscriptionId = ''
  }

  ngOnInit(): void {
    combineLatest([
      this.route.paramMap,
      this.route.queryParamMap
    ])
      .subscribe((resp) => {
        this.invoiceId = resp[0].get("invoiceId")
        this.cuStripeId = resp[0].get('cuStripeId')
        this.subscriptionId = resp[1].get('subscriptionId')
        this.getSubscriptionInvoice()
      })
  }

  getSubscriptionInvoice() {
    this.httpService.getProviderSubscriptionInvoice(this.providerID, this.cuStripeId, this.subscriptionId, this.invoiceId)
      .subscribe((invoice: any) => {
        this.invoice = invoice
        this.invoice.created = new Date(invoice.created*1000)
        this.invoice.total = invoice.total/100
        this.invoice.refunded = new Date(invoice.refunded*1000)
        this.loading = false
      })
  }

  refundCustomer() {
    this.httpService.refundSubscriptionInvoice(this.providerID, this.cuStripeId, this.subscriptionId, this.invoiceId)
      .subscribe((resp: any) => {
        if (resp.refunded) {
          this.ngOnInit()
          this.loading = false
        } else {
          this.toastService.show('There was a problem refunding customer', {classname: 'bg-danger text-light', delay: 15000})
        }
      })
  }

  viewMore(el:any, item:any) {
    if(item.parentElement.classList.contains('view-more')) {
      this.renderer.removeClass(item.parentElement, 'view-more')
      el.target.innerText = "view less"
    } else {
      this.renderer.addClass(item.parentElement, 'view-more')
      el.target.innerText = "view more"
    }
  }

  close() {
    this.router.navigate(['../'], {relativeTo: this.route})
  }

}
