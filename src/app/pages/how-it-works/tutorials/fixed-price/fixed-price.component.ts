import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { formatInTimeZone } from 'date-fns-tz';
import * as introJs from 'intro.js/intro.js';
import { ReviewComponent } from '../../../../modals/review/review.component';

@Component({
  selector: 'app-fixed-price',
  templateUrl: './fixed-price.component.html',
  styleUrls: ['./fixed-price.component.css']
})
export class FixedPriceComponent implements OnInit, AfterViewInit, OnDestroy {
  priceId: any
  total: number
  customerId: any
  state: string
  city: string
  promo: string
  service: any
  selectedTimeSlots: any[]
  timeSlotError: boolean
  rating: number
  readOnly: boolean
  disableBooking: boolean
  introJS: any
  today: Date
  tomorrow: Date
  dayAfterTomorrow: Date
  quantity: number
  business: any
  discount: any
  disable: boolean
  timeZone: string

  constructor(private router: Router, private modalService: NgbModal) {
    this.priceId = ''
    this.total = 0
    this.state = ''
    this.city = ''
    this.quantity = 0
    this.promo = ''
    let tempDate = new Date()
    this.today = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate(), 17, 0)
    this.tomorrow = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + 1, 17, 0)
    this.dayAfterTomorrow = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() + 2, 17, 0)
    this.disable = false
    let timeSlots = [
      {
        startTime: this.today,
        endTime: new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 20, 0),
        bookings: 10,
        booked: 9
      },
      {
        startTime: this.tomorrow,
        endTime: new Date(this.tomorrow.getFullYear(), this.tomorrow.getMonth(), this.tomorrow.getDate(), 20, 0),
        bookings: 10,
        booked: 5
      },
      {
        startTime: this.dayAfterTomorrow,
        endTime: new Date(this.dayAfterTomorrow.getFullYear(), this.dayAfterTomorrow.getMonth(), this.dayAfterTomorrow.getDate(), 20, 0),
        taken: 0,
        bookings: 10,
        booked: 10
      }
    ]

    this.service = {
      subscription: true,
      images: [
        'assets/images/deal.svg'
      ],
      category: 'Car',
      subCategory: 'Detailing',
      reviews: 10,
      rating: 3.55,
      title: 'Premium detailing',
      description: 'Premium auto detailing typically has at least three main phases, with multiple steps to each phase. The first phase is decontamination. This is where the car gets washed. We began by spraying the Viper with foam, which loosens the bond between surface contaminants and paint, allowing dirt and grime to be removed without damaging the car’s clear coat. The entire vehicle is then hand-washed. We spent some quality time cleaning out the nooks and crannies of the Viper’s V10 engine. After all suds are rinsed off the vehicle, every surface is hand-dried to prevent water-spotting.',
      price: 99.00,
      interval: 'week',
      timeSlots: timeSlots,
      specialties: [],
      includes: ["Item A", "Item B"],
      excludes: ["Item Z", "Item X", 'Item Y'],
      discount: {},
      form: [],
      statesAndCities: [],
      jobs: 349,
      repeat: 23,
      timeZone: false
    }

    this.business = {
      name: 'Lefty\'s Detail Shop',
      icon: 'https://redbudway.com/assets/images/icon.svg',
      timeZone: ''
    }

    this.discount = {}

    this.selectedTimeSlots = []
    this.timeSlotError = false
    this.readOnly = false
    this.rating = 3.55
    this.disableBooking = false

    this.introJS = introJs()
    this.introJS.setOptions({
      steps: [
        {
          title: '<img width="25" src="assets/images/icon.png">',
          intro: 'Here we can view a service details and make an informed decision whether to book the service.'
        },
        {
          title: '<img width="25" src="assets/images/icon.png">',
          element: '#rating',
          intro: 'Booking a service allows you to give a rating, but only after.',
          position: 'top'
        },
        {
          title: '<img width="25" src="assets/images/icon.png">',
          element: '#timeSlots',
          intro: 'Select a time slot from the service schedule that best suits you.',
          position: 'top'
        }
      ],
      showProgress: true
    })
    this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  ngOnInit(): void {
    this.introJS.start()
  }

  ngOnDestroy(): void {
    this.introJS.exit()
  }

  ngAfterViewInit(): void {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  getDayOfWeek(day: number) {
    let weekDay: string = ""
    if (day === 0) {
      weekDay = "Sunday"
    } else if (day === 1) {
      weekDay = "Monday"
    } else if (day === 2) {
      weekDay = "Tuesday"
    } else if (day === 3) {
      weekDay = "Wednessday"
    } else if (day === 4) {
      weekDay = "Thursday"
    } else if (day === 5) {
      weekDay = "Friday"
    } else if (day === 6) {
      weekDay = "Saturday"
    }
    return weekDay.toString()
  }

  share() {
  }

  viewProfile() {
  }

  applyPromo() {
  }

  viewMore(el: any, item: any) {

  }

  addTimeslot($event: any) {
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
    this.total = this.service.price * this.quantity
  }

  resetErr(i: number, j: number) {
    this.service.form[i][j].error = ''
  }

  getTimezoneShort(endTime: Date) {
    let timeZone = this.service.timeZone ? this.business.timeZone : this.timeZone
    return formatInTimeZone(endTime, timeZone, 'zzz')
  }

  rate() {
    const modalRef = this.modalService.open(ReviewComponent, { centered: true });
    modalRef.componentInstance.rating = this.rating
    modalRef.result.then(() => {
      this.service.reviews += 1
      this.readOnly = true
    }, () => {
      this.rating = this.service.rating
    })
  }

  close() {
    this.router.navigateByUrl("/")
  }

  bookService() {
    this.close()
  }

  searchCategory() {
    this.router.navigate(['/'], { queryParams: { category: this.service.category } })
  }

  searchSubCategory() {
    this.router.navigate(['/'], { queryParams: { category: this.service.category, subcategory: this.service.subCategory } })
  }
}
