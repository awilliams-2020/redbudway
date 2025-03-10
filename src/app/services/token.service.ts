import { HttpClient, HttpHeaders } from '@angular/common/http'
import { inject, Injectable, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { firstValueFrom } from 'rxjs'
import { environment } from '../../environments/environment'
import { StorageService } from './storage.service'

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  router = inject(Router)
  httpClient = inject(HttpClient)
  storageService = inject(StorageService)
  isProvider: boolean
  intervalID: any
  URL: string

  constructor() {
    this.isProvider = false
    this.URL = environment.protocol + '://' + environment.host
  }

  restart() {
    let customerAccessToken = this.getCustomerAccessToken()
    let providerAccessToken = this.getProviderAccessToken()
    this.stopCountdown()
    if (customerAccessToken) {
      this.expInterval(customerAccessToken)
    } else if (providerAccessToken) {
      this.expInterval(providerAccessToken)
      this.isProvider = true
    }
  }

  setCustomerAccessToken(accessToken: string) {
    this.storageService.setToken('CUSTOMER_ACCESS_TOKEN', accessToken)
    this.expInterval(accessToken)
    this.isProvider = false
  }

  setCustomerRefreshToken(refreshToken: string) {
    this.storageService.setToken('CUSTOMER_REFRESH_TOKEN', refreshToken)
  }

  getCustomerAccessToken() {
    return this.storageService.getToken('CUSTOMER_ACCESS_TOKEN')
  }

  getCustomerRefreshToken() {
    return this.storageService.getToken('CUSTOMER_REFRESH_TOKEN')
  }

  setProviderAccessToken(accessToken: string) {
    this.storageService.setToken('TRADESPERSON_ACCESS_TOKEN', accessToken)
    this.expInterval(accessToken)
    this.isProvider = true
  }

  setProviderRefreshToken(refreshToken: string) {
    this.storageService.setToken('TRADESPERSON_REFRESH_TOKEN', refreshToken)
  }

  getProviderAccessToken() {
    return this.storageService.getToken('TRADESPERSON_ACCESS_TOKEN')
  }

  getProviderRefreshToken() {
    return this.storageService.getToken('TRADESPERSON_REFRESH_TOKEN')
  }

  stopCountdown() {
    clearInterval(this.intervalID)
  }

  rotateCustomerTokens() {
    let customerId = this.storageService.getCustomerID()
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getCustomerRefreshToken())
    let URL = this.URL + environment.customer.accessToken
    URL = URL.replace('{customerId}', customerId || '')
    this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .subscribe((resp: any) => {
        if (resp.hasOwnProperty('accessToken')) {
          this.setCustomerAccessToken(resp.accessToken)
          this.setCustomerRefreshToken(resp.refreshToken)
        } else {
          this.storageService.clear()
          this.router.navigate(['/session/customer-login'])
        }
      })
  }

  rotateProviderTokens() {
    let providerID = this.storageService.getProviderID()
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.getProviderRefreshToken())
    let URL = this.URL + environment.tradesperson.accessToken
    URL = URL.replace('{providerID}', providerID)
    firstValueFrom(this.httpClient.post(URL, {}, { headers, responseType: 'json' }))
      .then((resp:any) => {
        if (resp.hasOwnProperty('accessToken')) {
          this.setProviderAccessToken(resp.accessToken)
          this.setProviderRefreshToken(resp.refreshToken)
        } else {
          this.storageService.clear()
          this.router.navigate(['/session/provider-login'])
        }
      })
      .catch((err:any) => {
        this.storageService.clear()
        this.router.navigate(['/session/provider-login'])
      })
  }

  expInterval(accessToken: string) {
    const claims = accessToken.split(".")[1]
    const decString = atob(claims)
    const obj = JSON.parse(decString)
    const countDownDate = new Date(obj.exp * 1000).getTime() - 60000
    this.intervalID = setInterval(() => {
      let now = new Date().getTime()
      let distance = countDownDate - now
      if (distance <= 0) {
        this.stopCountdown()
        if (this.isProvider) {
          this.rotateProviderTokens()
        } else {
          this.rotateCustomerTokens()
        }
      }
    })
  }

}
