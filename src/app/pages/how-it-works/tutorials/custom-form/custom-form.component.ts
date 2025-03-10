import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as introJs from 'intro.js/intro.js';
import { ServiceComponent } from '../service/service.component';

@Component({
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.css']
})
export class CustomFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("service") service: ServiceComponent
  introJS:any;

  constructor() {
    this.service = {} as ServiceComponent
    this.introJS = introJs()
    // this.introJS.setOptions({
    //     steps:[
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         intro: 'So you want to understand how to list a new service? Don\'t worry I\'ll walk you through this process.'
    //       },
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         element:"#step1",
    //         intro: 'You can add images to give a preview of the service.',
    //         position: 'bottom'
    //       },
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         element:"#step3",
    //         intro: 'Select a category that best suits the service you provide.',
    //         position: 'bottom'
    //       },
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         element:"#step4",
    //         intro: 'Select a sub-category that best suits the service you provide.',
    //         position: 'bottom'
    //       },
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         element:"#step5",
    //         intro: 'This allows you to list a service only in select areas. <a href="/#/service-areas">Click here to learn more.</a>',
    //         position: 'bottom'
    //       },
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         element:"#step6",
    //         intro: 'Here you will provide a title for your service. Try to keep it short and sweet.',
    //         position: 'bottom'
    //       },
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         element:"#step7",
    //         intro: 'A description about the service that can go on an on an on...you get the point.',
    //         position: 'bottom'
    //       },
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         element:"#step8",
    //         intro: 'Add what the service includes so there\'s no confusion.',
    //         position: 'bottom'
    //       },
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         element:"#step9",
    //         intro: 'Or you can add what it excludes.',
    //         position: 'bottom'
    //       },
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         element:"#step10",
    //         intro: 'The price of your service per time slot. It can be free!',
    //         position: 'bottom'
    //       },
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         element:"#step11",
    //         intro: 'You could make this a subscription service if you wanted. <a href="/#/subscriptions">Click here to learn more.</a>',
    //         position: 'bottom'
    //       },
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         element:"#step12",
    //         intro: 'Creating a schedule provides your availability allowing customers to book one or more time slots. <a href="/#/scheduling">Click here to learn more.</a>',
    //         position: 'bottom'
    //       },
    //       {
    //         title: '<img width="25" src="assets/images/icon.png">',
    //         element:"#step13",
    //         intro: 'Whew, that was kind of long but we are done and can finally list our service',
    //         position: 'bottom'
    //       }
    //     ],
    //     showProgress:true
    // })
  }

  ngOnInit(): void {
    this.introJS.start();
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
    this.service.openCustomFormModal()
  }
}
