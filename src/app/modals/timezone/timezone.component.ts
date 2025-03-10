import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../services/http.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timezone',
  imports: [FormsModule, CommonModule],
  templateUrl: './timezone.component.html',
  styleUrls: ['./timezone.component.css']
})
export class TimezoneComponent implements OnInit {
  private httpService = inject(HttpService)
  public activeModal = inject(NgbActiveModal)

  loading:boolean;
  @Input() timeZone:string;
  input:string
  errorMsg:string
  @Input() providerID:any

  constructor() {
    this.loading = false
    this.input = ''
    this.errorMsg = ''
    this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  ngOnInit(): void {}

  getTimeZone() {
    this.loading = true
    this.httpService.getAddress(this.input)
      .subscribe((location:any)=>{
        if(location.timeZone !== ''){
          this.saveTimeZone(location.timeZone)
        } else {
          this.loading = false
          this.errorMsg = 'Failed to find '+this.input
        }
      })
  }

  saveTimeZone(timeZone:string) {
    this.httpService.updateTimeZone(this.providerID, {timeZone})
      .subscribe((resp:any)=>{
        if(resp.updated){
          this.activeModal.close(timeZone)
        } else {
          this.loading = false
          this.errorMsg = `Failed to save time zone ${timeZone}`
        }
      })
  }

}
