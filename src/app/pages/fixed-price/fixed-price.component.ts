import { Component, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { EmailComponent } from '../../modals/email/email.component';
import { ReviewComponent } from '../../modals/review/review.component';
import { ShareComponent } from '../../modals/share/share.component';
import { ThankYouComponent } from '../../modals/thank-you/thank-you.component';
import { HttpService } from '../../services/http.service';
import { LocationService } from '../../services/location.service';
import { ToastService } from '../../services/toast.service';
import { ReviewsComponent } from '../provider/reviews/reviews.component';
import { StorageService } from '../../services/storage.service';
import { formatInTimeZone } from 'date-fns-tz';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingComponent } from '../../components/booking/booking.component';
import { ToastComponent } from '../../components/toast/toast.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { DayPipe } from '../../pipes/day.pipe';
import { CalendarEvent } from 'angular-calendar';

@Component({
  selector: 'app-fixed-price',
  imports: [
    CommonModule,
    FormsModule,
    IconsModule,
    BookingComponent,
    NgbRating,
    ToastComponent,
    NavbarComponent,
    DayPipe
  ],
  templateUrl: './fixed-price.component.html',
  styleUrls: ['./fixed-price.component.css']
})
export class FixedPriceComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private router = inject(Router)
  private modalService = inject(NgbModal)
  private toastService = inject(ToastService)
  private renderer = inject(Renderer2)
  private locationService = inject(LocationService)
  private storageService = inject(StorageService)

  ONE_DAY = 24 * 60 * 60 * 1000
  priceId: any = ''
  total: number = 0
  customerId: any = this.storageService.getCustomerID()
  service: any = {}
  business: any = {}
  selectedTimeSlots: any[] = []
  rating: number = 0
  message: string = ''
  readOnly: boolean = true
  hasDefaultPayment: boolean = false
  copied: boolean = false
  disable: boolean = false
  url: string = ''
  quantity: number = 0
  timeZone: string = ''
  promo: string = ''
  verifying: boolean = false
  discount: any = { valid: false }
  discountApplied: boolean = false
  promoInvalid: boolean = false

  @ViewChild('calendar') calendar = {} as BookingComponent

  constructor() { }

  ngOnInit(): void {
    this.timeZone = this.locationService.getTimeZone()
    this.route.paramMap.subscribe((params: any) => {
      this.priceId = params.get('priceId')
      if (this.customerId !== '') {
        this.httpService.customerVerified(this.customerId)
          .subscribe((resp: any) => {
            if (!resp.verified) {
              this.router.navigateByUrl('/session/verify-email')
            }
          })
      }
    })
    this.route.data
      .subscribe(({fixedPrice}) => {
        if (Object.keys(fixedPrice).length !== 0) {
          this.url = `https://${environment.host}/fixed-price/${this.priceId}`
          this.service = fixedPrice['service']
          this.business = fixedPrice['business']
          if (fixedPrice['service'].timeZone) {
            this.timeZone = fixedPrice['business'].timeZone
          }
          this.rating = this.service.rating
          for (let timeSlot of this.service.timeSlots) {
            timeSlot.startTime = new Date(timeSlot.startTime)
            timeSlot.endTime = new Date(timeSlot.endTime)
            timeSlot.tempTaken = false
          }
          this.checkReview()
        } else {
          this.router.navigateByUrl("/404")
        }
      })
  }

  checkReview() {
    if (this.customerId !== '') {
      this.service.subscription ?
        this.httpService.reviewedSubscription(this.customerId, this.priceId)
          .subscribe((resp: any) => {
            this.readOnly = resp.reviewed
          }) :
        this.httpService.reviewedFixedPrice(this.customerId, this.priceId)
          .subscribe((resp: any) => {
            this.readOnly = resp.reviewed
          })
    }
  }

  openEmailModal() {
    if (this.customerId != null) {
      const modalRef = this.modalService.open(EmailComponent, { centered: true });
      modalRef.componentInstance.customerId = this.customerId
      modalRef.componentInstance.providerID = this.business.tradespersonId
      modalRef.componentInstance.priceId = this.priceId
    } else {
      this.router.navigate(['/session/customer-login'], { queryParams: { priceId: this.priceId } })
    }
  }

  removeTimeSlot($event: any) {
    this.calendar.removeTimeSlot($event)
  }

  addTimeslot($event: CalendarEvent) {
    if (this.selectedTimeSlots.length !== 0) {
      let exist = false
      for (let i = 0; i < this.selectedTimeSlots.length; i++) {
        let timeSlot = this.selectedTimeSlots[i]
        if (timeSlot.start.getTime() === $event.start.getTime()) {
          this.quantity -= $event.meta.quantity
          this.selectedTimeSlots.splice(i, 1)
          exist = true
        }
      }
      if (!exist) {
        this.quantity += $event.meta.quantity
        this.selectedTimeSlots.push($event)
      }
    } else {
      this.selectedTimeSlots.push($event)
      this.quantity += $event.meta.quantity
    }
    this.selectedTimeSlots.sort((a, b) => a.start.getTime() - b.start.getTime())
    this.subtractDiscount()
  }

  close() {
    this.router.navigateByUrl('/fixed-prices')
  }

  viewReviews() {
    if (this.service.reviews > 0) {
      const modalRef = this.modalService.open(ReviewsComponent, { centered: true });
      modalRef.componentInstance.priceId = this.priceId
      modalRef.componentInstance.rating = this.rating
    }
  }

  share() {
    const modalRef = this.modalService.open(ShareComponent, { centered: true });
    modalRef.componentInstance.url = this.url
    modalRef.componentInstance.title = this.service.title
  }

  getTimezoneShort(endTime: Date) {
    let timeZone = this.service.timeZone ? this.business.timeZone : this.timeZone
    return formatInTimeZone(endTime, timeZone, 'zzz')
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

  reviewFixedPrice() {
    const modalRef = this.modalService.open(ReviewComponent, { centered: true });
    modalRef.componentInstance.rating = this.rating
    modalRef.componentInstance.typedMes.subscribe(($event: any) => {
      this.message = $event
    })
    modalRef.result.then(() => {
      let request = {
        rating: this.rating,
        message: this.message
      }
      this.httpService.reviewFixedPrice(this.customerId, this.priceId, request)
        .subscribe((resp: any) => {
          if (resp.rated) {
            this.rating = this.service.rating
            this.readOnly = true
            this.ngOnInit()
          } else {
            this.rating = this.service.rating
            this.toastService.show('Failed to review service', { classname: 'bg-danger text-light', delay: 15000 })
          }
        })
    }, () => {
      this.rating = this.service.rating
    })
  }

  subtractDiscount() {
    if (this.discount.valid) {
      this.total = Math.round(this.service.price * parseFloat(this.quantity.toFixed(2)) * 100) / 100
      this.discount.total = this.total
      if (this.discount.type === 'percent_off') {
        this.total -= Math.ceil(this.total * this.discount.percent) / 100
      } else {
        this.total -= this.discount.amount
      }
      if (this.total < 0) {
        this.total = 0.00
      }
    } else {
      // this.total = Math.round(this.service.price * parseFloat(this.quantity.toFixed(2)) * 100) / 100
      this.total = this.service.price * this.quantity
    }
  }

  applyPromo() {
    this.promoInvalid = false
    this.verifying = true
    this.httpService.verifyPromo(this.promo, this.priceId, this.customerId)
      .subscribe((discount: any) => {
        if (!discount.valid) {
          this.promoInvalid = true
        }
        this.discount = discount
        this.subtractDiscount()
        this.promo = ''
        this.verifying = false
      })
  }

  async checkDefaultPayment() {
    return await this.httpService.hasDefaultPayment(this.customerId)
  }

  // defaultPaymentMethod() {
  //   const modalRef = this.modalService.open(PaymentComponent, { centered: true, backdrop: 'static', keyboard: false });
  //   modalRef.componentInstance.customerId = this.customerId
  // }

  determineFutureTime(startTime: Date, todaysDate: Date) {
    let futureTime = new Date()
    if (this.service.interval === 'week') {
      let correctedDate = (todaysDate.getDate() - todaysDate.getDay()) + startTime.getDay()
      futureTime = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), correctedDate, startTime.getHours(), startTime.getMinutes())
      if (futureTime.getTime() <= todaysDate.getTime()) {
        futureTime = new Date(futureTime.setDate(futureTime.getDate() + 7))
      }
    } else if (this.service.interval === 'month') {
      futureTime = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes())
      if (futureTime.getTime() <= todaysDate.getTime()) {
        futureTime = new Date(futureTime.setMonth(futureTime.getMonth() + 1))
      }
    } else if (this.service.interval === 'year') {
      futureTime = new Date(todaysDate.getFullYear(), todaysDate.getMonth(), startTime.getDate(), startTime.getHours(), startTime.getMinutes())
      if (futureTime.getTime() <= todaysDate.getTime()) {
        futureTime = new Date(futureTime.setFullYear(futureTime.getFullYear() + 1))
      }
    }
    return futureTime
  }

  resetErr(i: number, j: number) {
    this.service.form[i][j].error = ''
  }

  validateForm() {
    let error = false
    for (let row of this.service.form) {
      for (let col of row) {
        if (col.value === '' && col.type !== 'checkbox') {
          col.error = `${col.field} is required`
          error = true
        }
      }
    }
    return error
  }

  bookService() {
    if (this.validateForm()) {
      return
    }
    this.disable = true
    let customerId = this.storageService.getCustomerID()
    if (customerId !== '') {
      this.sendRequest()
    } else {
      this.router.navigate(['/session/customer-login'], { queryParams: { priceId: this.priceId } })
    }
  }

  sendRequest() {
    let timeSlots = []
    let todaysDate = new Date()
    for (let selectedTimeSlot of this.selectedTimeSlots) {
      let futureTime = this.determineFutureTime(selectedTimeSlot.start, todaysDate)
      timeSlots.push({
        id: selectedTimeSlot.meta.timeSlotId,
        startTime: selectedTimeSlot.start.toLocaleString(),
        endTime: selectedTimeSlot.end.toLocaleString(),
        anchorDate: futureTime.getTime(),
        quantity: selectedTimeSlot.meta.quantity,
      })
    }
    let request = {
      timeSlots: timeSlots,
      form: this.service.form,
      timeZone: this.getTimezoneShort(this.selectedTimeSlots[0].end),
      code: ''
    }
    if (this.discount.valid) {
      request.code = this.discount.code
    }
    this.httpService.bookFixedPrice(this.customerId, this.priceId, request, this.service.subscription).subscribe((resp: any) => {
      if (resp.booked) {
        const modalRef = this.modalService.open(ThankYouComponent, { centered: true });
        modalRef.componentInstance.type = 'service'
        modalRef.result.then(() => {
        }, () => {
          this.router.navigateByUrl('/fixed-prices')
        })
      } else {
        this.disable = false
        this.toastService.show('Failed to book service', { classname: 'bg-danger text-light', delay: 15000 })
      }
    })
  }

  viewProfile() {
    if (this.business.vanityURL) {
      this.router.navigate(['/business', this.business.vanityURL])
    } else {
      this.router.navigate(['/business', this.business.tradespersonId])
    }
  }

}
