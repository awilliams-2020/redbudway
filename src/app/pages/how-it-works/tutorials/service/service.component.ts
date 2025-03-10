import { AfterViewInit, Component, ElementRef, Input, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as introJs from 'intro.js/intro.js';

interface TimeSlot { 
  startTime: Date,
  endTime: string,
  bookings: number,
  taken: any,
  takenBy: any,
  field: string
}

interface CustomField {
  field: string,
  value: string,
  error: string,
}
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sf') sf: ElementRef;
  @ViewChild("selectPlacesElement") selectPlacesElement: ElementRef
  @ViewChild("input") input: ElementRef
  introJS:any;
  images: any
  title: string
  description: string
  price: string
  selectPlaces: string
  @Input() statesAndCitiesMap: Map<string, []>
  selectPlacesError: boolean
  @Input() timeSlots: TimeSlot[]
  @Input() subscription: string
  @Input() interval: string
  oldInterval: string
  specialties: string[]
  selectedFilters:string[]
  category: string
  subCategory: string
  categories: any[]
  subCategories: any[]
  includes: string[]
  excludes: string[]
  include: string
  exclude: string
  form: CustomField[][]

  @Input() today:Date
  @Input() tomorrow:Date
  @Input() dayAfterTomorrow:Date
 
  constructor(private modalService: NgbModal, private renderer:Renderer2, private router:Router, private imageService:ImageService) {
    this.introJS = introJs()
    this.today = new Date()
    this.tomorrow = this.today
    this.dayAfterTomorrow = this.today
    this.input = {} as ElementRef
    this.sf = {} as ElementRef
    this.selectPlacesElement = {} as ElementRef

    this.selectPlaces = "false"
    this.selectPlacesError = false
    this.statesAndCitiesMap = new Map()

    this.images = []
    this.title = ''
    this.description = ''
    this.price = ''
    this.timeSlots = []
    this.subscription = "false"
    this.interval = ""
    this.oldInterval = ''

    this.specialties = []
    this.selectedFilters = []
    this.category = ""
    this.subCategory = ""
    this.categories = PHYSICAL_SERVICES
    this.subCategories = []

    this.includes = []
    this.excludes = []
    this.include = ''
    this.exclude = ''

    this.form = []
  }

  ngAfterViewInit(): void {
    window.scrollTo({
      top:0,
      left:0,
      behavior:'smooth'
    })
  }

  ngOnDestroy(): void {
    this.introJS.exit()
  }

  openFileExplorer() {
    this.input.nativeElement.click()
  }

  addImage($event: any) {
    const modalRef = this.modalService.open(CropperComponent, { centered: true });
    modalRef.componentInstance.image = $event
    modalRef.result.then((image:string)=>{
      this.images = this.imageService.addImage(image, this.images)
    }, ()=>{})
  }

  removeImage(index: number) {
    this.images.splice(index, 1)
    let item = document.getElementsByClassName("carousel-item")[0]
    if (!item.classList.contains('active')) {
      this.renderer.addClass(item, 'active')
    }
  }

  selectSubCategories() {
    for (let category of this.categories) {
      if (this.category === category.category) {
        this.subCategory = ''
        this.subCategories = category.subCategories
      }
    }
  }

  selectFilters() {
    for (let subCategory of this.subCategories) {
      if (this.subCategory === subCategory.subCategory) {
        this.specialties = subCategory.specialties
        this.selectedFilters = []
      }
    }
  }

  addInclude() {
    if(this.include !== '') {
      this.includes.push(this.include)
      this.include = ''
    }
  }
  
  removeInclude(index:number) {
    this.includes.splice(index, 1)
  }

  addExclude() {
    if(this.exclude !== '') {
      this.excludes.push(this.exclude)
      this.exclude = ''
    }
  }
  
  removeExclude(index:number) {
    this.excludes.splice(index, 1)
  }

  openAreasModal() {
    const modalRef = this.modalService.open(StateCitiesComponent, { centered: true });
    modalRef.componentInstance.statesAndCities = STATESANDCITIES
    modalRef.componentInstance.statesAndCitiesMap = this.statesAndCitiesMap
    modalRef.result.then((statesAndCitiesMap: Map<string, []>) => {
      this.statesAndCitiesMap = statesAndCitiesMap
      let notExist = this.cityMapError()
      if (this.statesAndCitiesMap.size !== 0 || !notExist) {
        this.selectPlacesError = false
      }
    }, ()=>{})
  }

  clearCityMap() {
    this.selectPlacesError = false
    this.selectPlacesElement.nativeElement.setCustomValidity("")
    this.statesAndCitiesMap = new Map()
  }
  
  cityMapError(): boolean {
    let notExist = false
    this.statesAndCitiesMap.forEach((value, key) => {
      if(value === undefined){
        notExist = true
      } else if(value.length == 0) {
        notExist = true
      }
    })
    return notExist
  }

  openCustomFormModal(){
    const modalRef = this.modalService.open(FormComponent, { centered: true });
    modalRef.componentInstance.form = this.form
    modalRef.componentInstance.create = !this.form.length
    modalRef.result.then((form:CustomField[][]) => {
      this.form = form
    }, () => {})
  }

  updateSubscription($event: any) {
    if (this.timeSlots.length !== 0) {
      const modalRef = this.modalService.open(ContinueComponent, { centered: true });
      modalRef.componentInstance.message = 'Whoa there...slow down. This will clear the schedule you\'ve made?'
      modalRef.result.then(() => {
        this.timeSlots = []
        this.interval = $event.target.value === 'true' ? 'week' : ''
      }, () => {
        this.subscription = $event.target.value === 'true' ? 'false' : 'true'
      })
    } else {
      this.interval = $event.target.value === 'true' ? 'week' : ''
    }
  }

  updateInterval($event: any) {
    if (this.timeSlots.length !== 0) {
      const modalRef = this.modalService.open(ContinueComponent, { centered: true });
      modalRef.componentInstance.message = 'Whoa there...slow down. This will clear the schedule you\'ve made?'
      modalRef.result.then((result: any) => {
        this.timeSlots = []
      }, (reason: any) => {
        this.interval = this.oldInterval
      })
    } else {
      this.oldInterval = $event.target.value
    }
  }

  getDayOfWeek(day:number) {
    let weekDay: string = ""
    if (day === 0) {
      weekDay = "Sunday"
    } else if (day === 1) {
      weekDay = "Monday"
    } else if (day === 2) {
      weekDay = "Tuesday"
    } else if (day === 3) {
      weekDay = "Wednessday"
    } else if (day === 4) {
      weekDay = "Thursday"
    } else if (day === 5) {
      weekDay = "Friday"
    } else if (day === 6) {
      weekDay = "Saturday"
    }
    return weekDay
  }

  openScheduleModal() {
    const modalRef = this.modalService.open(ServiceScheduleComponent, { centered: true });
    modalRef.componentInstance.timeSlots = this.timeSlots
    modalRef.componentInstance.subscription = this.subscription === 'true'? 1:0
    modalRef.componentInstance.interval = this.interval
    modalRef.shown.subscribe(() => {
      if(this.timeSlots.length !== 0){
        let timeSlotOne = document.getElementsByClassName('cal-event-container')[0]
        let timeSlotTwo = document.getElementsByClassName('cal-event-container')[1]
        let timeSlotThree = document.getElementsByClassName('cal-event-container')[2]
        if(this.getDayOfWeek(this.today.getDay()) === "Friday"){
          timeSlotOne = document.getElementsByClassName('cal-event-container')[1]
          timeSlotTwo = document.getElementsByClassName('cal-event-container')[2]
          timeSlotThree = document.getElementsByClassName('cal-event-container')[0]
        } else if (this.getDayOfWeek(this.today.getDay()) === "Saturday") {
          timeSlotOne = document.getElementsByClassName('cal-event-container')[2]
          timeSlotTwo = document.getElementsByClassName('cal-event-container')[0]
          timeSlotThree = document.getElementsByClassName('cal-event-container')[1]
        }
        this.introJS.setOptions({
          steps: [
            {
              title: '<img width="25" src="assets/images/icon.png">',
              element: '#scheduling',
              intro: 'For this example we have a schedule that recurs weekly. Each time slot you create is bookable by a customer.'
            },
            {
              title: '<img width="25" src="assets/images/icon.png">',
              element: timeSlotOne,
              intro: "Here we have a time slot that recurs every <b>"+this.getDayOfWeek(this.today.getDay())+"</b>",
            },
            {
              title: '<img width="25" src="assets/images/icon.png">',
              element: timeSlotTwo,
              intro: "And another time slot that recurs every <b>"+this.getDayOfWeek(this.tomorrow.getDay())+"</b>",
            },
            {
              title: '<img width="25" src="assets/images/icon.png">',
              element: timeSlotThree,
              intro: "Finally a time slot that recurs every <b>"+this.getDayOfWeek(this.dayAfterTomorrow.getDay())+"</b>",
  
            },
            {
              title: '<img width="25" src="assets/images/icon.png">',
              intro: "Try it yourself by adding a few time slots or changing the subscription type.",
            },
  
          ],
          showProgress: true
        }).start()
      }
    })
    modalRef.result.then((timeSlots: TimeSlot[]) => {
      if(Array.isArray(timeSlots)){
        this.timeSlots = timeSlots
      }
    }, () => {})
  }

  startIntro() {

  }

  close() {
    this.router.navigateByUrl("/how-it-works")
  }

  create(serviceForm: any) {
    this.renderer.addClass(this.sf.nativeElement, 'was-validated');
    if (this.selectPlaces === "true") {
      if (this.cityMapError() || this.statesAndCitiesMap.size === 0) {
        this.selectPlacesError = true
        this.selectPlacesElement.nativeElement.setCustomValidity("error")
      }
    }
    if (serviceForm.form.status === 'VALID' && !this.selectPlacesError) {
      this.renderer.removeClass(this.sf.nativeElement, 'was-validated');
    }
  }
}
