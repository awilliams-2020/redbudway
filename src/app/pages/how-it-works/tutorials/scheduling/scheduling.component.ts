import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ServiceComponent } from '../service/service.component';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.css']
})
export class SchedulingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('service') service: ServiceComponent
  timeSlots: any[]
  subscription: string
  interval: string
  today:Date
  tomorrow:Date
  dayAfterTomorrow:Date

  constructor() {
    this.service = {} as ServiceComponent
    this.subscription = "true"
    this.interval = "week"

    this.today = new Date()
    this.today.setHours(17)
    this.today.setMinutes(0)
    this.tomorrow = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+1, 17, 0)
    this.dayAfterTomorrow = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()+2, 17, 0)
    if(this.getDayOfWeek(this.today.getDay()) === "Friday") {
      this.dayAfterTomorrow = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()-5, 17, 0)
    } else if (this.getDayOfWeek(this.today.getDay()) === "Saturday") {
      this.tomorrow = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()-6, 17, 0)
      this.dayAfterTomorrow = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()-5, 17, 0)
    }
    this.timeSlots = [
      {
        startTime: this.today,
        endTime: new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate(), 20, 0),
        booked: 0,
        bookings: 15,
        customers:[]
      },
      {
        startTime: this.tomorrow,
        endTime: new Date(this.tomorrow.getFullYear(), this.tomorrow.getMonth(), this.tomorrow.getDate(), 20, 0),
        booked: 4,
        bookings: 5,
        customers:[{"invoiceId":"in_a1b2c3d4e5f6"},{"invoiceId":"in_g7h8i9j10k11"},{"invoiceId":"in_l12m13n14o15p16"},{"invoiceId":"in_q17r18s19t20u21v22"}]
      },
      {
        startTime: this.dayAfterTomorrow,
        endTime: new Date(this.dayAfterTomorrow.getFullYear(), this.dayAfterTomorrow.getMonth(), this.dayAfterTomorrow.getDate(), 20, 0),
        booked: 3,
        bookings: 10,
        customers:[{"subscriptionId":"sub_a1b2c3d4e5f6", "cuStripeId":"acct_23rfsaf23fs"},{"subscriptionId":"sub_g7h8i9j10k11","cuStripeId":"acct_23rfsaf23fs"},{"subscriptionId":"sub_q17r18s19t20u21v22","cuStripeId":"acct_23rfsaf23fs"}]
      }
    ]
  }

  ngOnInit(): void {}

  ngOnDestroy():void {}

  ngAfterViewInit(): void {
    window.scrollTo({
      top:0,
      left:0,
      behavior:'smooth'
    })
    this.service.openScheduleModal()
  }

  getDayOfWeek(day:number) {
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
    return weekDay
  }

}
