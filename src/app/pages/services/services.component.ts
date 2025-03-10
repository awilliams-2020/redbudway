import { afterNextRender, AfterViewInit, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Mutex } from 'async-mutex';
import { Subscription, combineLatest } from 'rxjs';
import { DataService } from '../../services/data.service';
import { GoogleadsService } from '../../services/googleads.service';
import { HttpService } from '../../services/http.service';
import { LocationService } from '../../services/location.service';
import { CommonModule } from '@angular/common';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { LocationComponent } from '../../modals/location/location.component';
import { IconsModule } from '../../icons/icons.module';

@Component({
  selector: 'app-services',
  imports: [CommonModule, ServiceCardComponent, InfiniteScrollDirective, IconsModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css']
})
export class ServicesComponent implements OnInit, AfterViewInit {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  public locationService = inject(LocationService)
  private httpService = inject(HttpService)
  private dataService = inject(DataService)
  private modalService = inject(NgbModal)
  // private matomoTracker:MatomoTracker
  private googleAds = inject(GoogleadsService)
  private changeDetector = inject(ChangeDetectorRef)

  city: string = ''
  state: string = ''
  fixedPricesPage: number = 1
  maxFixedPricePages: number = 1
  quotesPage: number = 1
  maxQuotePages: number = 1
  fixedPrices: any[] = []
  quotes: any[] = []
  selectedCategory: string = ''
  selectedSubCategory: string = ''
  selectedSpecialties: string[] = []
  loading: boolean = false
  view: string = ''
  min: number = 0
  max: number = 0
  mutex: Mutex = new Mutex
  fromDate: string = ''
  toDate: string = ''
  sorted: string = ''
  subscription: Subscription = new Subscription
  
  constructor() {
    afterNextRender(() => {
      const location = this.locationService.getLocation()
      this.city = location.city
      this.state = location.state
      this.changeDetector.detectChanges()
    })
  }

  ngOnInit(): void {
    this.route.data
      .subscribe(({view}) => {
        this.view = view
      })

    combineLatest([
      this.route.url,
      this.route.queryParams
    ])
      .subscribe((resp) => {
        const segments = resp[0]
        const params = resp[1]
        this.mutex.acquire()
          .then(() => {
            if (segments.length && segments[0].path !== '') {
              this.selectedCategory = segments[0].path
            }
            if (segments.length > 1 && segments[1].path !== '') {
              if (segments[1].path !== this.selectedSubCategory) {
                this.selectedSubCategory = segments[1].path
              }
            }
            this.selectedSpecialties = []
            this.min = 0
            this.max = 0
            this.fromDate = ''
            this.toDate = ''
            this.sorted = ''
            if (params['specialties']) {
              this.selectedSpecialties = params['specialties'].split(',')
            }
            if (params['min']) {
              this.min = parseFloat(params['min'])
            }
            if (params['max']) {
              this.max = parseFloat(params['max'])
            }
            if (params['from']) {
              this.fromDate = params['from']
            }
            if (params['to']) {
              this.toDate = params['to']
            }
            if (params['sort'] && params['dir']) {
              this.sorted = params['sort']+params['dir']
            }
            this.checkLocation()
          })
      })

    this.subscription = this.dataService.getLocation()
      .subscribe(({ city, state }) => {
        this.city = city
        this.state = state
        this.loading = true
        this.quotes = []
        this.quotesPage = 1
        this.fixedPrices = []
        this.fixedPricesPage = 1
        this.getMaxPages()
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  ngAfterViewInit() {
    this.googleAds.pushAd()
  }

  checkLocation() {
    this.loading = true
    this.quotes = []
    this.quotesPage = 1
    this.fixedPrices = []
    this.fixedPricesPage = 1
    if (this.locationService.isSet()) {
      this.getMaxPages()
    } else {
      // this.matomoTracker.trackEvent("location", 'set')
      const modalRef = this.modalService.open(LocationComponent, { centered: true, backdrop: 'static', keyboard: false });
      modalRef.componentInstance.location.subscribe((location: any) => {
        this.city = location.city
        this.state = location.state
        this.dataService.setLocation(this.city, this.state)
      })
      modalRef.result.then(() => {}, () => {
        this.getMaxPages()
      })
    }
  }

  setLocation(action: string) {
    // this.matomoTracker.trackEvent("location", action)
    const modalRef = this.modalService.open(LocationComponent, { centered: true, backdrop: 'static', keyboard: false });
    modalRef.componentInstance.location.subscribe((location: any) => {
      this.dataService.setLocation(this.city, this.state)
    })
    modalRef.result.then(() => {}, () => {
      // this.getMaxPages()
    })
  }

  getMaxPages() {
    if (this.view === 'quotes') {
      this.httpService.getPublicQuotePages(this.selectedCategory, this.selectedSubCategory, this.city, this.state, this.selectedSpecialties)
        .subscribe((pages: number) => {
          this.maxQuotePages = pages
          this.getServices()
        })
    } else {
      this.httpService.getPublicServicePages(this.selectedCategory, this.selectedSubCategory, this.city, this.state, this.selectedSpecialties, this.min, this.max, this.fromDate, this.toDate)
        .subscribe((pages: number) => {
          this.maxFixedPricePages = pages
          this.getServices()
        })
    }
  }

  getServices() {
    if (this.view === 'quotes') {
      if (this.quotesPage <= this.maxQuotePages) {
        this.httpService.getPublicQuotes(this.selectedCategory, this.selectedSubCategory, this.city, this.state, this.selectedSpecialties, this.quotesPage)
          .subscribe((resp: any) => {
            this.quotes.push(...resp)
            this.quotesPage += 1
            this.loading = false
            this.mutex.release()
          })
      }
    } else {
      if (this.fixedPricesPage <= this.maxFixedPricePages) {
        this.httpService.getPublicServices(this.selectedCategory, this.selectedSubCategory, this.city, this.state, this.selectedSpecialties, this.fixedPricesPage, this.min, this.max, this.fromDate, this.toDate, this.sorted)
          .subscribe((resp: any) => {
            this.dataService.setCanSort(resp.length)
            this.fixedPrices.push(...resp)
            this.fixedPricesPage += 1
            this.loading = false
            this.mutex.release()
          })
      }
    }

  }

  encodeURL(prefix: string, title: string) {
    return [prefix, encodeURIComponent(title)]
  }

  onScroll() {
    if (!this.loading) {
      this.mutex
        .acquire()
        .then(() => {
          this.getServices()
        })
    }
  }

  switchView() {
    let segments = []
    segments.push(this.view === 'quotes' ? '/fixed-prices' : '/quotes')
    if (this.selectedCategory) {
      segments.push(this.selectedCategory)
    }
    if (this.selectedSubCategory) {
      segments.push(this.selectedSubCategory)
    }
    this.router.navigate(segments)
  }

}
