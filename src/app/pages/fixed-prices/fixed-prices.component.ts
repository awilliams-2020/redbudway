import {  AfterViewInit, Component, ElementRef, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet, UrlSegment } from '@angular/router';
import { NgbCalendar, NgbDate, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs/internal/Subscription';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Observable } from 'rxjs';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';
import { LocationService } from '../../services/location.service';
import { CategoryService } from '../../services/category.service';
import { Mutex } from 'async-mutex';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { IconsModule } from '../../icons/icons.module';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatomoTracker } from 'ngx-matomo-client';

interface Sorting {
  method: string,
  direction: string,
  index: number
}

@Component({
  selector: 'app-fixed-prices',
  imports: [
    CommonModule,
    // ServiceCardComponent,
    // InfiniteScrollDirective,
    RouterOutlet,
    IconsModule,
    RouterLink,
    RouterLinkActive,
    NavbarComponent
  ],
  templateUrl: './fixed-prices.component.html',
  styleUrls: ['./fixed-prices.component.css']
})
export class FixedPricesComponent implements OnInit, AfterViewInit {
  private locationService = inject(LocationService)
  private router = inject(Router)
  private httpService = inject(HttpService)
  private dataService = inject(DataService)
  private modalService = inject(NgbModal)
  private offcanvasService = inject(NgbOffcanvas)
  private route = inject(ActivatedRoute)
  private calendar = inject(NgbCalendar)
  public categories = inject(CategoryService).getCategories()
  private matomoTracker = inject(MatomoTracker)

  subCategories: any[] = []
  specialties: string[] = []
  selectedCategory: string = ''
  selectedSubCategory: string = ''
  selectedSpecialties: string[] = []
  loading: boolean = false
  mutex: Mutex = new Mutex()
  city: string = ''
  state: string = ''
  fixedPrices: any[] = []
  fixedPricesPage: number = 1
  maxFixedPricePages: number = 1
  showRandom: boolean = false
  min: number = 0
  max: number = 0
  fromDate: NgbDate | null = null
  toDate: NgbDate | null = null
  toDateSet: boolean = false
  filters: number = 0
  sorted: Sorting = {
    method: '',
    direction: '',
    index: 0
  }
  sorting = [
    {
      method: '',
      direction: '',
      index: 0
    },
    {
      method: 'cost',
      direction: 'asc',
      index: 1
    },
    {
      method: 'cost',
      direction: 'desc',
      index: 2
    }
  ]
  canSort: boolean = false
  dataSubscription:  Subscription = new Subscription()
  routeSubscription: Subscription = new Subscription()
  @ViewChildren('categories') $categories: QueryList<ElementRef> = {} as QueryList<ElementRef>


  constructor() {}

  ngOnInit(): void {
    // const location = this.locationService.getLocation()
    // this.city = location.city
    // this.state = location.state
    const children = this.route?.children
    const url = children.length ? children[0].url : new Observable<UrlSegment[]>
    this.routeSubscription = combineLatest([
      this.route.queryParams,
      url,
    ])
      .subscribe((resp) => {
        const params = resp[0]
        const segments = resp[1]
        if (segments.length && segments[0].path !== '') {
          this.selectedCategory = segments[0].path
          for (let category$ of this.categories) {
            if (category$.category === this.selectedCategory) {
              this.subCategories = category$.subCategories
              break
            }
          }
        }
        if (segments.length > 1 && segments[1].path !== '') {
          if (segments[1].path !== this.selectedSubCategory) {
            this.selectedSubCategory = segments[1].path
            for (let subCategory$ of this.subCategories) {
              if (subCategory$.subCategory === this.selectedSubCategory) {
                this.specialties = subCategory$.specialties
                break
              }
            }
          }
        }
        this.filters = 0
        if (params['specialties']) {
          this.selectedSpecialties = params['specialties'].split(',')
          this.filters = this.selectedSpecialties.length
        }
        if (params['min']) {
          this.min = parseFloat(params['min'])
          this.filters++
        }
        if (params['max']) {
          this.max = parseFloat(params['max'])
          this.filters++
        }
        if (params['from']) {
          const dateParts = params['from'].split('-')
          this.fromDate = this.calendar.getToday()
          this.fromDate.year = +dateParts[0]
          this.fromDate.month = +dateParts[1]
          this.fromDate.day = +dateParts[2]
          this.filters++
        }
        if (params['to']) {
          const dateParts = params['to'].split('-')
          this.toDate = this.calendar.getToday()
          this.toDate.year = +dateParts[0]
          this.toDate.month = +dateParts[1]
          this.toDate.day = +dateParts[2]
          this.filters++
        }
        if (params['sort'] && params['dir']) {
          for (let sorted of this.sorting) {
            if (sorted.method === params['sort'] && sorted.direction === params['dir']) {
              this.sorted = sorted
            }
          }
        }
      })
    // this.dataSubscription = this.dataService.getLocation()
    //   .subscribe((location:any) => {
    //     this.city = location.city
    //     this.state = location.state
    //   })
    this.dataService.getCanSort()
      .subscribe((canSort:boolean) => {
        this.canSort = canSort
      })
  }

