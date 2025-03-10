import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as introJs from 'intro.js/intro.js';


@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit, OnDestroy, AfterViewInit {
  introJS: any

  customerId: any
  quoteId: any
  total: string
  quote: any
  acceptSent: boolean

  constructor(private router: Router) {
    this.acceptSent = false
    this.total = '377.76'
    let today = new Date()
    this.quote = {
      created: today,
      status: 'open',
      provider: { name: 'Redbud Way', email: 'service@redbudway.com' },
      number: '123-456-7890',
      service: { 
        title: 'A custom service',
        description: 'This is a custom service so a quote is necessary. A service that can be varying in cost.',
        products: [
          {
            title: 'Item 1',
            price: '250.99',
            quantity: 1
          },
          {
            title: 'Item 2',
            price: '43.00',
            quantity: 2
          },
          {
            title: 'Item 3',
            price: '13.59',
            quantity: 3
          }
        ]
      },
      description: 'Thanks for choosing Redbud Way',
      expires: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7, today.getHours(), today.getMinutes(), today.getSeconds()),
      request: 'Hi, I was looking to get something custom done. I have a picture in mind and budget to stick to. Thanks, Customer',
      invoiceId: 'in_1MDLQNAVHmrwEc5EYzn8Pnts',
    }

    this.introJS = introJs()
    this.introJS.setOptions({
      steps: [
        {
          title: '<img width="25" src="assets/images/icon.png">',
          intro: 'So you have received the quote you requested. Now what?'
        },
        {
          title: '<img width="25" src="assets/images/icon.png">',
          element: '#status',
          intro: 'This quote is currently in an <b class="text-primary">open</b> status.',
          position: 'top'
        },
        {
          title: '<img width="25" src="assets/images/icon.png">',
          element: '#provider',
          intro: 'Here\'s the provider info incase you would like to discuss the quote',
          position: 'top'
        },
        {
          title: '<img width="25" src="assets/images/icon.png">',
          element: '#service',
          intro: 'The service that you\'ve requested a quote for.',
          position: 'top'
        },
        {
          title: '<img width="25" src="assets/images/icon.png">',
          element: '#request',
          intro: 'The request you have made about the service.',
          position: 'top'
        },
        {
          title: '<img width="25" src="assets/images/icon.png">',
          element: '#cost',
          intro: 'This is the quoted cost associated with your request.',
          position: 'top'
        },
        {
          title: '<img width="25" src="assets/images/icon.png">',
          element: '#accept',
          intro: 'If everything looks right then you can simply accept the quote.',
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

  acceptQuote() {
    this.acceptSent = true
    this.router.navigateByUrl("/")
  }

  close() {
    this.router.navigateByUrl("/")
  }
}
