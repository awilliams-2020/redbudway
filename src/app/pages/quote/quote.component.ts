import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { CropperComponent } from '../../modals/cropper/cropper.component';
import { EmailComponent } from '../../modals/email/email.component';
import { ReviewComponent } from '../../modals/review/review.component';
import { ShareComponent } from '../../modals/share/share.component';
import { ThankYouComponent } from '../../modals/thank-you/thank-you.component';
import { ViewImageComponent } from '../../modals/view-image/view-image.component';
import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';
import { ImageService } from '../../services/image.service';
import { ToastService } from '../../services/toast.service';
import { ReviewsComponent } from '../provider/reviews/reviews.component';
import { StorageService } from '../../services/storage.service';
import { IconsModule } from '../../icons/icons.module';
import { ToastComponent } from '../../components/toast/toast.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-service',
  imports: [CommonModule, FormsModule, IconsModule, NgbRating, ToastComponent, NavbarComponent],
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private router = inject(Router)
  private modalService = inject(NgbModal)
  private imageService = inject(ImageService)
  private toastService = inject(ToastService)
  private renderer = inject(Renderer2)
  private storageService = inject(StorageService)

  @ViewChild("input") input: ElementRef = {} as ElementRef

  quoteId: string = ''
  customerId: string = this.storageService.getCustomerID()
  service: any = {}
  business: any = {}
  rating: number = 0
  readOnly: boolean = false
  copied: boolean = false
  disableRequest: boolean = false
  reviewMessage: string = ''
  url: string = ''
  requestMessage: string = ''
  images: any[] = []
  previousRoute: string = ''

  constructor() {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      if (params.get('quoteId')) {
        this.quoteId = params.get('quoteId')
        if (this.customerId !== '') {
          this.httpService.customerVerified(this.customerId)
            .subscribe((resp: any) => {
              if (resp.verified) {
                this.httpService.reviewedQuote(this.customerId, this.quoteId)
                  .subscribe((resp: any) => {
                    this.readOnly = resp.reviewed
                  })
              } else {
                this.router.navigateByUrl('/session/verify-email')
              }
            })
        }
      }
    })
    this.route.data
      .subscribe(({quote}) => {
        if (Object.keys({quote}).length !== 0) {
          this.url = 'https://redbudway.com/quote/' + this.quoteId
          this.service = quote['service']
          this.rating = this.service.rating
          this.business = quote['business']
        } else {
          this.router.navigateByUrl("/404")
        }
      })
    this.imageService.resetAttachmentSize()
    this.imageService.isErrors().subscribe((error: boolean) => {
      if(error){
        this.toastService.show(this.imageService.getErrorMsg(), {classname: 'bg-danger text-light', delay: 15000})
      }
    })
  }

  close() {
    this.router.navigateByUrl('/quotes')
  }

  viewReviews() {
    if (this.service.reviews > 0) {
      const modalRef = this.modalService.open(ReviewsComponent, { centered: true });
      modalRef.componentInstance.quoteId = this.quoteId
      modalRef.componentInstance.rating = this.rating
    }
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

  reviewQuote() {
    const modalRef = this.modalService.open(ReviewComponent, { centered: true });
    modalRef.componentInstance.rating = this.rating
    modalRef.componentInstance.typedMes.subscribe(($event: any) => {
      this.reviewMessage = $event
    })
    modalRef.result.then((result: any) => {
      let request = {
        message: this.reviewMessage,
        rating: this.rating
      }
      this.httpService.reviewQuote(this.quoteId, this.customerId, request)
        .subscribe((resp: any) => {
          if (resp.rated) {
            this.readOnly = true
            this.rating = this.service.rating
            this.ngOnInit()
          } else {
            this.rating = this.service.rating
            this.toastService.show('Failed to review quote', {classname: 'bg-danger text-light', delay: 15000})
          }
        })
    }, () => {
      this.rating = this.service.rating
    })
  }

  openEmailModal() {
    if (this.customerId != null) {
      const modalRef = this.modalService.open(EmailComponent, { centered: true });
      modalRef.componentInstance.customerId = this.customerId
      modalRef.componentInstance.providerID = this.business.tradespersonId
      modalRef.componentInstance.quoteId = this.quoteId
    } else {
      this.router.navigate(['/session/customer-login'], { queryParams: { quoteId: this.quoteId } })
    }
  }

  openFileExplorer() {
    this.input.nativeElement.click()
  }

  addImage($event: any) {
    const modalRef = this.modalService.open(CropperComponent, { centered: true });
    modalRef.componentInstance.image = $event
    modalRef.result.then((image:string)=>{
      this.images = this.imageService.addImage(image, this.images)
    }, ()=>{})
  }

  removeImage(index: number) {
    const image = this.images.splice(index, 1)
    this.imageService.reduceAttachmentSize(image[0])
  }

  viewImage(index: number) {
    const modalRef = this.modalService.open(ViewImageComponent, { centered: true });
    modalRef.componentInstance.image = this.images[index]
    modalRef.componentInstance.status = 'draft'
    modalRef.result.then((remove:boolean) => {
      if (remove) {
        const image = this.images.splice(index, 1)
        this.imageService.reduceAttachmentSize(image[0])
      }
    }, () => {})
  }

  requestQuote() {
    this.disableRequest = true
    let request = {
      message: this.requestMessage,
      images: this.images
    }
    const requestStr = JSON.stringify(request)
    if (!this.customerId) {
      this.router.navigateByUrl('/session/customer-login')
      return
    } else if (this.requestMessage.length < 120) {
      this.disableRequest = false
      this.toastService.show('Message needs to be at 120 characters.', {classname: 'bg-danger text-light', delay: 15000})
      return
    } else if ((new Blob([requestStr]).size / 1024) > 1000) {
      this.disableRequest = false
      this.toastService.show('Request too large. Reduce message size or remove images', {classname: 'bg-danger text-light', delay: 15000})
      return
    }
    this.httpService.requestQuote(request, this.customerId, this.quoteId).subscribe((resp: any) => {
      if (resp.requested) {
        const modalRef = this.modalService.open(ThankYouComponent, { centered: true });
        modalRef.componentInstance.type = 'quote'
        modalRef.result.then(()=>{},()=>{
          this.router.navigateByUrl('/quotes')
        })
      } else {
        this.disableRequest = false
        this.toastService.show('Failed to send request', {classname: 'bg-danger text-light', delay: 15000})
      }
    })
  }

  share() {
    const modalRef = this.modalService.open(ShareComponent, { centered: true });
    modalRef.componentInstance.url = this.url
    modalRef.componentInstance.title = this.service.title
  }

  viewProfile() {
    if (this.business.vanityURL) {
      this.router.navigate(['/business', this.business.vanityURL])
    } else {
      this.router.navigate(['/business', this.business.tradespersonId])
    }
  }
}
