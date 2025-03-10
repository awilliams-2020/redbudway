import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { EventEmitter, inject, Injectable } from '@angular/core'
import { TokenService } from './token.service'
import { DataService } from './data.service'
import { environment } from '../../environments/environment'
import { StorageService } from './storage.service'
declare var google: any

@Injectable({
  providedIn: 'root'
})
export class GoogleService {
  private httpClient = inject(HttpClient)
  private tokenService = inject(TokenService)
  private storageService = inject(StorageService)

  codeClient: any
  intervalID: any
  URL: string
  sync: EventEmitter<any>

  constructor() {
    this.URL = environment.protocol + '://' + environment.host
    this.sync = new EventEmitter()
    
    // let script = document.createElement('script')
    // script.setAttribute("defer", "");
    // script.setAttribute('src', 'https://accounts.google.com/gsi/client')
    // document.body.appendChild(script) 
    // script.onload = () => {
    //     this.initializeCodeClient()
    // }
  }

  setAccessToken(accessToken: string) {
    sessionStorage.setItem("GOOGLE_TOKEN", accessToken)
    this.expInterval()
  }

  getAccessToken() {
    return sessionStorage.getItem('GOOGLE_TOKEN') || ''
  }

  setTimeStamp(expiresIn: number) {
    sessionStorage.setItem("EXPIRES_IN", (Date.now() + (expiresIn * 1000)).toString())
  }

  getTimeStamp() {
    return sessionStorage.getItem("EXPIRES_IN") || ""
  }

  setEmail(email:string) {
    sessionStorage.setItem("GOOGLE_EMAIL", email)
  }

  getEmail() {
    return sessionStorage.getItem("GOOGLE_EMAIL")
  }

  setPicture(picture:string) {
    sessionStorage.setItem("GOOGLE_PICTURE", picture)
  }

  getPicture() {
    return sessionStorage.getItem("GOOGLE_PICTURE")
  }

  initializeCodeClient() {
    this.codeClient = google.accounts.oauth2.initCodeClient({
      client_id: environment.gClientId,
      scope: 'https://www.googleapis.com/auth/calendar.events.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid',
      ux_mode: 'popup',
      callback: this.getToken.bind(this)
    });
  }

  stopCountdown() {
    clearInterval(this.intervalID)
  }

  rotateGoogleToken() {
    let providerID = this.storageService.getProviderID()
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.googleToken
    URL = URL.replace('{providerID}', providerID)
    this.httpClient.put(URL, { accessToken: this.getAccessToken() }, { headers, responseType: 'json' })
      .subscribe((resp: any) => {
        if(resp.hasOwnProperty("accessToken") && resp.hasOwnProperty("email")) {
          this.setTimeStamp(resp.expiresIn)
          this.setAccessToken(resp.accessToken)
          this.setEmail(resp.email)
          this.setPicture(resp.picture)
        } else {
          sessionStorage.removeItem("GOOGLE_TOKEN")
          sessionStorage.removeItem("EXPIRES_IN")
          sessionStorage.removeItem("GOOGLE_EMAIL")
          sessionStorage.removeItem("GOOGLE_PICTURE")
        }
      })
  }

  expInterval() {
    this.stopCountdown()
    let timeStampStr = this.getTimeStamp()
    if (timeStampStr !== '') {
      const countDownDate = parseInt(timeStampStr)
      this.intervalID = setInterval(() => {
        let now = new Date().getTime()
        let distance = countDownDate - now
        if (distance <= 0) {
          this.stopCountdown()
          sessionStorage.removeItem("EXPIRES_IN")
          this.rotateGoogleToken()
        }
      })
    }
  }

  getToken(resp: any) {
    if (resp.error !== undefined) {
      console.log(resp.error)
      return
    }
    let providerID = this.storageService.getProviderID()
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.googleToken
    URL = URL.replace('{providerID}', providerID)
    this.httpClient.post(URL, { code: resp.code }, { headers, responseType: 'json' })
      .subscribe((resp: any) => {
        if(resp.hasOwnProperty("accessToken") && resp.hasOwnProperty("email")) {
          this.setTimeStamp(resp.expiresIn)
          this.setAccessToken(resp.accessToken)
          this.setEmail(resp.email)
          this.setPicture(resp.picture)
          this.sync.emit({email:resp.email, picture:resp.picture})
        }
      })
  }

  login() {
    this.codeClient.requestCode()
  }

  logOut() {
    let providerID = this.storageService.getProviderID()
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('accessToken', this.getAccessToken())
    let URL = this.URL + environment.tradesperson.googleToken
    URL = URL.replace('{providerID}', providerID)
    this.httpClient.delete(URL, { params, headers, responseType: 'json' })
      .subscribe((resp: any) => {
        sessionStorage.removeItem("GOOGLE_TOKEN")
        sessionStorage.removeItem("EXPIRES_IN")
        sessionStorage.removeItem("GOOGLE_EMAIL")
        sessionStorage.removeItem("GOOGLE_PICTURE")
        this.sync.emit({unsync:true})
      })
  }
}
