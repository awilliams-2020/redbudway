import { afterNextRender, inject, Injectable, InjectionToken } from '@angular/core';

export const SESSION_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => sessionStorage,
});

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage = inject(SESSION_STORAGE)

  setProviderID(providerID:string) {
    this.storage.setItem("PROVIDER_ID", providerID)
  }

  getProviderID() {
    return this.storage.getItem("PROVIDER_ID") || ""
  }

  removeProviderID() {
    this.storage.removeItem("PROVIDER_ID")
  }

  isProviderLoggedIn() {
    return this.storage.getItem("PROVIDER_ID") !== null || this.storage.getItem("ADMIN_ID") !== null
  }

  setAdminID(providerID:string) {
    this.storage.setItem("ADMIN_ID", providerID)
  }

  getAdminID() {
    return this.storage.getItem("ADMIN_ID") || ""
  }

  setCustomerID(providerID:string) {
    this.storage.setItem("CUSTOMER_ID", providerID)
  }

  isCustomerLoggedIn() {
    return this.storage.getItem("CUSTOMER_ID") !== null
  }

  getCustomerID() {
    return this.storage.getItem("CUSTOMER_ID") || ""
  }

  setToken(key:string, value:string) {
    this.storage.setItem(key, value)
  }

  getToken(key:string) {
    return this.storage.getItem(key)
  }

  clear() {
    this.storage.clear()
  }
}
