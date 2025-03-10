import { inject, Injectable } from '@angular/core'
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http'
import { Observable, firstValueFrom, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { TokenService } from './token.service'
import { GoogleService } from './google.service'
import { environment } from '../../environments/environment'


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  httpClient = inject(HttpClient)
  tokenService = inject(TokenService)
  googleService = inject(GoogleService)
  URL: string

  constructor() {
    this.URL = environment.protocol + '://' + environment.host
  }

  getProviders(adminId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.admin.tradespeople
    URL = URL.replace('{adminId}', adminId)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getLocation(latitude: string, longitude: string): Observable<any> {
    let params = new HttpParams().set('longitude', longitude).set('latitude', latitude)
    let URL = environment.location
    return this.httpClient.get(URL, { params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getAddress(address: string): Observable<any> {
    let params = new HttpParams().set('address', address)
    let URL = environment.address
    return this.httpClient.get(URL, { params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getPublicProfile(providerID: string): Observable<any> {
    let URL = this.URL + environment.profile
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getPublicService(priceId: string): Observable<any> {
    let URL = this.URL + environment.fixedPrice
    URL = URL.replace('{priceId}', priceId)
    return this.httpClient.get(URL, { responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getPublicQuote(quoteId: string): Observable<any> {
    let URL = this.URL + environment.quote
    URL = URL.replace('{quoteId}', quoteId)
    return this.httpClient.get(URL, { responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getPublicServices(category: string, subCategory: string, city: string, state: string, specialties: string[], page: number, min:number, max:number, fromDate:string, toDate:string, sort:string): Observable<any> {
    let params = new HttpParams().set('page', page)
    if(category !== '') {
      params = params.append('category', category)
    }
    if(subCategory !== '') {
      params = params.append('subCategory', subCategory)
    }
    if(city !== '') {
      params = params.append('city', city)
    }
    if (state !== '') {
      params = params.append('state', state)
    }
    if(String(specialties) !== ''){
      params = params.append('specialties', String(specialties))
    }
    if(min !== 0){
      params = params.append('min', min)
    }
    if (max !== 0){
      params = params.append('max', max)
    }
    if (fromDate !== '') {
      params = params.append('fromDate', fromDate)
    }
    if (toDate !== '') {
      params = params.append('toDate', toDate)
    }
    if (sort !== '') {
      params = params.append('sort', sort)
    }
    let URL = this.URL + environment.fixedPrices
    return this.httpClient.get(URL, { params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getPublicServicePages(category: string, subCategory: string, city: string, state: string, specialties: string[], min:number, max:number, fromDate:string, toDate:string): Observable<any> {
    let params = new HttpParams()
    if(category !== '') {
      params = params.append('category', category)
    }
    if(subCategory !== '') {
      params = params.append('subCategory', subCategory)
    }
    if(city !== '') {
      params = params.append('city', city)
    }
    if (state !== '') {
      params = params.append('state', state)
    }
    if(String(specialties) !== ''){
      params = params.append('specialties', String(specialties))
    }
    if(min !== 0){
      params = params.append('min', min)
    }
    if (max !== 0){
      params = params.append('max', max)
    }
    if (fromDate !== '') {
      params = params.append('fromDate', fromDate)
    }
    if (toDate !== '') {
      params = params.append('toDate', toDate)
    }
    let URL = this.URL + environment.fixedPricePages
    return this.httpClient.get(URL, { params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getPublicQuotes(category: string, subCategory: string, city: string, state: string, specialties: string[], page: number): Observable<any> {
    let params = new HttpParams().set('page', page)
    if(category !== '') {
      params = params.append('category', category)
    }
    if(subCategory !== '') {
      params = params.append('subCategory', subCategory)
    }
    if(city !== '') {
      params = params.append('city', city)
    }
    if (state !== '') {
      params = params.append('state', state)
    }
    if(String(specialties) !== ''){
      params = params.append('specialties', String(specialties))
    }
    let URL = this.URL + environment.quotes
    return this.httpClient.get(URL, { params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getPublicQuotePages(category: string, subCategory: string, city: string, state: string, specialties: string[]): Observable<any> {
    let params = new HttpParams()
    if(category !== '') {
      params = params.append('category', category)
    }
    if(subCategory !== '') {
      params = params.append('subCategory', subCategory)
    }
    if(city !== '') {
      params = params.append('city', city)
    }
    if (state !== '') {
      params = params.append('state', state)
    }
    if(String(specialties) !== ''){
      params = params.append('specialties', String(specialties))
    }
    let URL = this.URL + environment.quotePages
    return this.httpClient.get(URL, { params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updatePrice(request: any, providerID: string, priceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.fixedPrice.update
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{priceId}', priceId)
    return this.httpClient.put(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateQuote(request: any, providerID: string, quoteId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.quote.update
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{quoteId}', quoteId)
    return this.httpClient.put(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getPrice(priceId: string, providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('accessToken', this.googleService.getAccessToken())
    let URL = this.URL + environment.tradesperson.fixedPrice.retrieve
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{priceId}', priceId)
    return this.httpClient.get(URL, { params, headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getQuote(quoteId: string, providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.quote.retrieve
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{quoteId}', quoteId)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  validateCustomerAccessToken(customerId: string): Promise<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.accessToken
    URL = URL.replace('{customerId}', customerId)
    return firstValueFrom(this.httpClient.get(URL, { headers, responseType: 'json' }))
  }

  validateProviderAccessToken(providerID: string): Promise<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.accessToken
    URL = URL.replace('{providerID}', providerID)
    return firstValueFrom(this.httpClient.get(URL, { headers, responseType: 'json' }))
  }

  validateAdminAccessToken(adminId: string): Promise<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.admin.accessToken
    URL = URL.replace('{adminId}', adminId)
    return firstValueFrom(this.httpClient.get(URL, { headers, responseType: 'json' }))
  }

  getOtherServices(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('accessToken', this.googleService.getAccessToken())
    let URL = this.URL + environment.tradesperson.timeSlots
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { params, headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  createPrice(request: any, providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.fixedPrice.create
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  createQuote(providerID: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.quote.create
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderPrices(providerID: string, page: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('page', page)
    let URL = this.URL + environment.tradesperson.fixedPrices
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderPricePages(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.fixedPricePages
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getQuotes(providerID: string, page: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('page', page)
    let URL = this.URL + environment.tradesperson.quotes
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getQuotePages(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.quotePages
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  resetPassword(token: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    let URL = this.URL + environment.resetPassword
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  forgotPassword(email: string, accountType: string): Observable<any> {
    let params = new HttpParams().set('email', email).set('accountType', accountType)
    let URL = this.URL + environment.forgotPassword
    return this.httpClient.get(URL, { params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getStripeBillingLink(customerId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.billingLink
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateCustomerPassword(request: any, customerId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.account
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.put(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateCustomerEmail(request: any, customerId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.account
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.put(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  resendVerification(customerId: string): Observable<any> {
    let URL = this.URL + environment.customer.reverify
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.get(URL, { responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  verifyCustomer(token: string, customerId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    let URL = this.URL + environment.customer.verify
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  customerVerified(customerId: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.verify
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  customerLogin(email: string, password: string): Observable<any> {
    let URL = this.URL + environment.customer.login
    return this.httpClient.post(URL, { email, password }, { responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  customerLogOut(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.logOut
    URL = URL.replace('{customerId}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getCustomerQuotes(customerId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.quotes
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getCustomerQuote(customerId: string, quoteId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.quote
    URL = URL.replace('{customerId}', customerId)
    URL = URL.replace('{quoteId}', quoteId)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  emailProvider(providerID: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.tradesperson.email
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  acceptQuote(customerId: string, quoteId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.acceptQuote
    URL = URL.replace('{customerId}', customerId)
    URL = URL.replace('{quoteId}', quoteId)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  requestQuote(request: any, customerId: string, quoteId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.requestQuote
    URL = URL.replace('{customerId}', customerId)
    URL = URL.replace('{quoteId}', quoteId)
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  bookFixedPrice(customerId: string, priceId: string, request: any, subscription:boolean): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = subscription ? this.URL + environment.customer.bookSubscription : this.URL + environment.customer.bookFixedPrice
    URL = URL.replace('{priceId}', priceId)
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  viewFixedPriceReviews(priceId: string, page: number): Observable<any> {
    let params = new HttpParams().set('page', page)
    let URL = this.URL + environment.fixedPriceReviews
    URL = URL.replace('{priceId}', priceId)
    return this.httpClient.get(URL, { params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  reviewFixedPrice(customerId: string, priceId: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.fixedPriceReview
    URL = URL.replace('{customerId}', customerId)
    URL = URL.replace('{priceId}', priceId)
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  viewQuoteReviews(quoteId: string, page: number): Observable<any> {
    let params = new HttpParams().set('page', page)
    let URL = this.URL + environment.quoteReviews
    URL = URL.replace('{quoteId}', quoteId)
    return this.httpClient.get(URL, { params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  reviewQuote(quoteId: string, customerId: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.quoteReview
    URL = URL.replace('{quoteId}', quoteId)
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  reviewedFixedPrice(customerId: string, priceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.fixedPriceReview
    URL = URL.replace('{priceId}', priceId)
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  reviewedSubscription(customerId: string, priceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.subscriptionReview
    URL = URL.replace('{priceId}', priceId)
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  reviewedQuote(customerId: string, quoteId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.quoteReview
    URL = URL.replace('{quoteId}', quoteId)
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  hasDefaultPayment(customerId: string): Promise<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.defaultPayment
    URL = URL.replace('{customerId}', customerId)
    return firstValueFrom(this.httpClient.get(URL, { headers, responseType: 'json' }))
  }

  cancelSubscriptions(providerID: string, stripeId: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.customer.subscriptions.cancel
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{stripeId}', stripeId)
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getCustomerSubscriptions(providerID: string, stripeId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.customer.subscriptions.retrieve
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{stripeId}', stripeId)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteCustomerAccount(customerId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let URL = this.URL + environment.customer.account
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.delete(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  createCustomerAccount(request: any): Observable<any> {
    let URL = this.URL + environment.customer.create
    return this.httpClient.post(URL, request, { responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  refundSubscriptionInvoice(providerID: string, stripeId: string, subscriptionId: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.customer.subscription.refund
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{stripeId}', stripeId)
    URL = URL.replace('{subscriptionId}', subscriptionId)
    URL = URL.replace('{invoiceId}', invoiceId)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  refundInvoice(providerID: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.invoice.refund
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  refundManualInvoice(providerID: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.manualInvoice.refund
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  voidInvoice(providerID: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.invoice.void
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  voidManualInvoice(providerID: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.manualInvoice.void
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  markInvoiceUncollectible(providerID: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.invoice.uncollectible
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  markManualInvoiceUncollectible(providerID: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.manualInvoice.uncollectible
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  finalizeProviderInvoice(providerID: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.invoice.finalize
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  refundQuoteInvoice(providerID: string, quoteId: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.quote.invoice.refund
    URL = URL.replace('{quoteId}', quoteId)
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  voidQuoteInvoice(providerID: string, quoteId: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.quote.invoice.void
    URL = URL.replace('{quoteId}', quoteId)
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  markQuoteInvoiceUncollectible(providerID: string, quoteId: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.quote.invoice.uncollectible
    URL = URL.replace('{quoteId}', quoteId)
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  finalizeProviderQuoteInvoice(providerID: string, quoteId: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.quote.invoice.finalize
    URL = URL.replace('{quoteId}', quoteId)
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  finalizeQuoteRequest(providerID: string, quoteId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.quote.finalize
    URL = URL.replace('{quoteId}', quoteId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteProviderInvoice(providerID: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.invoice.delete
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.delete(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  cancelProviderQuote(providerID: string, quoteId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.quote.cancel
    URL = URL.replace('{quoteId}', quoteId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderSubscriptionInvoice(providerID: string, stripeId: string, subscriptionId: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.customer.subscription.invoice
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{stripeId}', stripeId)
    URL = URL.replace('{subscriptionId}', subscriptionId)
    URL = URL.replace('{invoiceId}', invoiceId)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderQuoteInvoice(providerID: string, quoteId: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.quote.invoice.retrieve
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{quoteId}', quoteId)
    URL = URL.replace('{invoiceId}', invoiceId)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderSubscriptions(providerID: string, page: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('page', page)
    let URL = this.URL + environment.tradesperson.billing.subscriptions
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderSubscriptionPages(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.subscriptionPages
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateInvoice(providerID: string, invoiceId: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.invoice.update
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.put(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateQuoteInvoiceDescrip(providerID: string, quoteId: string, invoiceId: string, description: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.quote.invoice.update
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{quoteId}', quoteId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.put(URL, { description }, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateQuoteRequest(providerID: string, quoteId: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.quote.update
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{quoteId}', quoteId)
    return this.httpClient.put(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  reviseQuoteRequest(providerID: string, quoteId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.quote.revise
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{quoteId}', quoteId)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  createProviderManualInvoice(providerID: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.manualInvoice.create
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderInvoice(providerID: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.invoice.retrieve
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderManualInvoice(providerID: string, invoiceId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.manualInvoice.retrieve
    URL = URL.replace('{invoiceId}', invoiceId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderQuote(providerID: string, quoteId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.quote.retrieve
    URL = URL.replace('{quoteId}', quoteId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderQuotePDF(providerID: string, quoteId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken()).set('Accept', 'application/pdf')
    let URL = this.URL + environment.tradesperson.billing.quote.pdf
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{quoteId}', quoteId)
    return this.httpClient.get(URL, { headers, responseType: 'blob' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getCustomerQuotePDF(customerId: string, quoteId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken()).set('Accept', 'application/pdf')
    let URL = this.URL + environment.customer.quotePdf
    URL = URL.replace('{customerId}', customerId)
    URL = URL.replace('{quoteId}', quoteId)
    return this.httpClient.get(URL, { headers, responseType: 'blob' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderInvoices(providerID: string, quarter: number, year: number, page: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('quarter', quarter).set('year', year).set('page', page)
    let URL = this.URL + environment.tradesperson.billing.invoices
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderInvoicesSync(providerID: string, quarter: number, year: number, page: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('quarter', quarter).set('year', year).set('page', page)
    let URL = this.URL + environment.tradesperson.billing.invoices
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderInvoicePages(providerID: string, quarter: number, year: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('quarter', quarter).set('year', year)
    let URL = this.URL + environment.tradesperson.billing.invoicePages
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderManualInvoices(providerID: string, quarter: number, year: number, page: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('quarter', quarter).set('year', year).set('page', page)
    let URL = this.URL + environment.tradesperson.billing.manualInvoices
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderManualInvoicePages(providerID: string, quarter: number, year: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('quarter', quarter).set('year', year)
    let URL = this.URL + environment.tradesperson.billing.manualInvoicePages
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, params, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderQuotes(providerID: string, quarter: number, year: number, page: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('quarter', quarter).set('year', year).set('page', page)
    let URL = this.URL + environment.tradesperson.billing.quotes
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { params, headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderQuotePages(providerID: string, quarter: number, year: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('quarter', quarter).set('year', year)
    let URL = this.URL + environment.tradesperson.billing.quotePages
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { params, headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderCustomers(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.billing.customers
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProviderSchedule(providerID: string, start: string, end: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('start', start).set('end', end)
    // if(this.googleService.getAccessToken() !== ""){
    //   params.set('accessToken', this.googleService.getAccessToken())
    // }
    let URL = this.URL + environment.tradesperson.schedule
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { params, headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateProviderPassword(request: any, providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.account
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.put(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateProviderEmail(request: any, providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.account
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.put(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  revertProviderEmail(token:string, email:string, providerID:string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token)
    let URL = this.URL + environment.tradesperson.account
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.put(URL, {email}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  providerLogin(email: string, password: string): Observable<any> {
    let URL = this.URL + environment.tradesperson.login
    return this.httpClient.post(URL, { email, password }, { responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  providerLogOut(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.logOut
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateProfile(providerID: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.profile
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.put(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  createProviderAccount(request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.create
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteProviderAccount(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.account
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.delete(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getStripeLoginLink(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.loginLink
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getStripeAccountStatusV2(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.account
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getStripeAccountStatus(providerID: string): Promise<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.account
    URL = URL.replace('{providerID}', providerID)
    return firstValueFrom(this.httpClient.get(URL, { headers: headers, responseType: 'json' }))
  }

  getProfile(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.profile
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  syncProfile(providerID: string): Promise<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.sync
    URL = URL.replace('{providerID}', providerID)
    return firstValueFrom(this.httpClient.get(URL, { headers, responseType: 'json' }))
  }

  getBranding(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.branding
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateBranding(providerID: string, branding:any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.branding
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.put(URL, branding, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProfileSettings(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.settings
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProfileFixedPrices(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.profileFixedPrices
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProfileQuotes(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.profileQuotes
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateSettings(providerID: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.settings
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.put(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateTimeZone(providerID: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.timeZone
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.put(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getProfileTimeZone(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.timeZone
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  continueOnBoarding(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.onboard
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getFixedPriceReviews(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.fixedPriceReviews
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getQuoteReviews(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.quoteReviews
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  respondToFixedPriceReview(providerID: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.fixedPriceReview
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  respondToQuoteReview(providerID: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.quoteReview
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  createCoupon(providerID: string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.coupon.create
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getCoupon(providerID: string, couponId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.coupon.retrieve
    URL = URL.replace('{couponId}', couponId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updateCoupon(providerID: string, couponId: string, name: string, services: string[]): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.coupon.update
    URL = URL.replace('{couponId}', couponId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.put(URL, {name, services}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  deleteCoupon(providerID: string, couponId:string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.coupon.delete
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{couponId}', couponId)
    return this.httpClient.delete(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  createPromo(providerID: string, couponId:string, code: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.promo.create
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{couponId}', couponId)
    return this.httpClient.post(URL, {code}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  deletePromo(providerID: string, promoId:string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.promo.delete
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{promoId}', promoId)
    return this.httpClient.delete(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getPromo(providerID: string, promoId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.promo.retrieve
    URL = URL.replace('{promoId}', promoId)
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  updatePromo(providerID: string, promoId:string, request: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.promo.update
    URL = URL.replace('{providerID}', providerID)
    URL = URL.replace('{promoId}', promoId)
    return this.httpClient.put(URL, request, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getDiscounts(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.discounts
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  getServices(providerID: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.services
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  verifyPromo(promo:string, priceId:string, customerId:string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getCustomerAccessToken())
    let params = new HttpParams().set('code', promo).set('priceId', priceId)
    let URL = this.URL + environment.customer.promo
    URL = URL.replace('{customerId}', customerId)
    return this.httpClient.get(URL, { params, headers, responseType: 'json' })
    .pipe(
      catchError(this.handleError)
    )
  }

  searchSubDomain(providerID:string, subdomain:string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let params = new HttpParams().set('subdomain', subdomain)
    let URL = this.URL + environment.tradesperson.subdomain
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.get(URL, { params, headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  checkOutSubDomain(providerID:string, subdomain:string) {
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.tokenService.getProviderAccessToken())
    let URL = this.URL + environment.tradesperson.subdomain
    URL = URL.replace('{providerID}', providerID)
    return this.httpClient.post(URL, {subdomain}, { headers, responseType: 'json' })
      .pipe(
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = ''
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }
    return throwError(errorMessage)
  }
}
