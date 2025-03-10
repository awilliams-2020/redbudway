import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { formatInTimeZone } from 'date-fns-tz';
import { LocationService } from '../../services/location.service';
import { FormsModule } from '@angular/forms';
import { DayPipe } from '../../pipes/day.pipe';

@Component({
  selector: 'app-confirm',
  imports: [CommonModule, FormsModule, DayPipe],
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {
  public activeModal = inject(NgbActiveModal)
  private location = inject(PlatformLocation)
  private locationService = inject(LocationService)

  @Input() startTime: Date
  @Input() endTime: Date
  @Input() subscription: number
  @Input() interval: string
  @Input() isEditable: boolean
  @Input() bookings: number
  @Input() booked: number
  @Input() isCustomer: boolean
  @Input() timeZone: string
  _endTime: string
  error:boolean
  quantity: number
  fiveWeeks: boolean

  constructor() {
    this.location.onPopState(() => this.activeModal.close());
    let today = new Date()
    this.startTime = today
    this.endTime = today
    this.isEditable = false
    this._endTime = ''
    this.subscription = 0
    this.interval = ''
    this.bookings = 1
    this.booked = 0
    this.error = false
    this.isCustomer = false
    this.quantity = 1
    this.fiveWeeks = false
    this.timeZone = ''
  }

  ngOnInit(): void {}

  confirmSelection() {
    let endTimeStr = this.startTime.getFullYear()+"-"+this.formatMonth()+"-"+this.startTime.getDate()+" " + this._endTime+":00"
    let endTime = new Date(endTimeStr)
    if (this.startTime.getTime() >= endTime.getTime()){
      this.error = true
    } else {
      this.activeModal.close({
        endTime: endTime,
        bookings:this.bookings,
        fiveWeeks: this.fiveWeeks
      })
    }

  }

  formatMonth() {
    let month = '0'
    let _month = this.startTime.getMonth()+1
    if (_month<10) {
      month += _month
    } else {
      month = _month.toString()
    }
    return month
  }

  getTimezoneShort(endTime:Date) {
    if(this.timeZone ===''){
      return
    }
    return formatInTimeZone(endTime, this.timeZone, "zzz")
  }

  bookTimeSlot() {
    if(this.quantity <= (this.bookings-this.booked) && this.quantity > 0){
      this.activeModal.close({
        quantity: this.quantity
      })
    }
  }
}
