import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../../services/http.service';
import { StorageService } from '../../../../../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manual-invoice',
  imports: [CommonModule],
  templateUrl: './manual-invoice.component.html',
  styleUrls: ['./manual-invoice.component.css']
})
export class ManualInvoiceComponent implements OnInit {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private modalService = inject(NgbModal)
  private storageService = inject(StorageService)

  providerId: string
  invoiceId: any
  invoice: any
  deleteSent: boolean
  voidSent: boolean
  uncollectSent: boolean
  finalizeSent: boolean
  refundSent: boolean
  loading: boolean

  constructor() {
    this.providerId = this.storageService.getProviderID()
    this.invoiceId = ''
    this.invoice = {}
    this.deleteSent = false
    this.voidSent = false
    this.uncollectSent = false
    this.finalizeSent = false
    this.refundSent = false
    this.loading = true
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params) => {
        this.invoiceId = params.get("invoiceId")
      })
    this.route.data
      .subscribe(({invoice}) => {
        this.invoice = invoice
        this.invoice.created = new Date(invoice.created * 1000)
        this.invoice.total = invoice.total / 100
        this.invoice.refund = new Date(invoice.refund * 1000)
        this.invoice.dueDate = new Date(invoice.dueDate * 1000)
        this.loading = false
      })
  }

  formatAmount(amount: string): string {
    return '$' + [amount.slice(0, amount.length - 2), ".", amount.slice(amount.length - 2)].join('')
  }

  refundCustomer() {
    this.refundSent = true
    this.httpService.refundManualInvoice(this.providerId,this.invoiceId)
      .subscribe((resp: any) => {
        if (resp.refunded) {
          this.ngOnInit()
          this.loading = false
        } 
      })
  }

  voidInvoice() {
    this.voidSent = true
    this.httpService.voidManualInvoice(this.providerId, this.invoiceId)
      .subscribe((resp: any) => {
        if (resp.voided) {
          this.close()
        }
      })
  }

  markInvoiceUncollectible() {
    this.uncollectSent = true
    this.httpService.markManualInvoiceUncollectible(this.providerId, this.invoiceId)
      .subscribe((resp: any) => {
        if (resp.uncollectible) {
          this.ngOnInit()
          this.loading = false
        }
      })
  }

  viewImage(image:any) {
    // const modalRef = this.modalService.open(ViewImageComponent, { centered: true });
    // modalRef.componentInstance.image = image
    // modalRef.componentInstance.status = this.invoice.status
  }

  close() {
    this.router.navigate(['../'], {relativeTo: this.route})
  }

}
