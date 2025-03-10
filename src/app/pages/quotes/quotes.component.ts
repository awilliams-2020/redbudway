import { Component, ElementRef, inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet, UrlSegment } from '@angular/router';
import { NgbDate, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { Mutex } from 'async-mutex';
import { SideMenuComponent } from '../../components/side-menu/side-menu.component';
import { HttpService } from '../../services/http.service';
import { LocationService } from '../../services/location.service';
import { CategoryService } from '../../services/category.service';
import { DataService } from '../../services/data.service';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { IconsModule } from '../../icons/icons.module';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { LocationComponent } from '../../modals/location/location.component';
import { Observable } from 'rxjs';
import { MatomoTracker } from 'ngx-matomo-client';


@Component({
  selector: 'app-quotes',
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    // ServiceCardComponent,
    // InfiniteScrollDirective,
    IconsModule,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.css']
})
export class QuotesComponent implements OnInit {
  public locationService = inject(LocationService)
  private router = inject(Router)
  private httpService = inject(HttpService)
  private dataService = inject(DataService)
  private modalService = inject(NgbModal)
  private route = inject(ActivatedRoute)
  private offcanvasService = inject(NgbOffcanvas)
  private matomoTracker = inject(MatomoTracker)

  public services: any[] = inject(CategoryService).getCategories()
  selectedCategory: string = ''
  subCategories: any[] = []
  selectedSubCategory: string = ''
  specialties: string[] = []
  selectedSpecialties: string[] = []
  loading: boolean = false
  mutex: Mutex =  new Mutex()
  viewQuotes: boolean = false
  quotesPage: number = 1
  maxQuotePages: number = 1
  city: string = ''
  state: string = ''
  quotes: any[] = []
  showRandom: boolean = false
  fromDate: NgbDate | null = null
  toDate: NgbDate | null = null
  filters: number = 0
  @ViewChildren('categories') $categories: QueryList<ElementRef> = {} as QueryList<ElementRef>


  constructor() {}

  ngOnInit(): void {
    // const location = this.locationService.getLocation()
    // this.city = location.city
    // this.state = location.state
    const children = this.route?.children
    const url = children.length ? children[0].url : new Observable<UrlSegment[]>
    combineLatest([
      this.route.queryParams,
      // this.route.children[0].queryParams,
      this.route.children[0].url
    ])
      .subscribe((resp) => {
        const params = resp[0]
        const segments = resp[1]
        if (segments.length && segments[0].path !== '') {
          this.selectedCategory = segments[0].path
          for (let category$ of this.services) {
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
      })
    this.dataService.getLocation()
      .subscribe(({ city, state }) => {
        this.city = city
        this.state = state
      })
  }

  ngAfterViewInit() {
    this.$categories.forEach((category) => {
      if (category.nativeElement.classList.contains('active')) {
        category.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    })
    // if (this.selectedCategory == '' && this.selectedSubCategory == '') {
      //prevent infinite scroll to start scrolling
      // window.scrollTo({
      //   top: 0,
      //   left: 0,
      //   behavior: 'smooth'
      // })
      // this.checkLocation()
    // }
  }

  selectCategory(category: any) {
    this.showRandom = false
    this.quotes = []
    this.selectedSpecialties = []
    this.specialties = []
    this.fromDate = null
    this.toDate = null
    this.filters = 0
    this.selectedSubCategory = ''
    if (this.selectedCategory !== category.category) {
      this.selectedCategory = category.category
      this.subCategories = category.subCategories
    } else {
      this.selectedCategory = ''
      this.subCategories = []
      this.setURI()
    }

  }

  selectSubCategory(subCategory: any) {
    this.showRandom = false
    this.quotes = []
    this.selectedSpecialties = []
    this.specialties = []
    this.fromDate = null
    this.toDate = null
    this.filters = 0
    if (this.selectedSubCategory !== subCategory.subCategory) {
      this.selectedSubCategory = subCategory.subCategory
      this.specialties = subCategory.specialties
    } else {
      this.selectedSubCategory = ''
      this.specialties = []
      this.setURI()
    }
  }

  viewFixedPrices() {
    let segments = []
    segments.push('/fixed-prices')
    if (this.selectedCategory) {
      segments.push(this.selectedCategory)
    }
    if (this.selectedSubCategory) {
      segments.push(this.selectedSubCategory)
    }
    this.router.navigate(segments)
  }

  // shuffle(array: any) {
  //   for (var i = array.length - 1; i > 0; i--) {
  //     var j = Math.floor(Math.random() * (i + 1));
  //     var temp = array[i];
  //     array[i] = array[j];
  //     array[j] = temp;
  //   }
  //   return array
  // }

  setURI() {
    let paths = ['/quotes']
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
    if (this.fromDate) {
      queryParams.from = this.dateToString(this.fromDate)
    }
    if (this.toDate) {
      queryParams.to = this.dateToString(this.toDate)
    }
    this.router.navigate(paths, { queryParams })
  }

  dateToString(date: NgbDate | null) {
    return date?.year + '-' + date?.month + '-' + date?.day
  }

  // checkLocation() {
  //   this.loading = true
  //   this.showRandom = true
  //   this.quotes = []
  //   this.quotesPage = 1
  //   if (this.locationService.isSet()) {
  //     this.getMaxPages()
  //   } else {
  //     this.setLocation('set')
  //   }
  // }

  // getMaxPages() {
  //   this.httpService.getPublicQuotePages(this.selectedCategory, this.selectedSubCategory, this.city, this.state, [])
  //     .subscribe((pages: number) => {
  //       this.maxQuotePages = pages
  //       this.getServices()
  //     })
  // }

  // getServices() {
  //   if (this.quotesPage <= this.maxQuotePages) {
  //     this.httpService.getPublicQuotes(this.selectedCategory, this.selectedSubCategory, this.city, this.state, [], this.quotesPage)
  //       .subscribe((resp: any) => {
  //         this.quotes.push(...resp)
  //         this.quotesPage += 1
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
  //       this.quotes = []
  //       this.quotesPage = 1
  //     } else {
  //       this.dataService.setLocation(this.city, this.state)
  //     }
  //   })
  //   modalRef.result.then(() => {}, () => {
  //     this.getMaxPages()
  //   })
  // }

  openSideMenu() {
    const sideMenu = this.offcanvasService.open(SideMenuComponent);
    sideMenu.componentInstance.subCategory = this.selectedSubCategory
    sideMenu.componentInstance.specialties = this.specialties
    sideMenu.componentInstance.selectedSpecialties = this.selectedSpecialties
    sideMenu.componentInstance.serviceCount = this.quotes.length
    sideMenu.componentInstance.fromDate = this.fromDate
    sideMenu.componentInstance.toDate = this.toDate
    sideMenu.componentInstance.isFixedPrice = false
    sideMenu.result.then(
      (filters) => {
        this.selectedSpecialties = filters.selectedSpecialties
        this.fromDate = filters.fromDate
        this.toDate = filters.toDate
        this.setURI()
      }, (reason) => { }
    );
  }

  // onScroll() {
  //   if (!this.loading) {
  //     this.mutex
  //       .acquire()
  //       .then(() => {
  //         this.getServices()
  //       })
  //   }
  // }

}
