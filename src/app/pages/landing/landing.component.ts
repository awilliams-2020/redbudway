import { afterNextRender, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { GoogleadsService } from '../../services/googleads.service';
import { CategoryService } from '../../services/category.service';
import { environment } from '../../../environments/environment';
import { IconsModule } from '../../icons/icons.module';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-landing',
  imports: [
    CommonModule,
    IconsModule,
    NavbarComponent,
    ServiceCardComponent,
    RouterLink
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  private changeDetector = inject(ChangeDetectorRef)
  private router = inject(Router)
  private storageService = inject(StorageService)
  private gaService = inject(GoogleadsService)
  public services = inject(CategoryService).getCategories()
  public samples: any[]
  public sampleQuotes: any[]
  public providerId: string = ''
  public isProviderLoggedIn: boolean = false
  
  constructor() {
    afterNextRender(() => {
      this.providerId = this.storageService.getProviderID()
      this.isProviderLoggedIn = this.storageService.isProviderLoggedIn()
      this.changeDetector.detectChanges()
    })

    this.samples = [
      {
        priceId: "1",
        image: `https://${environment.host}/assets/images/examples/catering.webp`,
        title: 'Wedding Catering',
        price: 2000.00,
        subscription: 0,
        interval: '',
        reviews: 5,
        rating: 3.2,
        availableTimeSlots: 54,
        jobs: 10,
        repeat: 3,
        business: {
          name: 'Exquisite Catering',
          vanityURL: "",
        },
        link: '/fixed-prices/Entertainment/Catering'
      },
      {
        priceId: "2",
        image: `https://${environment.host}/assets/images/examples/baby-sitting.webp`,
        title: 'Baby Sitter',
        price: 35.00,
        subscription: 1,
        interval: 'week',
        reviews: 150,
        rating: 3.75,
        availableTimeSlots: 7,
        jobs: 200,
        repeat: 83,
        business: {
          name: 'Jane Doe',
          vanityURL: "",
        },
        link: '/fixed-prices/Care/Babysitter'
      },
      {
        priceId: "3",
        image: `https://${environment.host}/assets/images/examples/car-wash.webp`,
        title: 'Premium Detailing',
        price: 155.99,
        subscription: 1,
        interval: 'month',
        reviews: 10,
        rating: 4.0,
        availableTimeSlots: 100,
        jobs: 64,
        repeat:10,
        business: {
          name: 'ABC Detailing',
          vanityURL: "",
        },
        link: '/fixed-prices/Car/Detailing'
      }
    ]
    this.sampleQuotes = [
      {
        image: `https://${environment.host}/assets/images/examples/landscaping.webp`,
        title: 'Landscaping',
        reviews: 99,
        rating: 3.0,
        description: 'Maintains gardens and lawns, including mowing, trimming, pruning, raking, and weeding ...',
        business: {
          name: 'Jims Landscaping',
          vanityURL: "",
        },
        link: '/quotes/Lawn & Garden/Landscaping'
      },
      {
        image: `https://${environment.host}/assets/images/examples/cleaning.webp`,
        title: 'Home Cleaning',
        reviews: 5,
        rating: 5,
        description: 'Perform various cleaning tasks, which include mopping, vacuuming and sweeping flo...',
        business: {
          name: 'MaidsRUs LLC',
          vanityURL: "",
        },
        link: '/quotes/Cleaning'
      },
      {
        image: `https://${environment.host}/assets/images/examples/movers.webp`,
        title: 'Long Distance',
        reviews: 35,
        rating: 3.5,
        description: 'Load up the truck with all your belongings, transport it all to the new address...',
        business: {
          name: 'The Best Movers',
          vanityURL: "",
        },
        link: '/quotes/Cleaning'
      }
    ]
  }

  ngAfterViewInit() {
    this.gaService.pushAd()
    this.gaService.pushAd()
  }

  viewQuotes() {
    this.router.navigateByUrl('/quotes')
  }
}
