import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateComponent } from '../../../provider/services/fixed-price/create/create.component';
import { NavbarComponent } from '../../../../components/navbar/navbar.component';
declare var introJs: any;

@Component({
  selector: 'app-list-service',
  imports: [CreateComponent, NavbarComponent],
  templateUrl: './list-service.component.html',
  styleUrls: ['./list-service.component.css']
})
export class ListServiceComponent implements OnInit, OnDestroy {
  introJS: any = introJs()

  constructor() {
    this.introJS.setOptions({
        steps:[
          {
            title: '<img width="25" src="assets/images/icon.png">',
            intro: 'So you want to understand how to list a service? Don\'t worry I\'ll walk you through this process.'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#images",
            intro: 'You can add images to give a preview of the service.',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#category",
            intro: 'Select a category that best suits the service you provide.',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#selectAreas",
            intro: 'This allows you to list a service only in select areas. <a href="/#/service-areas">Click here to learn more.</a>',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#title",
            intro: 'Here you will provide a title for your service. Try to keep it short and sweet.',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#description",
            intro: 'A description about the service that can go on an on an on...you get the point.',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#include",
            intro: 'Add what the service includes so there\'s no confusion.',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#exclude",
            intro: 'Or you can add what it excludes.',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#price",
            intro: 'The price of your service per time slot. It can be free!',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#yesSubscription",
            intro: 'You could make this a subscription service if you wanted. <a href="/#/subscriptions">Click here to learn more.</a>',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#schedule",
            intro: 'Creating a schedule provides your availability allowing customers to book one or more time slots. <a href="/#/scheduling">Click here to learn more.</a>',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            intro: 'Whew, that was kind of long but we are done and can finally list our service',
            position: 'bottom'
          }
        ],
        showProgress:true
    })
  }

  ngOnInit(): void {
    this.introJS.start();
  }

  ngOnDestroy():void {
    this.introJS.exit()
  }
}
