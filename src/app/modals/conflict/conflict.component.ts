import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-conflict',
  imports: [CommonModule],
  templateUrl: './conflict.component.html',
  styleUrls: ['./conflict.component.css']
})
export class ConflictComponent implements OnInit {
  @Input() timeSlot:any

  constructor(public activeModal: NgbActiveModal, private router:Router, private location: PlatformLocation) {
    this.location.onPopState(() => this.activeModal.close());
  }

  ngOnInit(): void {
  }

  viewInvoice(invoiceId:string) {
    this.router.navigate(['/provider', 'billing', 'invoices', invoiceId])
    this.activeModal.close('change-route')
  }

  viewSubscriptions(customerId:string) {
    this.router.navigate(['/provider', 'billing', 'subscriptions', customerId])
    this.activeModal.close('change-route')
  }

}
