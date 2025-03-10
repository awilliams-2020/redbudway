import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../../services/http.service';
import { ImageService } from '../../../../../services/image.service';
import { ToastService } from '../../../../../services/toast.service';
import { StorageService } from '../../../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../../../../icons/icons.module';
import { ToastComponent } from '../../../../../components/toast/toast.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  imports: [CommonModule, FormsModule, IconsModule, ToastComponent],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private modalService = inject(NgbModal)
  private toastService = inject(ToastService)
  private renderer = inject(Renderer2)
  private imageService = inject(ImageService)
  private storageService = inject(StorageService)

  @ViewChild('input') input: ElementRef
  loading: boolean
  providerId: any
  invoiceId: any
  invoice: any
  deleteSent: boolean
  voidSent: boolean
  uncollectSent: boolean
  finalizeSent: boolean
  refundSent: boolean
  promo: string
  verifying: boolean
  invalid: boolean

  constructor() {
    this.loading = true
    this.providerId = this.storageService.getProviderID()
    this.invoiceId = ''
    this.invoice = {}
    this.deleteSent = false
    this.voidSent = false
    this.uncollectSent = false
    this.finalizeSent = false
    this.refundSent = false
    this.promo = ''
    this.verifying = false
    this.invalid = false
    this.input = {} as ElementRef
  }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params:any) => {
        this.invoiceId = params.get("invoiceId")
      })
    this.route.data
      .subscribe(({invoice}) => {
        if (!invoice) {
          this.close()
        }
        this.invoice = invoice
        this.invoice.created = new Date(invoice.created * 1000)
        this.invoice.total = this.formatTotal(invoice.total)
        this.invoice.refunded = new Date(invoice.refunded * 1000)
        this.loading = false
      })
    this.imageService.isErrors().subscribe((error:boolean)=>{
      if(error) {
        this.toastService.show(this.imageService.getErrorMsg(), {classname: 'bg-danger text-light', delay: 15000})
      }
    })
  }

  viewMore(el: any, item: any) {
    if (item.parentElement.classList.contains('view-more')) {
      this.renderer.removeClass(item.parentElement, 'view-more')
      el.target.innerText = "view less"
    } else {
      this.renderer.addClass(item.parentElement, 'view-more')
      el.target.innerText = "view more"
    }
  }

  addDescription() {
    // const modalRef = this.modalService.open(DescriptionComponent, { centered: true });
    // modalRef.componentInstance.description = this.invoice.description
    // modalRef.result.then((description: string) => {
    //   let code = ""
    //   if (this.invoice.discount.valid) {
    //     code = this.invoice.discount.code
    //   }
    //   this.httpService.updateInvoice(
    //     this.providerId,
    //     this.invoiceId,
    //     {
    //       description,
    //       code: code,
    //       images: this.invoice.images
    //     }
    //   )
    //     .subscribe((resp: any) => {
    //       if (resp.updated) {
    //         this.invoice.description = description
    //       } else {
    //         this.displayErrorMsg('There was a problem adding memo to the invoice')
    //       }
    //     })
    // }, () => { });
  }

  removePromo() {
    this.httpService.updateInvoice(
      this.providerId,
      this.invoiceId,
      {
        description: this.invoice.description,
        code: '',
        images: this.invoice.images
      }
    )
      .subscribe((resp: any) => {
        this.verifying = false
        this.promo = ''
        if (resp.updated) {
          this.invoice.discount = { valid: false }
          this.invoice.total = this.formatTotal(resp.total)
        } else {
          this.displayErrorMsg('There was a problem removing discount from the invoice')
        }
      })
  }

  applyPromo() {
    this.verifying = true
    this.httpService.updateInvoice(
      this.providerId,
      this.invoiceId,
      {
        description: this.invoice.description,
        code: this.promo.trim(),
        images: this.invoice.images
      }
    )
      .subscribe((resp: any) => {
        this.verifying = false
        if (resp.updated) {
          this.invoice.discount = resp.discount
          this.invoice.total = this.formatTotal(resp.total)
        } else {
          this.promo = ''
          this.displayErrorMsg('There was a problem adding discount to the invoice')
        }
      })
  }

  formatTotal(total: number) {
    return total / 100
  }

  deleteInvoice() {
    this.deleteSent = true
    // const modalRef = this.modalService.open(ContinueComponent, { centered: true });
    // modalRef.componentInstance.message = 'Deleting invoice will cancel appointment.'
    // modalRef.result.then(() => {
    //   this.httpService.deleteProviderInvoice(this.providerId, this.invoiceId)
    //     .subscribe((resp: any) => {
    //       if (resp.deleted) {
    //         this.router.navigate(["/provider", 'billing'])
    //       } else {
    //         this.deleteSent = false
    //         this.displayErrorMsg('There was a problem deleting invoice')
    //       }
    //     })
    // }, (reason: any) => {
    //   this.deleteSent = false
    // });

  }

  refundCustomer() {
    this.refundSent = true
    this.httpService.refundInvoice(this.providerId, this.invoiceId)
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
    this.httpService.finalizeProviderInvoice(this.providerId, this.invoiceId)
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
    this.httpService.voidInvoice(this.providerId, this.invoiceId)
      .subscribe((resp: any) => {
        if (resp.voided) {
          this.close()
        } else {
          this.voidSent = false
          this.displayErrorMsg('There was a problem voiding invoice')
        }
      })
  }

  markInvoiceUncollectible() {
    this.uncollectSent = true
    this.httpService.markInvoiceUncollectible(this.providerId, this.invoiceId)
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
    this.toastService.show(msg, { classname: 'bg-danger text-light', delay: 15000 })
  }

  openCamera() {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video:
        {
          facingMode: { exact: "environment" },
        }
      }).then((stream) => {
        // const modalRef = this.modalService.open(CameraComponent, { centered: true });
        // modalRef.componentInstance.stream = stream
        // modalRef.result.then((image: any) => {
        //   this.openCropper(image)
        // }, () => { })
      })
      .catch((err) => {
        this.openFileExplorer()
      });
  }

  openFileExplorer() {
    this.input.nativeElement.click()
  }

  addImage($event: any) {
    // const modalRef = this.modalService.open(CropperComponent, { centered: true });
    // modalRef.componentInstance.image = $event
    // modalRef.result.then((image: string) => {
    //   this.invoice.images = this.imageService.addImage(image, this.invoice.images)
    //   this.httpService.updateInvoice(
    //     this.providerId,
    //     this.invoiceId,
    //     {
    //       description: this.invoice.description,
    //       code: this.promo.trim(),
    //       images: this.invoice.images
    //     }
    //   )
    //     .subscribe((resp: any) => {
    //       if (!resp.updated) {
    //         this.toastService.show("Failed to add image", {classname: 'bg-danger text-light', delay: 15000})
    //       }
    //     })
    // }, () => { })
  }

  openCropper(image: any) {
    // const modalRef = this.modalService.open(CropperComponent, { centered: true });
    // modalRef.componentInstance.base64Image = image
    // modalRef.result.then((image: string) => {
    //   this.invoice.images = this.imageService.addImage(image, this.invoice.images)
    //   this.httpService.updateInvoice(
    //     this.providerId,
    //     this.invoiceId,
    //     {
    //       description: this.invoice.description,
    //       code: this.promo.trim(),
    //       images: this.invoice.images
    //     }
    //   )
    //     .subscribe((resp: any) => {
    //       if (!resp.updated) {
    //         this.toastService.show("Failed to add image", {classname: 'bg-danger text-light', delay: 15000})
    //       }
    //     })
    // }, () => { })
  }

  viewImage(index: number) {
    // const modalRef = this.modalService.open(ViewImageComponent, { centered: true });
    // modalRef.componentInstance.image = this.invoice.images[index]
    // modalRef.componentInstance.status = this.invoice.status
    // modalRef.result.then((remove:boolean) => {
    //   if (remove) {
    //     this.invoice.images.splice(index, 1)
    //     this.httpService.updateInvoice(
    //       this.providerId,
    //       this.invoiceId,
    //       {
    //         description: this.invoice.description,
    //         code: this.promo.trim(),
    //         images: this.invoice.images
    //       }
    //     )
    //       .subscribe((resp: any) => {
    //         if (!resp.updated) {
    //           this.toastService.show("Failed to delete image", {classname: 'bg-danger text-light', delay: 15000})
    //         }
    //       })
    //   }
    // }, () => {})
  }

  close() {
    this.router.navigate(['../'], {relativeTo: this.route})
  }
}
