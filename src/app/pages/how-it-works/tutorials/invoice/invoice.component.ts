import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as introJs from 'intro.js/intro.js';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit, OnDestroy, AfterViewInit {

  tradespersonId: any
  invoiceId: any
  invoice: any
  introJS: any
  deleteSent: boolean
  voidSent: boolean
  uncollectSent: boolean
  finalizeSent: boolean

  constructor(private router: Router, private modalService: NgbModal) {
    this.deleteSent = false
    this.voidSent = false
    this.uncollectSent = false
    this.finalizeSent = false
    this.invoice = {
      created: new Date(),
      description: '',
      timeSlot: {
        startTime: new Date(),
        endTime: new Date()
      },
      total: "100.00",
      status: 'draft',
      customer: {
        name: 'John Doe',
        email: 'service@redbudway.com',
        phone: '123-456-67890',
        address: {
          line1: '123 Some St.',
          line2: '',
          state: 'State',
          city: 'City',
          postal_code: '12345'
        }
      },
      number: "b54f7b7ebe7c0aa50983f2c7736cad55",
      service: {
        title: '1 Acre Mow',
        description: 'On a regularly scheduled, weekly basis, we tend your lawn with properly trained personnel, and appropriate and well-maintained equipment.  This service includes weekly mowing and trimming of all grass areas as well as edging along concrete walks, driveways, and patios every two weeks.  Of course, we thoroughly clean up the debris we cause and take the grass clippings with us.'
      }
    }

    this.introJS = introJs()
    this.introJS.setOptions({
      steps: [
        {
          title: '<img width="25" src="assets/images/icon.png">',
          intro: 'When a customer books a time slot, an invoice is generated. The invoice will be in <b class="text-warning">draft</b> status until it\'s sent out.'
        },
        {
          title: '<img width="25" src="assets/images/icon.png">',
          element: '#memo',
          intro: 'Add a memo (note) for the customer.',
          position: 'left'
        },
        {
          title: '<img width="25" src="assets/images/icon.png">',
          element: '#draft',
          intro: 'Delete or send the invoice out.',
          position: 'top'
        }
      ],
      showProgress: true
    })
  }

  ngOnInit(): void {
    this.introJS.start()
  }

  ngOnDestroy():void {
    this.introJS.exit()
  }

  ngAfterViewInit(): void {
    window.scrollTo({
      top:0,
      left:0,
      behavior:'smooth'
    })
  }

  addDescription(){
    const modalRef = this.modalService.open(DescriptionComponent, { centered: true });
    modalRef.componentInstance.description = this.invoice.description
    modalRef.result.then((description: string) => {
      this.invoice.description = description
    })
  }

  deleteInvoice() {
    this.router.navigateByUrl('/')
  }

  finalizeInvoice() {
    this.finalizeSent = true
    this.invoice.status = 'open'
    this.introJS.exit()
    this.introJS.setOptions({
      steps: [
        {
          title: '<img width="25" src="assets/images/icon.png">',
          intro: 'Once the invoice has been sent, status updates to <b class="text-primary">open</b> and you have two options; <b class="text-secondary">void</b> or mark it as <b class="text-danger">uncollectible</b>.',
        }
      ],
      showProgress: true
    })
    this.introJS.start()
    window.scrollTo({
      top:0,
      left:0,
      behavior:'smooth'
    });
  }

  voidInvoice() {
    this.voidSent = true
    this.invoice.status = 'void'
  }

  markInvoiceUncollectible() {
    this.uncollectSent = true
    this.invoice.status = 'uncollectible'
  }

  close() {
    this.router.navigateByUrl("/")
  }
}
