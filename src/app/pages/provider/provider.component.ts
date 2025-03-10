import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StorageService } from '../../services/storage.service';
import { OnboardComponent } from './onboard/onboard.component';

@Component({
  selector: 'app-provider',
  imports: [
    RouterOutlet,
    CommonModule,
    NavbarComponent,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './provider.component.html',
  styleUrl: './provider.component.css'
})
export class ProviderComponent {
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private router = inject(Router)
  private storageService = inject(StorageService)
  
  @ViewChild('onboard') onboard: ElementRef;
  @ViewChild("profile") profile: ElementRef;
  @ViewChild("schedule") schedule: ElementRef;
  @ViewChild("services") services: ElementRef;
  @ViewChild("discounts") discounts: ElementRef;
  @ViewChild("reviews") reviews: ElementRef;
  @ViewChild("billing") billing: ElementRef;
  @ViewChild("branding") branding: ElementRef;
  @ViewChild("domain") domain: ElementRef;

  providerId: string
  enabled: boolean
  submitted: boolean

  constructor() {
    this.providerId = this.storageService.getProviderID()
    this.onboard = {} as ElementRef
    this.profile = {} as ElementRef
    this.schedule = {} as ElementRef
    this.services = {} as ElementRef
    this.discounts = {} as ElementRef
    this.reviews = {} as ElementRef
    this.billing = {} as ElementRef
    this.branding = {} as ElementRef
    this.domain = {} as ElementRef
    this.enabled = false
    this.submitted = false
  }

  ngOnInit(): void {
    this.route.data
      .subscribe(({status}) => {
        this.enabled = status.enabled
        this.submitted = status.submitted
        if (!status.enabled || !status.submitted) {
          this.router.navigate(['./onboard'], {relativeTo:this.route})
        }
      })
  }

  ngAfterViewInit(): void {
    this.route.children[0].url.subscribe((segments)=>{
      if(!segments.length) {
        this.profile.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
      } else {
        if(segments[0].path === "schedule") {
          this.schedule.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
        } else if (segments[0].path === "services") {
          this.services.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
        } else if (segments[0].path === "discounts") {
          this.discounts.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
        } else if (segments[0].path === "reviews") {
          this.reviews.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
        } else if (segments[0].path === "billing") {
          this.billing.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
        } else if (segments[0].path === "branding") {
          this.branding.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
        } else if (segments[0].path === "onboard") {
          if(this.enabled && this.submitted) {
            this.router.navigate(['./'], {relativeTo: this.route})
          }
        } else if (segments[0].path === "domain") {
          this.domain.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }
    })
  }

  onStatusUpdate(componentRef: any) {
    if (!(componentRef instanceof OnboardComponent)) {
      return
    }
    const child : OnboardComponent  = componentRef
    child.statusUpdate
      .subscribe(({enabled, submitted}) => {
        this.enabled = enabled
        this.submitted = submitted
      })
  }

  stripeLogin() {
    this.httpService.getStripeLoginLink(this.providerId).subscribe((resp: any) => {
      location.href = resp.url
    })
  }
}
