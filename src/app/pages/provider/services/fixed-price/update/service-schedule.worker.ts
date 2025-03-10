/// <reference lib="webworker" />

import { RRule, ByWeekday } from "rrule"

let oneYear = 1
let subscription = false
let interval = ''
let selectedDayViewDate = new Date()
let endTime = new Date()
let color = { primary: '#6c757d', secondary: '#6c757d' }
let calendarEvents: any[] = []
let gCalendarEvents: any[] = []
let timeSlots: any[] = []
let otherServices: any[] = []

function createEvent(booked: number, bookings: number, other:boolean) {
  if (subscription) {
    let rule: RRule = new RRule()
    if (interval === "week") {
      let day = selectedDayViewDate.getDay()
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
    } else if (interval === "month") {
      let start = new Date()
      start.setDate(-1)
      let end = new Date()
      end.setMonth(end.getMonth()+1)
      end.setDate(29)
      rule = new RRule({
        freq: RRule.MONTHLY,
        bymonthday: selectedDayViewDate.getUTCDate(),
        byhour: selectedDayViewDate.getUTCHours(),
        byminute: selectedDayViewDate.getUTCMinutes(),
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
        bymonth: selectedDayViewDate.getMonth() + 1,
        bymonthday: selectedDayViewDate.getUTCDate(),
        byhour: selectedDayViewDate.getUTCHours(),
        byminute: selectedDayViewDate.getUTCMinutes(),
        dtstart: start,
        until: end
      })
    }
    rule.all().forEach((date: Date) => {
      let startTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), selectedDayViewDate.getHours(), selectedDayViewDate.getMinutes())
      endTime = new Date(startTime.getFullYear(), startTime.getMonth(), startTime.getDate(), endTime.getHours(), endTime.getMinutes())
      
      calendarEvents.push({
        title: '',
        start: startTime,
        end: endTime,
        color: color,
        actions: [],
        meta: {
          booked,
          bookings,
          other
        }
      })
    })
  } else {
    calendarEvents.push({
      title: '',
      start: selectedDayViewDate,
      end: new Date(selectedDayViewDate.getFullYear(), selectedDayViewDate.getMonth(), selectedDayViewDate.getDate(), endTime.getHours(), endTime.getMinutes()),
      color: color,
      actions: [],
      meta: {
        booked,
        bookings,
        other
      }
    })
  }
}

function parseData(data: any) {
  // for (let otherService of data.otherServices) {
  //   subscription = otherService.subscription
  //   interval = otherService.interval
  //   for (let timeSlot of otherService.timeSlots) {
  //     timeSlot.startTime  = new Date(timeSlot.startTime)
  //     timeSlot.endTime  = new Date(timeSlot.endTime)
  //     selectedDayViewDate = timeSlot.startTime
  //     endTime = timeSlot.endTime
  //     createEvent(0, 0, true)
  //   }
  // }
  // otherServices = data.otherServices

  for (let googleTimeSlot of data.googleTimeSlots) {
    gCalendarEvents.push({
      title: googleTimeSlot.title,
      start: new Date(googleTimeSlot.startTime),
      end: new Date(googleTimeSlot.endTime),
      color: color,
      actions: [],
      cssClass: 'text-white'
    })
  }

  subscription = data.subscription
  interval = data.interval
  for (let timeSlot of data.timeSlots) {
    if(typeof timeSlot.startTime === "string") {
      timeSlot.startTime = new Date(timeSlot.startTime)
      timeSlot.endTime = new Date(timeSlot.endTime)
    }
    selectedDayViewDate = timeSlot.startTime
    endTime = timeSlot.endTime
    if (timeSlot.bookings === timeSlot.booked) {
      color = { primary: '#dc3545', secondary: '#dc3545' }
    } else {
      color = { primary: '#4682b4', secondary: '#4682b4' }
    }
    createEvent(timeSlot.booked, timeSlot.bookings, false)
  }
  timeSlots = data.timeSlots
}

addEventListener('message', ({ data }) => {
  parseData(data)
  postMessage({ 
    calendarEvents,
    gCalendarEvents,
    timeSlots,
    otherServices,
  });
});