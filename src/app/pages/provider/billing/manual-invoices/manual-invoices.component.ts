import { Component, inject, OnInit } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { HttpService } from '../../../../services/http.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { IconsModule } from '../../../../icons/icons.module';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { filter, first, map } from 'rxjs';

@Component({
  selector: 'app-manual-invoices',
  imports: [CommonModule, FormsModule, RouterLink, IconsModule, InfiniteScrollDirective],
  templateUrl: './manual-invoices.component.html',
  styleUrls: ['./manual-invoices.component.css']
})
export class ManualInvoicesComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private httpService = inject(HttpService)
  private storageService = inject(StorageService)

  providerId: string = this.storageService.getProviderID()
  invoices: any[] = []
  invoiceId: string = ''
  today: Date = new Date()
  year: number = this.today.getFullYear()
  quarter: number = this.getQuarter()
  years: number[] = []
  customers: any[] = []
  loading: boolean = true
  page: number = 1
  maxPages: number = 1

  constructor() {
    let incepYear = 2022
    this.years.push(incepYear)
    while (incepYear < this.year) {
      incepYear += 1
      this.years.push(incepYear)
    }
  }

  ngOnInit(): void {
    this.getExistingCustomers()
    this.route.queryParamMap.subscribe(params => {
      if (params.has('quarter')) {
        this.quarter = parseInt(params.get('quarter')!)
      }
      if (params.has('year')) {
        this.year = parseInt(params.get('year')!)
      }
      this.page = 1
      this.invoices = []
      this.getManualInvoicePages()
    });
  }

  onScroll() {
    if (!this.loading) {
      this.getManualInvoices()
    }
  }

  getManualInvoicePages() {
    this.httpService.getProviderManualInvoicePages(this.providerId, this.quarter, this.year)
      .subscribe((pages: number) => {
        this.maxPages = pages
        this.getManualInvoices()
      })    
  }

  getManualInvoices() {
    if(this.page <= this.maxPages) {
      this.loading = true
      this.httpService.getProviderManualInvoices(this.providerId, this.quarter, this.year, this.page)
        .subscribe((invoices: any) => {
          this.invoices.push(...invoices)
          this.page += 1
          this.loading = false
        })
    }
  }

  getExistingCustomers() {
    this.httpService.getProviderCustomers(this.providerId)
      .subscribe((customers:any[]) =>{
        this.customers = customers
      })
  }

  getQuarter() {
    if (this.today.getMonth() >= 3 && this.today.getMonth() <= 5) {
       return 2
     } else if (this.today.getMonth() >= 6 && this.today.getMonth() <= 8) {
       return 3
     } else if (this.today.getMonth() >= 9 && this.today.getMonth() <= 11) {
       return 4
     }
     return 1
   }
}
