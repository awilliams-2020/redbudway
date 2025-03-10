import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../services/http.service';
import { LocationService } from '../../services/location.service';
import { FormsModule } from '@angular/forms';
import { IconsModule } from '../../icons/icons.module';

@Component({
  selector: 'app-location',
  imports: [CommonModule, FormsModule, IconsModule],
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {
  public activeModal = inject(NgbActiveModal)
  private locationService = inject(LocationService)
  private httpService = inject(HttpService)
  private platformLocation = inject(PlatformLocation)
  // private matomoTracker: MatomoTracker

  location: EventEmitter<any>
  input: string
  aLoading: boolean
  gLoading: boolean
  errorMsg: string
  addressMsg: string

  constructor() {
    this.platformLocation.onPopState(() => this.activeModal.close());
    this.location = new EventEmitter()
    this.input = ''
    this.aLoading = false
    this.gLoading = false
    this.errorMsg = ''
    this.addressMsg = ''
  }

  ngOnInit(): void {
    const location = this.locationService.getLocation()
    if (location.city !== '' && location.state !== '') {
      this.input = location.city+","+location.state
    } else if (location.state !== '') {
      this.input = location.state
    }
  }

  getCurrentLocation() {
    // this.matomoTracker.trackEvent("location", "clicked", "browser")
    this.errorMsg = ''
    this.addressMsg = ''
    this.gLoading = true
    this.locationService.requestLocation().subscribe((resp:any) => {
      if (resp.error === '') {
        this.location.emit({
          state:resp.location.state,
          city:resp.location.city,
          timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone})
        this.locationService.setLocation(
          resp.location.state,
          resp.location.city,
          Intl.DateTimeFormat().resolvedOptions().timeZone)

        this.activeModal.close()
      } else {
        this.gLoading = false
        this.errorMsg = resp.error
      }
    })
  }

  getLocation() {
    this.errorMsg = ''
    this.addressMsg = ''
    this.aLoading = true
    // this.matomoTracker.trackEvent("location", "clicked", "arcgis")
    this.httpService.getAddress(this.input)
      .subscribe((location:any)=>{
        if(location.city !== '' || location.state !== ''){
          this.location.emit({state:location.state, city:location.city, timeZone:location.timeZone})
          this.locationService.setLocation(location.state, location.city, location.timeZone)
          this.activeModal.close()
        } else {
          this.aLoading = false
          this.addressMsg = 'Failed to find '+this.input
        }
      })
  }

  close() {
    // this.matomoTracker.trackEvent("location", "close")
    this.activeModal.dismiss('Cross click')
  }

}
