import { Component, inject } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { StorageService } from '../../../../../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceCardComponent } from '../../../../../components/service-card/service-card.component';
import { IconsModule } from '../../../../../icons/icons.module';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [CommonModule, ServiceCardComponent, IconsModule, InfiniteScrollDirective],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  private httpService = inject(HttpService)
  private dataService = inject(StorageService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  providerId: string
  quotes: any
  maxPages: number
  page: number
  loading:boolean

  constructor() {
    this.providerId = this.dataService.getProviderID()
    this.quotes = []
    this.loading = true
    this.maxPages = 1
    this.page = 1
  }

  ngOnInit(): void {
    this.getQuotePages()
    this.getQuotes()
  }

  onScroll() {
    if (!this.loading) {
      this.getQuotes()
    }
  }

  getQuotePages() {
    this.httpService.getQuotePages(this.providerId)
      .subscribe((pages: number) => {
        this.maxPages = pages
      })    
  }

  getQuotes() {
    if(this.page <= this.maxPages){
      this.loading = true
      this.httpService.getQuotes(this.providerId, this.page).subscribe((quotes:any) =>{
        this.quotes.push(...quotes)
        this.page += 1
        this.loading = false
      })
    }
  }

  createQuote(){
    this.router.navigate(["./create"], {relativeTo:this.route})
  }

  close() {
    this.router.navigateByUrl("/")
  }
}
