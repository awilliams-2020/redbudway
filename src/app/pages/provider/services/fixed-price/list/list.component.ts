import { Component, inject } from '@angular/core';
import { HttpService } from '../../../../../services/http.service';
import { StorageService } from '../../../../../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceCardComponent } from '../../../../../components/service-card/service-card.component';
import { IconsModule } from '../../../../../icons/icons.module';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list',
  imports: [
    CommonModule,
    ServiceCardComponent,
    IconsModule,
    InfiniteScrollDirective
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {
  private httpService = inject(HttpService)
  private storageService = inject(StorageService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  
  provider: string
  fixedPrices: any
  maxPages: number
  page: number
  loading: boolean

  constructor() {
    this.provider = this.storageService.getProviderID()
    this.fixedPrices = []
    this.loading = true
    this.maxPages = 1
    this.page = 1
  }

  ngOnInit(): void {
    this.getPricePages()
    this.getPrices()
  }

  onScroll() {
    if (!this.loading) {
      this.getPrices()
    }
  }

  getPricePages() {
    this.httpService.getProviderPricePages(this.provider)
      .subscribe((pages: number) => {
        this.maxPages = pages
      })    
  }

  getPrices() {
    if(this.page <= this.maxPages){
      this.loading = true
      this.httpService.getProviderPrices(this.provider, this.page).subscribe((services:any) =>{
        this.fixedPrices.push(...services)
        this.page += 1
        this.loading = false
      })
    }
  }

  createFixedPrice(){
    this.router.navigate(["./create"], {relativeTo: this.route})
  }

  close() {
    this.router.navigateByUrl("/")
  }
}
