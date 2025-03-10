import { ChangeDetectorRef, Component, inject, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { first } from 'rxjs';
import { StorageService } from '../../../../services/storage.service';
import { HttpService } from '../../../../services/http.service';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoices',
  imports: [CommonModule, FormsModule, RouterLink, InfiniteScrollDirective],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  private route = inject(ActivatedRoute)
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
  maxPages: number = 1
  page: number = 1
  loading: boolean = true

  constructor() {
    let incepYear = 2022
    this.years.push(incepYear)
    while (incepYear < this.year) {
      incepYear += 1
      this.years.push(incepYear)
    }
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      if (params.has('quarter')) {
        this.quarter = parseInt(params.get('quarter')!)
      }
      if (params.has('year')) {
        this.year = parseInt(params.get('year')!)
      }
      this.page = 1
      this.invoices = []
      this.getInvoicePages()
    });
  }

  onScroll() {
    if (!this.loading) {
      this.getInvoices()
    }
  }

  getInvoicePages() {
    this.httpService.getProviderInvoicePages(this.providerId, this.quarter, this.year)
      .subscribe((pages: number) => {
        this.maxPages = pages
        this.getInvoices()
      })    
  }

  getInvoices() {
    if(this.page <= this.maxPages){
      this.loading = true
      this.httpService.getProviderInvoices(this.providerId, this.quarter, this.year, this.page)
        .subscribe((invoices: any) => {
          this.invoices.push(...invoices)
          this.page += 1
          this.loading = false
        })
    }
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
