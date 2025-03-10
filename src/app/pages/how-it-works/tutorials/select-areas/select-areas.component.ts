import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as introJs from 'intro.js/intro.js';
import { ServiceComponent } from '../service/service.component';

@Component({
  selector: 'app-select-areas',
  templateUrl: './select-areas.component.html',
  styleUrls: ['./select-areas.component.css']
})
export class SelectAreasComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('service') service: ServiceComponent
  introJS:any;
  statesAndCitiesMap: Map<string, []>

  constructor() {
    this.service = {} as ServiceComponent
    this.statesAndCitiesMap = new Map()
    this.statesAndCitiesMap.set('Ohio', [])
    this.introJS = introJs()
    this.introJS.setOptions({
        steps:[
          {
            title: '<img width="25" src="assets/images/icon.png">',
            intro: 'Welcome. Let us discuss limiting services to select areas.'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#states",
            intro: 'Select the states where your services are provided. We\'ve selected the great state of Ohio for you 😉',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#cities",
            intro: 'Now filter which cities within those states you\'re focused on.',
            position: 'bottom'
          },
          {
            title: '<img width="25" src="assets/images/icon.png">',
            element:"#save",
            intro: 'Finally, hit save, then continue on creating or updating your service.',
            position: 'bottom'
          }
        ],
        showProgress:true
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    window.scrollTo({
      top:0,
      left:0,
      behavior:'smooth'
    })
    this.service.openAreasModal()
    this.introJS.start();
  }

  ngOnDestroy():void {
    this.introJS.exit()
  }

}
