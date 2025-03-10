import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../../services/http.service';
import { DataService } from '../../../../../services/data.service';
import { ToastService } from '../../../../../services/toast.service';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../../../../components/toast/toast.component';
import { StorageService } from '../../../../../services/storage.service';

@Component({
  selector: 'app-quote',
  imports: [CommonModule, RouterLink, ToastComponent],
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private modalService = inject(NgbModal)
  private toastService = inject(ToastService)
  private renderer = inject(Renderer2)
  private storageService = inject(StorageService)

  @ViewChild('pdf') pdf: ElementRef
  providerID: any
  quoteId: any
  quote: any
  cancelSent: boolean
  finalizeSent: boolean
  updateSent: boolean
  reviseSent: boolean
  total: string
  productError: boolean
  downloading: boolean
  loading: boolean

  constructor() {
    this.pdf = {} as ElementRef
    this.providerID = this.storageService.getProviderID()
    this.quoteId = ''
    this.quote = {}
    this.cancelSent = false
    this.finalizeSent = false
    this.updateSent = false
    this.reviseSent = false
    this.total = '0.00'
    this.productError = false
    this.downloading = false
    this.loading = true
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params) => {
        this.quoteId = params.get("quoteId")
      })
    this.route.data
      .subscribe(({quote}) => {
        this.quote = quote
        this.quote.created = new Date(quote.created * 1000)
        this.quote.expires = new Date(quote.expires * 1000)
        this.total = '0.00'
        for (let product of this.quote.service.products) {
          this.total = (parseFloat(this.total) + (product.price / 100) * product.quantity).toFixed(2)
          // product.price = (product.price / 100).toFixed(2)
        }
        this.loading = false
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

  viewImage(image: any) {
    // const modalRef = this.modalService.open(ViewImageComponent, { centered: true });
    // modalRef.componentInstance.image = image
  }

  addDescription() {
    // const modalRef = this.modalService.open(DescriptionComponent, { centered: true });
    // modalRef.componentInstance.description = this.quote.description
    // modalRef.result.then((description: string) => {
    //   if (description === '') {
    //     this.quote.description = null
    //   } else {
    //     this.quote.description = description
    //   }
    //   this.updateQuote()
    // })
  }

  addCost() {
    // const modalRef = this.modalService.open(LineItemComponent, { centered: true });
    // modalRef.componentInstance.newProduct.subscribe((product: any) => {
    //   this.productError = false
    //   this.quote.service.products.push(product)
    //   this.total = (parseFloat(this.total) + (parseFloat(product.price) * parseInt(product.quantity))).toFixed(2)
    //   this.updateQuote()
    // })
  }

  updateCost(product: any) {
    if (this.quote.status === 'draft') {

    }
    // const modalRef = this.modalService.open(LineItemComponent, { centered: true });
    // modalRef.componentInstance.product = product
    // modalRef.componentInstance.newProduct.subscribe(() => {
    //   this.total = '0'
    //   for (let product of this.quote.service.products) {
    //     this.total = (parseFloat(this.total) + (parseFloat(product.price) * parseInt(product.quantity))).toFixed(2)
    //   }
    //   this.updateQuote()
    // })
  }

  removeCost(index: number) {
    let product = this.quote.service.products.splice(index, 1)[0]
    this.total = (parseFloat(this.total) - (parseFloat(product.price) * parseInt(product.quantity))).toFixed(2)
    this.updateQuote()
  }

  cancelQuote() {
    this.cancelSent = true
    this.httpService.cancelProviderQuote(this.providerID, this.quoteId)
      .subscribe((resp: any) => {
        if (resp.canceled) {
          this.router.navigate(["/provider", 'billing', 'quotes'])
        } else {
          this.cancelSent = false
          this.displayErrorMsg('There was a problem deleting invoice')
        }
      })
  }

  finalizeQuote() {
    if (this.quote.service.products.length !== 0) {
      this.finalizeSent = true
      this.httpService.finalizeQuoteRequest(this.providerID, this.quoteId)
        .subscribe((resp: any) => {
          if (resp.finalized) {
            this.ngOnInit()
            this.loading = true
            this.finalizeSent = false
          } else {
            this.finalizeSent = false
            this.displayErrorMsg('There was a problem deleting invoice')
          }
        })
    } else {
      this.productError = true
    }
  }

  reviseQuote() {
    this.reviseSent = true
    this.httpService.reviseQuoteRequest(this.providerID, this.quoteId)
      .subscribe((resp: any) => {
        if (resp.revised) {
          this.loading = true
          this.reviseSent = false
          this.router.navigate(["/provider", 'billing', 'quotes', resp.quoteId])
        } else {
          this.reviseSent = false
          this.displayErrorMsg('There was a problem deleting invoice')
        }
      })
  }

  updateQuote() {
    this.updateSent = true
    let products = []
    for (let product of this.quote.service.products) {
      products.push({
        title: product.title,
        price: Math.trunc(parseFloat(product.price) * 100),
        quantity: parseInt(product.quantity, 10)
      })
    }
    let request = {
      products: products,
      description: this.quote.description
    }
    this.httpService.updateQuoteRequest(this.providerID, this.quoteId, request)
      .subscribe((resp: any) => {
        if (!resp.updated) {
          this.updateSent = false
          this.displayErrorMsg('There was a problem updating invoice')

        }
      })
  }

  displayErrorMsg(msg: string) {
    this.toastService.show(msg, {classname: 'bg-danger text-light', delay: 15000})
  }

  downloadPDF() {
    this.downloading = true
    this.httpService.getProviderQuotePDF(this.providerID, this.quoteId)
      .subscribe((pdf:any)=>{
        var reader = new FileReader();
        reader.readAsDataURL(pdf); 
        reader.onloadend = () => {
          this.downloading = false
          const base64data = reader.result;                
          this.pdf.nativeElement.href = base64data
          this.pdf.nativeElement.download = `${this.quoteId}.pdf`
          this.pdf.nativeElement.click()
        }
      })
  }

  close() {
    this.router.navigate(['../'], {relativeTo:this.route})
  }
}
