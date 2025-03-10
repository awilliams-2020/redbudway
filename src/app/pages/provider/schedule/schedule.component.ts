import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../services/http.service';
import { StorageService } from '../../../services/storage.service';
import { Subject } from 'rxjs';
import { ByWeekday, RRule } from 'rrule'
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarA11y, CalendarDateFormatter, CalendarEvent, CalendarEventAction, CalendarEventTitleFormatter, CalendarModule, CalendarMonthViewBeforeRenderEvent, CalendarMonthViewDay, CalendarUtils, CalendarView, DateAdapter } from 'angular-calendar'
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../../icons/icons.module';
import { AppointmentsComponent } from '../../../modals/appointments/appointments.component';

interface TimeSlot {
  startTime: Date,
  endTime: Date,
  taken: any,
  takenBy: any
}

@Component({
  selector: 'app-schedule',
  imports: [CommonModule, CalendarModule, IconsModule],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory },
    CalendarUtils,
    CalendarA11y,
    CalendarDateFormatter,
    CalendarEventTitleFormatter
  ],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {
  private storageService = inject(StorageService)
  private httpService = inject(HttpService)
  private modalService = inject(NgbModal)

  subscription: number
  interval: string
  timeSlots: TimeSlot[]
  calendarEvents: CalendarEvent[]
  viewDate: Date
  view: CalendarView
  CalendarView = CalendarView
  selectedDayViewDate: Date
  endTime: Date
  refresh: Subject<any>
  actions: CalendarEventAction[]
  todaysDate: Date
  title: string
  providerId: string
  loading: boolean
  start: Date
  end: Date
  windowMap: any

  constructor() {
    this.calendarEvents = []
    this.actions = []
    this.todaysDate = new Date()
    this.viewDate = this.todaysDate
    this.view = CalendarView.Month
    this.selectedDayViewDate = this.todaysDate
    this.endTime = this.todaysDate
    this.start = this.todaysDate
    this.end = this.todaysDate
    this.timeSlots = []
    this.refresh = new Subject();
    this.subscription = 0
    this.interval = ""
    this.title = ''
    this.providerId = this.storageService.getProviderID()
    this.loading = true
    this.windowMap = {}
  }

  ngOnInit(): void {
    this.slideWindow()
  }

  dayClicked(day: CalendarMonthViewDay) {
    this.viewDate = day.date
    this.view = CalendarView.Day
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach((day) => {
      if (day.isPast) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  nextMonth() {
    this.slideWindow()
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    const modalRef = this.modalService.open(AppointmentsComponent, { centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.providerId = this.providerId
    modalRef.componentInstance.subscription = event.meta.subscription
    modalRef.componentInstance.interval = event.meta.interval
    modalRef.componentInstance.title = event.meta.title
    modalRef.componentInstance.startTime = event.meta.startTime
    modalRef.componentInstance.endTime = event.meta.endTime
    modalRef.componentInstance.price = event.meta.price
    modalRef.componentInstance.customers = event.meta.customers
    modalRef.result.then((reload: boolean) => {
      if (reload) {
        this.view = CalendarView.Month
        this.calendarEvents.filter(_event => _event !== event)
      }
    }, (reload: boolean) => {
      if (reload) {
        this.view = CalendarView.Month
        this.calendarEvents.filter(_event => _event !== event)
      }
    })
  }

  refreshView() {
    this.refresh.next(true)
  }

  closeDayView() {
    this.view = CalendarView.Month
    this.slideWindow()
  }

  slideWindow() {
    this.start = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), 1)
    this.end = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 0)
    this.end.setDate(this.end.getDate() + 1)
    if (!this.windowMap.hasOwnProperty(this.start.getTime() + "-" + this.end.getTime())) {
      this.windowMap[this.start.getTime() + "-" + this.end.getTime()] = true
      this.loading = true
      this.getSchedule()
    }
  }

  getSchedule() {
    this.httpService.getProviderSchedule(this.providerId, this.start.toLocaleString(), this.end.toLocaleString())
      .subscribe((schedule: any) => {
        for (let service of schedule.services) {
          this.interval = service.interval
          this.subscription = service.subscription
          for (let timeSlot of service.timeSlots) {
            this.selectedDayViewDate = new Date(timeSlot.startTime)
            this.endTime = new Date(timeSlot.endTime)
            this.title = '<span class="text-light">' + service.title + '</span>'
            this.createEvent(service.title, service.price, timeSlot.customers)
          }
        }
        this.loading = false
        this.selectedDayViewDate = this.todaysDate
        this.endTime = this.todaysDate
      })
  }

  createEvent(title: string, price: number, customers: any[]) {
    if (this.subscription) {
      let rule: RRule = new RRule()
      let start = new Date(this.todaysDate.getFullYear(), this.todaysDate.getMonth(), this.todaysDate.getDate(), this.selectedDayViewDate.getHours(), this.selectedDayViewDate.getMinutes())
      let end = new Date()
      end.setDate(-1)
      end.setFullYear(end.getFullYear() + 1)
      end.setHours(this.endTime.getHours())
      end.setMinutes(this.endTime.getMinutes())
      if (this.interval === CalendarView.Week) {
        let day = this.selectedDayViewDate.getUTCDay()
        let weekDay: ByWeekday = -1
        if (day === 0) {
          weekDay = RRule.SU
        } else if (day === 1) {
          weekDay = RRule.MO
        } else if (day === 2) {
          weekDay = RRule.TU
        } else if (day === 3) {
          weekDay = RRule.WE
        } else if (day === 4) {
          weekDay = RRule.TH
        } else if (day === 5) {
          weekDay = RRule.FR
        } else if (day === 6) {
          weekDay = RRule.SA
        }
        rule = new RRule({
          freq: RRule.WEEKLY,
          byweekday: weekDay,
          dtstart: start,
          until: end
        })
      } else if (this.interval === CalendarView.Month) {
        rule = new RRule({
          freq: RRule.MONTHLY,
          bymonthday: this.selectedDayViewDate.getDate(),
          dtstart: start,
          until: end
        })
      } else {
        rule = new RRule({
          freq: RRule.YEARLY,
          bymonth: this.selectedDayViewDate.getMonth() + 1,
          bymonthday: this.selectedDayViewDate.getDate(),
          dtstart: start,
          until: end
        })
      }
      rule.all().forEach((date: Date) => {
        let startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), this.selectedDayViewDate.getHours(), this.selectedDayViewDate.getMinutes())
        let endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), this.endTime.getHours(), this.endTime.getMinutes())
        if (startTime.getTime() >= endTime.getTime()) {
          endTime.setDate(endTime.getDate() + 1)
        }
        this.calendarEvents.push({
          title: this.title,
          start: startTime,
          end: new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), this.endTime.getHours(), this.endTime.getMinutes()),
          color: { primary: '#4682b4', secondary: '#4682b4' },
          actions: this.actions,
          meta: {
            title,
            subscription: this.subscription,
            interval: this.interval,
            price,
            startTime,
            endTime: this.endTime,
            customers
          }
        })
      })

    } else {
      this.calendarEvents.push({
        title: this.title,
        start: this.selectedDayViewDate,
        end: new Date(this.selectedDayViewDate.getFullYear(), this.selectedDayViewDate.getMonth(), this.selectedDayViewDate.getDate(), this.endTime.getHours(), this.endTime.getMinutes()),
        color: { primary: '#4682b4', secondary: '#4682b4' },
        actions: this.actions,
        meta: {
          title,
          subscription: this.subscription,
          interval: this.interval,
          price,
          startTime: this.selectedDayViewDate,
          endTime: this.endTime,
          customers
        }
      })
    }
    this.refreshView()
  }
}
