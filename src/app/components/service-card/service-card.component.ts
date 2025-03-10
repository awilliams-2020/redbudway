import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from '../../icons/icons.module';

@Component({
  selector: 'app-service-card',
  imports: [CommonModule, NgbRating, IconsModule, RouterLink],
  templateUrl: './service-card.component.html',
  styleUrl: './service-card.component.css'
})
export class ServiceCardComponent {
  router = inject(Router)
  @Input() service: any
  @Input() link: any
  loading: boolean

  constructor() {
    this.loading = true
  }

  onLoad() {
    this.loading = false
  }

  viewProfile() {
    if(this.service.business.vanityURL) {
      this.router.navigate(["/business", this.service.business.vanityURL])
    } else if(this.service.tradespersonId) {
      this.router.navigate(["/business", this.service.tradespersonId])
    } else if(this.link.length) {
      this.router.navigate(this.link)
    }
  }
}
