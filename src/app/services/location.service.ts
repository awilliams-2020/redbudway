import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private httpService = inject(HttpService)
  private storageService = inject(StorageService)
  private locationHandler = new Subject<{ location: { state: string, city: string }, error: string }>();

  constructor() { }

  setLocation(state: string, city: string, timeZone: string) {
    sessionStorage.setItem('LOCATION_STATE', state);
    sessionStorage.setItem('LOCATION_CITY', city);
    sessionStorage.setItem('TIME_ZONE', timeZone);
  }

  getLocation(): { state: string, city: string } {
    const state = sessionStorage.getItem('LOCATION_STATE') || ''
    const city = sessionStorage.getItem('LOCATION_CITY') || ''
    return {
      state,
      city
    }
  }

  getTimeZone(): string {
    return sessionStorage.getItem('TIME_ZONE') || Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  error(error: any) {
    let errorText = ""
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorText = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        errorText = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        errorText = "Location information is unavailable."
        break;
      case error.UNKNOWN_ERROR:
        errorText = "An unknown error occurred."
        break;
    }
    this.locationHandler.next({
      location: {
        state: '',
        city: ''
      },
      error: errorText
    })
  }

  success(position: any) {
    this.httpService.getLocation(position.coords.latitude, position.coords.longitude).subscribe((resp: any) => {
      this.setLocation(resp.state, resp.city, resp.timeZone)
      this.locationHandler.next({
        location: {
          state: resp.state,
          city: resp.city
        },
        error: ''
      })
    })
  }

  requestLocation(): Observable<any> {
    navigator.geolocation.getCurrentPosition(this.success.bind(this), this.error.bind(this), { timeout: 10000 })
    return this.locationHandler.asObservable()
  }

  isSet() {
    return this.getLocation().state !== ''
  }
}
