import { AfterViewInit, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarView, CalendarEventAction, CalendarMonthViewBeforeRenderEvent, CalendarMonthViewDay, CalendarModule, DateAdapter, CalendarUtils, CalendarA11y, CalendarDateFormatter, CalendarEventTitleFormatter } from 'angular-calendar';
import { RRule, ByWeekday } from 'rrule';
import { Subject } from 'rxjs';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

interface TimeSlot {
  id: number,
  startTime: Date,
  endTime: Date,
  booked: number,
  bookings: number,
  tempTaken: boolean,
  quantity: number
}

@Component({
  selector: 'app-booking',
  imports: [
    CalendarModule,
    IconsModule,
    CommonModule,
  ],
  providers: [
    { provide: DateAdapter, useFactory: adapterFactory },
    CalendarUtils,
    CalendarA11y,
    CalendarDateFormatter,
    CalendarEventTitleFormatter
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements AfterViewInit {
  private modalService = inject(NgbModal)
  
  @Input() subscription: boolean
  @Input() interval: string
  @Input() timeSlots: TimeSlot[]
  @Input() timeZone: string
  @Output() selectedTimeSlot: EventEmitter<any>

  calendarEvents: CalendarEvent[]
  viewDate: Date
  view: CalendarView
  CalendarView = CalendarView
  selectedDayViewDate: Date
  endTime: Date
  refresh: Subject<any>
  color: any
  actions: CalendarEventAction[]
  todaysDate: Date
  timeSlotId: number
  loading: boolean

  constructor() {
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
    this.selectedTimeSlot = new EventEmitter()
    this.subscription = false
    this.interval = ""
    this.color = { primary: '#4685c1', secondary: '#4685c1' }
    this.timeSlotId = 0
    this.loading = false
  }

  ngOnInit(): void {
    this.changeView()
    for (let timeSlot of this.timeSlots) {
      //   timeSlot.startTime = new Date(timeSlot.startTime)
      //   timeSlot.endTime = new Date(timeSlot.endTime)
      //   timeSlot.tempTaken = false
      this.selectedDayViewDate = timeSlot.startTime
      this.endTime = timeSlot.endTime
      this.timeSlotId = timeSlot.id
      if (timeSlot.booked != timeSlot.bookings) {
        if (timeSlot.tempTaken) {
          this.color = { primary: '#dc3545', secondary: '#dc3545' }
          this.actions = this.getRemoveAction()
        } else {
          this.color = { primary: '#4685c1', secondary: '#4685c1' }
          this.actions = this.getReservationAction()
        }
      } else {
        this.color = { primary: '#6c757d', secondary: '#6c757d' }
        this.actions = []
      }
      this.createEvent(timeSlot.bookings, timeSlot.booked)
    }

    this.selectedDayViewDate = this.todaysDate
  }

  ngAfterViewInit() {
    this.scrollToCurrentView();
  }

  private scrollToCurrentView() {
    if (this.view === CalendarView.Week || CalendarView.Day) {
      // each hour is 60px high, so to get the pixels to scroll it's just the amount of minutes since midnight
      // const minutesSinceStartOfDay = differenceInMinutes(
      //   startOfHour(new Date()),
      //   startOfDay(new Date())
      // );
      // const headerHeight = this.view === CalendarView.Week ? 60 : 0;
      // this.scrollContainer.nativeElement.scrollTop =
      //   minutesSinceStartOfDay + headerHeight;
    }
  }

  beforeViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach((day) => {
      if (day.isPast || day.events.length === 0) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  beforeMonthViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach((day) => {
      if (day.date.getMonth() === this.todaysDate.getMonth()) {
        if (day.date.getDate() >= 29 || day.events.length === 0) {
          day.cssClass = 'cal-disabled';
        }
      } else {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  beforeYearViewRender(renderEvent: CalendarMonthViewBeforeRenderEvent): void {
    renderEvent.body.forEach((day) => {
      if (day.date.getDate() >= 29 || day.events.length === 0) {
        day.cssClass = 'cal-disabled';
      }
    });
  }

  dayClicked(day: CalendarMonthViewDay) {
    this.viewDate = day.date
    this.view = CalendarView.Day
  }

  nextMonth() {
    // this.slideWindow()
  }

  refreshView() {
    this.refresh.next(true)
  }

  closeDayView() {
    this.changeView()
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

  closeModal() {
    if (this.view === CalendarView.Day) {
      this.changeView()
    }
  }

  createEvent(bookings: number, booked:number) {
    if (this.subscription) {
      let rule: RRule = new RRule()
      if (this.interval === CalendarView.Week) {
        let day = this.selectedDayViewDate.getDay()
        let weekDay: ByWeekday = -1
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
        start.setDate(start.getDate() - (1+start.getDay()))
        start.setHours(23)
        start.setMinutes(59)
        let end = new Date()
        end.setDate(end.getDate() + (7-end.getDay()))
        end.setHours(0)
        end.setMinutes(0)
        rule = new RRule({
          freq: RRule.WEEKLY,
          byweekday: weekDay,
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
        start.setFullYear(start.getFullYear()-1)
        let end = new Date()
        end.setMonth(0)
        end.setDate(1)
        end.setFullYear(end.getFullYear()+1)
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
            timeSlotId: this.timeSlotId,
            bookings: bookings,
            booked: booked,
            quantity: 1
          }
        })
      })
    } else {
      this.calendarEvents.push({
        title: '',
        start: this.selectedDayViewDate,
        end: new Date(this.selectedDayViewDate.getFullYear(), this.selectedDayViewDate.getMonth(), this.selectedDayViewDate.getDate(), this.endTime.getHours(), this.endTime.getMinutes()),
        color: this.color,
        actions: this.actions,
        meta: {
          timeSlotId: this.timeSlotId,
          bookings: bookings,
          booked: booked,
          quantity: 1
        }
      })
    }
  }

  setTimeSlotTaken(event:CalendarEvent, taken:boolean) {
    for (let i = 0; i < this.timeSlots.length; i++) {
      let timeSlot = this.timeSlots[i]
      if (this.interval === CalendarView.Week && (timeSlot.startTime.getDay() === event.start.getDay())) {
        if (timeSlot.startTime.getHours() === event.start.getHours()) {
          timeSlot.tempTaken = taken
        }
      } else if ((this.interval === CalendarView.Month || this.interval === '' || this.interval === 'year') && (timeSlot.startTime.getDate() === event.start.getDate())) {
        if (timeSlot.startTime.getHours() === event.start.getHours()) {
          timeSlot.tempTaken = taken
        }
      }
      this.timeSlots[i] = timeSlot
    }
    this.selectedTimeSlot.emit(event)
  }

  confirmReservation(event: CalendarEvent) {
    const modalRef = this.modalService.open(ConfirmComponent, { centered: true });
    modalRef.componentInstance.subscription = this.subscription
    modalRef.componentInstance.interval = this.interval
    modalRef.componentInstance.startTime = event.start
    modalRef.componentInstance.endTime = event.end
    modalRef.componentInstance.bookings = event.meta.bookings
    modalRef.componentInstance.booked = event.meta.booked
    modalRef.componentInstance.isCustomer = true
    modalRef.componentInstance.timeZone = this.timeZone
    modalRef.result.then((result: any) => {
      event.color = { primary: '#dc3545', secondary: '#dc3545' }
      event.meta.quantity = result.quantity
      event.actions = this.getRemoveAction()
      this.setTimeSlotTaken(event, true)
    }, () => {});
  }

  getRemoveAction(): CalendarEventAction[] {
    return [{
      label: '<a class="custom-close">',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        event.color = { primary: '#4685c1', secondary: '#4685c1' }
        event.meta.quantity = 1
        event.actions = this.getReservationAction()
        this.setTimeSlotTaken(event, false)
      }
    }]
  }

  getReservationAction(): CalendarEventAction[] {
    return [{
      label: '<div class="w-100 h-100 position-absolute"></div>',
      a11yLabel: 'Reserve',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.selectedDayViewDate = event.start
        this.confirmReservation(event)
      }
    }]
  }

  
  removeTimeSlot(eventToDelete: CalendarEvent) {
    this.calendarEvents.forEach((event)  => {
      if (event === eventToDelete) {
        event.color = { primary: '#4685c1', secondary: '#4685c1' }
        event.meta.quantity = 1
        event.actions = this.getReservationAction()
        this.setTimeSlotTaken(event, false)
      }
    });
  }
}
