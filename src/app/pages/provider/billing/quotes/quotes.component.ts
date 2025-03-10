import { Component, inject, OnInit } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { HttpService } from '../../../../services/http.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quotes',
  imports: [CommonModule, FormsModule, RouterLink, InfiniteScrollDirective],
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  private storageService = inject(StorageService)
  private httpService = inject(HttpService)
  private route = inject(ActivatedRoute)

  providerID: any = this.storageService.getProviderID()
  quotes: any[] = []
  quoteId: string = ''
  today: Date = new Date()
  year: number = this.today.getFullYear()
  quarter: number = this.getQuarter()
  years: number[] = []
  page: number = 1
  maxPages: number = 1
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
      this.quotes = []
      this.getQuotePages()
    });
  }

  onScroll() {
    if (!this.loading) {
      this.getQuotes()
    }
  }

  getQuotePages() {
    this.httpService.getProviderQuotePages(this.providerID, this.quarter, this.year)
      .subscribe((pages: number) => {
        this.maxPages = pages
        this.getQuotes()
      })    
  }

  getQuotes() {
    if(this.page <= this.maxPages){
      this.loading = true
      this.httpService.getProviderQuotes(this.providerID, this.quarter, this.year, this.page)
      .subscribe((quotes: any) => {
        this.quotes.push(...quotes)
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
