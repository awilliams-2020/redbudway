import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../services/http.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coupon-services',
  imports: [CommonModule, FormsModule, NgbAlert],
  templateUrl: './coupon-services.component.html',
  styleUrls: ['./coupon-services.component.css']
})
export class CouponServicesComponent implements OnInit {
  private platformLocation = inject(PlatformLocation)
  private httpService = inject(HttpService)
  public activeModal = inject(NgbActiveModal)
  private renderer = inject(Renderer2)

  @ViewChild('sf') sf: ElementRef;
  @Input() coupon: any
  @Input() providerId: string

  services: any[]
  error: boolean
  isDisabled: boolean

  constructor() {
    this.platformLocation.onPopState(() => this.activeModal.close());
    this.sf = {} as ElementRef
    this.services = []
    this.providerId = ''
    this.error = false
    this.isDisabled = false
  }

  ngOnInit() {
    this.getServices()
  }

  getServices() {
    this.httpService.getServices(this.providerId)
      .subscribe((services: any) => {
        this.services = services
      })
  }

  update(servicesForm: any) {
    this.renderer.addClass(this.sf.nativeElement, 'was-validated');
    if (servicesForm.form.status === 'VALID') {
      this.isDisabled = true;
      this.httpService.updateCoupon(this.providerId, this.coupon.id, this.coupon.name, servicesForm.form.value.services)
        .subscribe((resp: any) => {
          if (resp.updated) {
            this.activeModal.close(servicesForm.form.value.services)
          } else {
            this.isDisabled = false
            this.error = true
          }
        })
    }
  }
}
