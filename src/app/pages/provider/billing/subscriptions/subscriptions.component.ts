import { Component, inject, OnInit } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { HttpService } from '../../../../services/http.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-subscriptions',
  imports: [CommonModule, RouterLink],
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {
  private storageService = inject(StorageService)
  private httpService = inject(HttpService)

  providerId: any
  customers: any[]
  page: number
  maxPages: number
  loading: boolean

  constructor() {
    this.providerId = this.storageService.getProviderID()
    this.customers = []
    this.page = 1
    this.maxPages = 1
    this.loading = false
  }

  ngOnInit(): void {
    this.getSubscriptionPages()
    this.getSubscriptions()
  }

  onScroll() {
    if (!this.loading) {
      this.getSubscriptions()
    }
  }
  
  getSubscriptionPages() {
    this.httpService.getProviderSubscriptionPages(this.providerId)
      .subscribe((pages: number) => {
        this.maxPages = pages
      })    
  }

  getSubscriptions() {
    if(this.page <= this.maxPages){
      this.loading = true
      this.httpService.getProviderSubscriptions(this.providerId, this.page)
        .subscribe((customers: any) => {
          this.customers.push(...customers)
          this.page += 1
          this.loading = false
        })
    }
  }
}
