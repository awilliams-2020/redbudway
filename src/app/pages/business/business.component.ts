import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../services/http.service';
import { ShareComponent } from '../../modals/share/share.component';
import { environment } from '../../../environments/environment';
import { IconsModule } from '../../icons/icons.module';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { cp } from 'fs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-business',
  imports: [CommonModule, IconsModule, ServiceCardComponent, NgbRating, NavbarComponent],
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent {
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private router = inject(Router)
  private modalService = inject(NgbModal)

  providerId: any
  loading: boolean
  provider: any
  quotes: any[]
  fixedPrices: any []
  rating: number
  url: string
  address: string = ''

  constructor() {
    this.providerId = ''
    this.loading = true
    this.provider = {}
    this.fixedPrices = []
    this.quotes = []
    this.rating = 0
    this.url = ''
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('providerId')) {
        this.providerId = params.get('providerId')
        this.getProfile()
        this.getFixedPrices()
        this.getQuotes()
      }
    })
  }

  onLoad() {
    this.loading = false
  }

  getProfile() {
    this.httpService.getPublicProfile(this.providerId)
      .subscribe((profile: any) => {
        if(profile.name){
          this.url = `https://${environment.host}/business/${this.providerId}`
          this.provider = profile
          this.address = profile.address.lineOne+", "+(profile.address.lineTwo? profile.address.lineTwo+", ":"")+profile.address.city+", "+profile.address.state+", "+profile.address.zipCode
          this.provider.image = this.provider.image === "" ? "assets/images/placeholder.svg" : this.provider.image
        } else {
          this.router.navigateByUrl('/')
        }
      })
  }

  getFixedPrices() {
    this.httpService.getProfileFixedPrices(this.providerId)
      .subscribe((fixedPrices: any) => {
        this.fixedPrices = fixedPrices
      })
  }

  getQuotes() {
    this.httpService.getProfileQuotes(this.providerId)
      .subscribe((quotes: any) => {
        this.quotes = quotes
      })
  }

  share() {
    const modalRef = this.modalService.open(ShareComponent, { centered: true });
    modalRef.componentInstance.url = this.url
    modalRef.componentInstance.title = this.provider.name
  }

  close() {
    this.router.navigate(['/fixed-prices'])
  }
}
