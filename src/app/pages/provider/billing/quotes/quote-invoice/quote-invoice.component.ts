import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../../services/data.service';
import { HttpService } from '../../../../../services/http.service';
import { ToastService } from '../../../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../../../../components/toast/toast.component';
import { StorageService } from '../../../../../services/storage.service';

@Component({
  selector: 'app-quote-invoice',
  imports: [CommonModule, ToastComponent],
  templateUrl: './quote-invoice.component.html',
  styleUrls: ['./quote-invoice.component.css']
})
export class QuoteInvoiceComponent implements OnInit {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private modalService = inject(NgbModal)
  private toastService = inject(ToastService)
  private storageService = inject(StorageService)

  loading:boolean
  providerID:any
  quoteId:any
  invoiceId:any
  invoice: any
  deleteSent: boolean
  voidSent: boolean
  uncollectSent: boolean
  finalizeSent: boolean
  refundSent: boolean 

  constructor() {
    this.loading = true
    this.providerID = this.storageService.getProviderID()
    this.quoteId = ''
    this.invoiceId = ''
    this.invoice = {}
    this.deleteSent = false
    this.voidSent = false
    this.uncollectSent = false
    this.finalizeSent = false
    this.refundSent = false
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params) => {
        this.invoiceId = params.get("invoiceId")
        this.quoteId = params.get('quoteId')
        this.getQuoteInvoice()
      })
  }

  getQuoteInvoice(){
    this.httpService.getProviderQuoteInvoice(this.providerID, this.quoteId, this.invoiceId)
      .subscribe((invoice:any) => {
        this.invoice = invoice
        this.invoice.created = new Date(invoice.created * 1000)
        this.invoice.total = (invoice.total/100).toFixed(2)
        this.invoice.refunded = new Date(invoice.refunded * 1000)
        for(let product of this.invoice.products){
          // product.price = (product.price/100).toFixed(2)
        }
        this.loading = false
      })
  }

  addDescription(){
    // const modalRef = this.modalService.open(DescriptionComponent, { centered: true });
    // modalRef.componentInstance.description = this.invoice.description
    // modalRef.result.then((description: string) => {
    //   this.httpService.updateQuoteInvoiceDescrip(this.providerID,this.quoteId,this.invoiceId, description)
    //     .subscribe((resp:any) =>{
    //       if(resp.updated){
    //         this.invoice.description = description
    //       } else {
    //         this.displayErrorMsg('There was a problem adding memo to invoice')
    //       }
    //     })
    // })
  }

  refundCustomer() {
    this.refundSent = true
    this.httpService.refundQuoteInvoice(this.providerID, this.quoteId, this.invoiceId)
      .subscribe((resp: any) => {
        if (resp.refunded) {
          this.ngOnInit()
          this.loading = true
        } else {
          this.refundSent = false
          this.displayErrorMsg('There was a problem refunding customer')
        }
      })
  }

  finalizeInvoice() {
    this.finalizeSent = true
    this.httpService.finalizeProviderQuoteInvoice(this.providerID, this.quoteId, this.invoiceId)
      .subscribe((resp: any) => {
        if (resp.finalized) {
          this.ngOnInit()
          this.loading = true
        } else {
          this.finalizeSent = false
          this.displayErrorMsg('There was a problem sending invoice')
        }
      })
  }

  voidInvoice() {
    this.voidSent = true
    this.httpService.voidQuoteInvoice(this.providerID, this.quoteId, this.invoiceId)
      .subscribe((resp: any) => {
        if (resp.voided) {
          this.ngOnInit()
          this.loading = true
        } else {
          this.voidSent = false
          this.displayErrorMsg('There was a problem voiding invoice')
        }
      })
  }

  markInvoiceUncollectible() {
    this.uncollectSent = true
    this.httpService.markQuoteInvoiceUncollectible(this.providerID, this.quoteId, this.invoiceId)
      .subscribe((resp: any) => {
        if (resp.uncollectible) {
          this.ngOnInit()
          this.loading = true
        } else {
          this.uncollectSent = false
          this.displayErrorMsg('There was a problem marking invoice uncollectible')
        }
      })
  }

  displayErrorMsg(msg: string) {
    this.toastService.show(msg, {classname: 'bg-danger text-light', delay: 15000})
  }

  close() {
    this.router.navigate(['../'], {relativeTo:this.route})
  }

}
