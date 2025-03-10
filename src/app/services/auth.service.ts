import { inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpService = inject(HttpService)
  private storageService = inject(StorageService)

  constructor() { }

  async isCustomerSessionValid(): Promise<boolean> {
    let customerId = this.storageService.getCustomerID()
    let resp = await this.httpService.validateCustomerAccessToken(customerId)
    return resp.valid
  }

  async isProviderSessionValid(providerID: string): Promise<boolean> {
    let resp = await this.httpService.validateProviderAccessToken(providerID)
    return resp.valid
  }

  async isAdminSessionValid(): Promise<boolean> {
    let adminId = this.storageService.getAdminID()
    let resp = await this.httpService.validateAdminAccessToken(adminId)
    return resp.valid
  }

  async isOnboarded(): Promise<boolean> {
    let providerID = this.storageService.getProviderID()
    let resp = await this.httpService.getStripeAccountStatus(providerID)
    return resp.enabled && resp.submitted
  }

}
