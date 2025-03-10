import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarA11y,
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTitleFormatter,
  CalendarModule,
  CalendarMonthViewBeforeRenderEvent,
  CalendarMonthViewDay,
  CalendarUtils,
  CalendarView,
  DateAdapter
} from 'angular-calendar';
import { RRule, ByWeekday } from 'rrule';
import { Subject } from 'rxjs';
import { ConfirmComponent } from '../confirm/confirm.component';
import { ConflictComponent } from '../conflict/conflict.component';
import { CommonModule, DatePipe, PlatformLocation } from '@angular/common';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { IconsModule } from '../../icons/icons.module';

interface TimeSlot {
  startTime: Date,
  endTime: Date,
  bookings: number,
  booked: number,
  customers: any[]
}

@Component({
  selector: 'app-service-schedule',
  imports: [CalendarModule, IconsModule, DatePipe, CommonModule],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory },
    CalendarUtils,
    CalendarA11y,
    CalendarDateFormatter,
    CalendarEventTitleFormatter
  ],
  templateUrl: './service-schedule.component.html',
  styleUrls: ['./service-schedule.component.css'],
})
export class ServiceScheduleComponent {
  public activeModal = inject(NgbActiveModal)
  private modalService = inject(NgbModal)
  private location = inject(PlatformLocation)

  @Input() subscription: boolean
  @Input() interval: string
  @Input() timeSlots: TimeSlot[]
  @Input() googleTimeSlots: any[]
  @Input() otherServices: any[]
  @Input() providerID: string
  @Input() _calendarEvents: CalendarEvent[]
  @Input() _gCalendarEvents: CalendarEvent[]
  @Input() timeZone: string

  calendarEvents: CalendarEvent[]
  viewDate: Date
  view: CalendarView
  CalendarView = CalendarView
  selectedDayViewDate: Date
  endTime: Date
  bookings: number
  booked: number
  refresh: Subject<any>
  color: any
  actions: CalendarEventAction[]
  todaysDate: Date
  render: boolean
  oneYear = 1
  clearingSchedule: boolean
  timeSlots$: TimeSlot[]

  constructor() {
    this.location.onPopState(() => this.activeModal.close());
    this.timeZone = ''
    this.calendarEvents = []
    this.actions = []
    this.todaysDate = new Date()
    this.viewDate = this.todaysDate
    this.view = CalendarView.Month
    this.selectedDayViewDate = this.todaysDate
    this.endTime = this.todaysDate
    this.timeSlots = []
    this.refresh = new Subject();
    this.subscription = false
    this.interval = ""
    this.color = { primary: '#4682b4', secondary: '#4682b4' }
    this.otherServices = []
    this.render = true
    this.clearingSchedule = false
    this.providerID = ''
    this.bookings = 1
    this.booked = 0
    this.googleTimeSlots = []
    this._calendarEvents = []
    this._gCalendarEvents = []
    this.timeSlots$ = []
  }

  ngOnInit(): void {
    this.changeView()
    this.timeSlots$ = this.timeSlots

    for (let calendarEvent of this._calendarEvents) {
      if (calendarEvent.meta.other) {
        calendarEvent.actions = []
      } else {
        calendarEvent.actions = this.getActions()
      }
    }
    for (let calendarEvent of this._gCalendarEvents) {
      calendarEvent.actions = this.getGoogleActions()
    }
    this.calendarEvents = [...this._calendarEvents, ...this._gCalendarEvents]

    this.color = { primary: '#4682b4', secondary: '#4682b4' }
    this.selectedDayViewDate = this.todaysDate
    this.endTime = this.todaysDate
    this.bookings = 1
    this.booked = 0
  }

  scrollIntoView() {
    if (this.view === CalendarView.Week || this.view == CalendarView.Day) {
      let element = document.getElementsByClassName('cal-current-time-marker')
      if (element.length !== 0) {
        let currentTime = element[0]
        currentTime.scrollIntoView()
      }
    } else {
      let element = document.getElementsByClassName('cal-today')
      if (element.length !== 0) {
        let currentTime = element[0]
        currentTime.scrollIntoView()
      }
    }
  }

  ngAfterViewInit() {
    // this.scrollIntoView()
  }

  beforeViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach((day) => {
      if (day.isPast) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach((day) => {
      if (day.date.getMonth() === this.todaysDate.getMonth()) {
        if (day.date.getDate() >= 29) {
          day.cssClass = 'cal-disabled';
        }
      } else {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  beforeYearViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach((day) => {
      if (day.date.getDate() >= 29 || day.date.getFullYear() > this.todaysDate.getFullYear() || day.date.getFullYear() < this.todaysDate.getFullYear()) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  dayClicked(day: CalendarMonthViewDay) {
    this.viewDate = day.date
    this.view = CalendarView.Day
  }

  segmentClicked(date: Date) {
    this.selectedDayViewDate = date;
    this.confirmEvent()
  }

  refreshView() {
    this.refresh.next(true)
  }

  changeView() {
    if (this.subscription) {
      if (this.interval === CalendarView.Week) {
        this.view = CalendarView.Week
      } else {
        this.view = CalendarView.Month
      }
    } else {
      this.view = CalendarView.Month
    }
  }

  close() {
    if (this.view === CalendarView.Day) {
      this.changeView()
    } else {
      this.activeModal.close(this.timeSlots$)
    }
  }

  createEvent(newTimeSlot: boolean) {
    if (this.subscription) {
      let rule: RRule = new RRule()
      if (this.interval === CalendarView.Week) {
        let day = this.selectedDayViewDate.getDay()
        let weekDay: ByWeekday = day
        if (day === 0) {
          weekDay = RRule.MO
        } else if (day === 1) {
          weekDay = RRule.TU
        } else if (day === 2) {
          weekDay = RRule.WE
        } else if (day === 3) {
          weekDay = RRule.TH
        } else if (day === 4) {
          weekDay = RRule.FR
        } else if (day === 5) {
          weekDay = RRule.SA
        } else if (day === 6) {
          weekDay = RRule.SU
        }
        let start = new Date()
        start.setDate(start.getDate() - (1 + start.getDay()))
        start.setHours(23)
        start.setMinutes(59)
        let end = new Date()
        end.setDate(end.getDate() + (7 - end.getDay()))
        end.setHours(0)
        end.setMinutes(0)
        rule = new RRule({
          freq: RRule.WEEKLY,
          byweekday: weekDay,
          byhour: this.selectedDayViewDate.getUTCHours(),
          byminute: this.selectedDayViewDate.getUTCMinutes(),
          dtstart: start,
          until: end
        })
      } else if (this.interval === CalendarView.Month) {
        let start = new Date()
        start.setDate(-1)
        let end = new Date()
        end.setDate(29)
        rule = new RRule({
          freq: RRule.MONTHLY,
          bymonthday: this.selectedDayViewDate.getUTCDate(),
          byhour: this.selectedDayViewDate.getUTCHours(),
          byminute: this.selectedDayViewDate.getUTCMinutes(),
          dtstart: start,
          until: end
        })
      } else {
        let start = new Date()
        start.setMonth(11)
        start.setDate(31)
        start.setFullYear(start.getFullYear() - 1)
        let end = new Date()
        end.setMonth(0)
        end.setDate(1)
        end.setFullYear(end.getFullYear() + 1)
        rule = new RRule({
          freq: RRule.YEARLY,
          bymonth: this.selectedDayViewDate.getMonth() + 1,
          bymonthday: this.selectedDayViewDate.getUTCDate(),
          byhour: this.selectedDayViewDate.getUTCHours(),
          byminute: this.selectedDayViewDate.getUTCMinutes(),
          dtstart: start,
          until: end
        })
      }
      if (newTimeSlot) {
        this.addTimeSlot()
      }
      rule.all().forEach((date: Date) => {
        let startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), this.selectedDayViewDate.getHours(), this.selectedDayViewDate.getMinutes())
        let endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), this.endTime.getHours(), this.endTime.getMinutes())
        this.calendarEvents.push({
          title: '',
          start: startTime,
          end: endTime,
          color: this.color,
          actions: this.actions,
          meta: {
            booked: this.booked,
            bookings: this.bookings
          }
        })
      })
    } else {
      if (newTimeSlot) {
        this.addTimeSlot()
      }
      this.calendarEvents.push({
        title: '',
        start: this.selectedDayViewDate,
        end: new Date(this.selectedDayViewDate.getFullYear(), this.selectedDayViewDate.getMonth(), this.selectedDayViewDate.getDate(), this.endTime.getHours(), this.endTime.getMinutes()),
        color: this.color,
        actions: this.actions,
        meta: {
          booked: this.booked,
          bookings: this.bookings
        }
      })
    }
  }

  // timeSlotOverlap(events: CalendarEvent[], startTime: Date) {
  //   let endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), this.endTime.getHours(), this.endTime.getMinutes())
  //   if (startTime.getTime() >= endTime.getTime()) {
  //     endTime.setDate(endTime.getDate() + 1)
  //   }
  //   for (let event of events) {
  //     if (startTime.getTime() < (event.end?.getTime() || 0) && startTime.getTime() > event.start.getTime() ||
  //       endTime.getTime() <= (event.end?.getTime() || 0) && endTime.getTime() > (event.start.getTime() || 0) ||
  //       startTime.getTime() < event.start.getTime() && endTime.getTime() > (event.end?.getTime() || 0)) {
  //       return { startTime: event.start, endTime: event.end }
  //     }
  //   }
  //   return null
  // }

  // timeSlotExist(): boolean {
  //   let exist = false
  //   for (let timeSlot of this.timeSlots$) {
  //     if (timeSlot.startTime.getTime() === this.selectedDayViewDate.getTime() && timeSlot.endTime === this.endTime) {
  //       exist = true
  //     }
  //   }
  //   for (let otherService of this.otherServices) {
  //     for (let timeSlot of otherService.timeSlots) {
  //       if (timeSlot.startTime.getTime() === this.selectedDayViewDate.getTime() && timeSlot.endTime === this.endTime) {
  //         exist = true
  //       }
  //     }
  //   }
  //   return exist
  // }

  addTimeSlot() {
    this.timeSlots$.push({
      startTime: this.selectedDayViewDate,
      endTime: this.endTime,
      bookings: this.bookings,
      booked: this.booked,
      customers: []
    })
  }

  confirmEvent() {
    this.render = false
    const modalRef = this.modalService.open(ConfirmComponent, { centered: true });
    modalRef.componentInstance.subscription = this.subscription
    modalRef.componentInstance.interval = this.interval
    modalRef.componentInstance.startTime = this.selectedDayViewDate
    modalRef.componentInstance.isEditable = true
    modalRef.componentInstance.timeZone = this.timeZone
    modalRef.result.then((result: any) => {
      this.render = true
      this.actions = this.getActions()
      this.endTime = result.endTime
      this.bookings = result.bookings
      this.booked = 0
      if (result.fiveWeeks) {
        this.buildFiveWeeks()
      } else {
        this.createEvent(true)
      }
      this.refreshView()
    }, () => {
      this.render = true
    });
  }

  buildFiveWeeks() {
    let rule: RRule = new RRule()
    let day = this.selectedDayViewDate.getDay()
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
      dtstart: new Date(this.selectedDayViewDate.getFullYear(), this.selectedDayViewDate.getMonth(), this.selectedDayViewDate.getDate(), this.selectedDayViewDate.getHours(), this.selectedDayViewDate.getMinutes()),
      until: new Date(this.selectedDayViewDate.getFullYear(), this.selectedDayViewDate.getMonth() + 1, this.selectedDayViewDate.getDate())
    })
    rule.all().forEach((date: Date) => {
      let startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), this.selectedDayViewDate.getHours(), this.selectedDayViewDate.getMinutes())
      let endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), this.endTime.getHours(), this.endTime.getMinutes())
      this.calendarEvents.push({
        title: '',
        start: startTime,
        end: endTime,
        color: this.color,
        actions: this.actions,
        meta: {
          booked: this.booked,
          bookings: this.bookings
        }
      })
      this.timeSlots$.push({
        startTime: startTime,
        endTime: endTime,
        bookings: this.bookings,
        booked: this.booked,
        customers: []
      })
    })
  }

  getActions(): CalendarEventAction[] {
    return [{
      label: '<a class="custom-close" style="z-index:auto;">',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.calendarEvents = this.calendarEvents.filter((iEvent) => {
          let filterEvent = false
          if (this.interval === CalendarView.Week && (event.start.getDay() === iEvent.start.getDay())) {
            filterEvent = event.start.getHours() === iEvent.start.getHours() && event.end?.getHours() === iEvent.end?.getHours()
          } else if ((this.interval === CalendarView.Month || this.interval === '' || this.interval === 'year') && (event.start.getDate() === iEvent.start.getDate())) {
            filterEvent = event.start.getHours() === iEvent.start.getHours() && event.end?.getHours() === iEvent.end?.getHours()
          }
          if (filterEvent) {
            if (event.meta.booked) {
              filterEvent = false
            }
            this.timeSlots$ = this.timeSlots$.filter((timeSlot) => {
              let filterTimeSlot = iEvent.start.getTime() === timeSlot.startTime.getTime() && iEvent.end?.getTime() === timeSlot.endTime.getTime()
              if (timeSlot.booked && filterTimeSlot) {
                if (timeSlot.booked) {
                  this.showConflict(timeSlot)
                  filterTimeSlot = false
                }
              }
              return !filterTimeSlot
            })
          }
          return !filterEvent
        })
      }
    },
    {
      label: '<div class="w-100 h-100"></div>',
      a11yLabel: 'Customers',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.render = false
        const modalRef = this.modalService.open(ConfirmComponent, { centered: true });
        modalRef.componentInstance.subscription = this.subscription
        modalRef.componentInstance.interval = this.interval
        modalRef.componentInstance.startTime = event.start
        modalRef.componentInstance.endTime = event.end
        modalRef.componentInstance.bookings = event.meta.bookings
        modalRef.componentInstance.booked = event.meta.booked
        modalRef.componentInstance.timeZone = this.timeZone
        modalRef.result.then(() => { }, () => {
          this.render = true
        });
      }
    }]
  }

  getGoogleActions() {
    return [{
      label: '<img width="24" height="24" src="assets/images/google-calendar.svg">',
      a11yLabel: 'Google',
      onClick: ({ event }: { event: CalendarEvent }): void => { }
    }]
  }

  showConflict(timeSlot: TimeSlot) {
    this.render = false
    const modalRef = this.modalService.open(ConflictComponent, { centered: true });
    modalRef.componentInstance.timeSlot = timeSlot
    modalRef.componentInstance.providerID = this.providerID
    modalRef.result.then((result: any) => {
      if (result === 'change-route') {
        this.activeModal.close()
      }
      this.render = true
    }, () => {
      this.render = true
    })
  }
}