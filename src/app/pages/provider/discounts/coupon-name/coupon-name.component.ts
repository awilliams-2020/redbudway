import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, ElementRef, inject, Input, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../services/http.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-coupon-name',
  imports: [CommonModule, FormsModule, NgbAlert],
  templateUrl: './coupon-name.component.html',
  styleUrls: ['./coupon-name.component.css']
})
export class CouponNameComponent {
  private httpService = inject(HttpService)
  public activeModal = inject(NgbActiveModal)
  private renderer = inject(Renderer2)
  private platformLocation = inject(PlatformLocation)

  @ViewChild('nf') nf: ElementRef;
  @Input() coupon: any
  @Input() tradespersonId: string

  error:boolean
  isDisabled: boolean

  constructor() {
    this.platformLocation.onPopState(() => this.activeModal.close());
    this.nf = {} as ElementRef
    this.tradespersonId = ''
    this.error = false
    this.isDisabled = false
  }

  update(nameForm:any) {
    this.renderer.addClass(this.nf.nativeElement, 'was-validated');
    if (nameForm.form.status === 'VALID') {
      this.isDisabled = true;
      this.httpService.updateCoupon(this.tradespersonId, this.coupon.id, nameForm.form.value.name, this.coupon.services)
        .subscribe((resp: any) => {
          if (resp.updated) {
            this.activeModal.close(nameForm.form.value.name)
          } else {
            this.isDisabled = false
            this.error = true
          }
        })
    }
  }
}