  ngOnDestroy() {
    // this.dataSubscription.unsubscribe()
  }

  ngAfterViewInit() {
    this.routeSubscription.unsubscribe()
    this.$categories.forEach((category) => {
      if (category.nativeElement.classList.contains('active')) {
        category.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    })
    // if (this.selectedCategory == '' && this.selectedSubCategory == '') {
      //prevent infinite scroll to start scrolling
      // window.scrollTo({
      //   top:0,
      //   left:0,
      //   behavior:'smooth'
      // })
      // this.checkLocation()
    // }
  }

  sortServices() {
    if (this.sorted.index === this.sorting.length - 1) {
      this.sorted = this.sorting[0]
    } else {
      this.sorted = this.sorting[this.sorted.index + 1]
    }
    this.setURI()
  }

  openSideMenu() {
    const sideMenu = this.offcanvasService.open(SideMenuComponent);
    sideMenu.componentInstance.subCategory = this.selectedSubCategory
    sideMenu.componentInstance.specialties = this.specialties
    sideMenu.componentInstance.selectedSpecialties = this.selectedSpecialties
    sideMenu.componentInstance.serviceCount = this.fixedPrices.length
    sideMenu.componentInstance.min = this.min / 100
    sideMenu.componentInstance.max = this.max / 100
    sideMenu.componentInstance.fromDate = this.fromDate
    sideMenu.componentInstance.toDate = this.toDate
    sideMenu.result.then(
      (filters) => {
        this.selectedSpecialties = filters.selectedSpecialties
        this.filters = filters.selectedSpecialties.length
        this.min = filters.min
        if (filters.min) {
          this.filters++
        }
        this.max = filters.max
        if (filters.max) {
          this.filters++
        }
        this.fromDate = filters.fromDate
        if (filters.fromDate) {
          this.filters++
        }
        this.toDate = filters.toDate
        if(filters.toDate) {
          this.filters++
        }
        this.setURI()
      }, (reason) => {}
    );
  }

  selectCategory(category: any) {
    this.showRandom = false
    this.subCategories = []
    this.fixedPrices = []
    this.selectedSpecialties = []
    this.specialties = []
    this.min = 0
    this.max = 0
    this.fromDate = null
    this.toDate = null
    this.filters = 0
    this.sorted = {
      method: '',
      direction: '',
      index: 0
    }
    this.selectedSubCategory = ''
    if (this.selectedCategory !== category.category) {
      this.selectedCategory = category.category
      this.subCategories = category.subCategories
    } else {
      this.selectedCategory = ''
      this.setURI()
    }
  }

  selectSubCategory(subCategory: any) {
    this.showRandom = false
    this.fixedPrices = []
    this.selectedSpecialties = []
    this.specialties = []
    this.min = 0
    this.max = 0
    this.fromDate = null
    this.toDate = null
    this.filters = 0
    this.sorted = {
      method: '',
      direction: '',
      index: 0
    }
    if (this.selectedSubCategory !== subCategory.subCategory) {
      this.selectedSubCategory = subCategory.subCategory
      this.specialties = subCategory.specialties
    } else {
      this.selectedSubCategory = ''
      this.setURI()
    }
  }

  viewQuotes() {
    let segments = []
    segments.push('/quotes')
    if (this.selectedCategory) {
      segments.push(this.selectedCategory)
    }
    if (this.selectedSubCategory) {
      segments.push(this.selectedSubCategory)
    }
    this.router.navigate(segments)
  }

  setURI() {
    let paths = ['/fixed-prices']
    if (this.selectedCategory !== '') {
      paths.push(this.selectedCategory)
    }
    if (this.selectedSubCategory !== '') {
      paths.push(this.selectedSubCategory)
    }
    // if (paths.length === 1) {
    //   this.checkLocation()
    // }
    let queryParams: any = {}
    if (this.selectedSpecialties.length) {
      queryParams.specialties = this.selectedSpecialties.join(",")
    }
    if (this.min) {
      queryParams.min = this.min
    }
    if (this.max) {
      queryParams.max = this.max
    }
    if (this.fromDate) {
      queryParams.from = this.dateToString(this.fromDate)
    }
    if (this.toDate) {
      queryParams.to = this.dateToString(this.toDate)
    }
    if (this.sorted.method !== '') {
      queryParams.sort = this.sorted.method
      queryParams.dir = this.sorted.direction
    }
    this.router.navigate(paths, { queryParams })
  }

  dateToString(date: NgbDate | null) {
    return date?.year + '-' + date?.month + '-' + date?.day
  }

  // checkLocation() {
  //   this.loading = true
  //   this.showRandom = true
  //   this.fixedPrices = []
  //   this.fixedPricesPage = 1
  //   if (this.locationService.isSet()) {
  //     this.getMaxPages()
  //   } else {
  //     this.setLocation('set')
  //   }
  // }

  // getMaxPages() {
  //   this.httpService.getPublicServicePages(this.selectedCategory, this.selectedSubCategory, this.city, this.state, [], 0, 0, '', '')
  //     .subscribe((pages: number) => {
  //       this.maxFixedPricePages = pages
  //       this.getServices()
  //     })
  // }

  // getServices() {
  //   if (this.fixedPricesPage <= this.maxFixedPricePages) {
  //     this.httpService.getPublicServices(this.selectedCategory, this.selectedSubCategory, this.city, this.state, [], this.fixedPricesPage, 0, 0, '', '', this.sorted.method+this.sorted.direction)
  //       .subscribe((resp: any) => {
  //         this.canSort = resp.length
  //         this.fixedPrices.push(...resp)
  //         this.fixedPricesPage += 1
  //         this.loading = false
  //         this.mutex.release()
  //       })
  //   }
  // }

  // setLocation(action: string) {
  //   // this.matomoTracker.trackEvent("location", action)
  //   const modalRef = this.modalService.open(LocationComponent, { centered: true, backdrop: 'static', keyboard: false });
  //   modalRef.componentInstance.location.subscribe((location: any) => {
  //     this.city = location.city
  //     this.state = location.state
  //     this.getMaxPages()
  //     if (this.showRandom) {
  //       this.loading = true
  //       this.fixedPrices = []
  //       this.fixedPricesPage = 1
  //     } else {
  //       this.dataService.setLocation(this.city, this.state)
  //     }
  //   })
  //   modalRef.result.then(() => {}, () => {
  //     this.getMaxPages()
  //   })
  // }

  // encodeURL(prefix: string, title: string) {
  //   return [prefix, encodeURIComponent(title)]
  // }

  // onScroll() {
  //   if (!this.loading) {
  //     this.mutex.acquire()
  //       .then(() => {
  //         this.getServices()
  //       })
  //   }
  // }

}
