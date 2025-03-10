import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as introJs from 'intro.js/intro.js';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit, OnDestroy, AfterViewInit {
  introJS:any;
  subscription: string
  interval: string
  
  constructor() {
    this.subscription = "true"
    this.interval = "week"
    this.introJS = introJs()
    this.introJS.setOptions({
        steps:[
          {
            title: '<img width="25" src="assets/images/icon.png">',
            intro: 'Services can be recurring based on the subscription type you choose.'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#yesSubscription",
            intro: 'Select \'Yes\' to make the service a subscription.',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#subType",
            intro: 'Choose the subscription type that best fits.',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#schedule",
            intro: 'Create a recurring schedule for customers to choose from. <a href="/scheduling">Click here to learn more</a>',
            position: 'bottom'
          }
        ],
        showProgress:true
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

}
