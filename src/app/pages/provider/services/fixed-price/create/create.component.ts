import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'angular-calendar';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from '../../../../../services/http.service';
import { ImageService } from '../../../../../services/image.service';
import { ToastService } from '../../../../../services/toast.service';
import { CategoryService } from '../../../../../services/category.service';
import { StorageService } from '../../../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../../../../icons/icons.module';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../../../../components/toast/toast.component';
import { CropperComponent } from '../../../../../modals/cropper/cropper.component';
import { ContinueComponent } from '../../../../../modals/continue/continue.component';
import { ServiceScheduleComponent } from '../../../../../modals/service-schedule/service-schedule.component';
import { CustomFormComponent } from '../../../../../modals/custom-form/custom-form.component';
import { TimezoneComponent } from '../../../../../modals/timezone/timezone.component';
import { StateCitiesComponent } from '../../../../../modals/state-cities/state-cities.component';

interface TimeSlot { 
  startTime: Date,
  endTime: string,
  bookings: number
}

interface CustomField {
  field: string,
  value: string,
  error: string,
}

@Component({
  selector: 'app-create',
  imports: [CommonModule, IconsModule, FormsModule, ToastComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  private categoryService = inject(CategoryService)
  private storageService = inject(StorageService)
  private renderer = inject(Renderer2)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private modalService = inject(NgbModal)
  private httpService = inject(HttpService)
  private imageService = inject(ImageService)
  private toastService = inject(ToastService)

  @ViewChild('pf') pf: ElementRef;
  @ViewChild("selectPlacesElement") selectPlacesElement: ElementRef
  @ViewChild("input") input: ElementRef
  
  providerId: string
  images: any
  title: string
  description: string
  price: string
  selectPlaces: boolean
  statesAndCitiesMap: Map<string, []>
  selectPlacesError: boolean
  timeSlots: TimeSlot[]
  subscription: boolean
  interval: string
  oldInterval: string
  category: string
  subCategory: string
  categories: any[]
  subCategories: any[]
  specialties: string[]
  selectedSpecialties:string[]
  otherServices: any[]
  dataLoading:boolean
  sent:boolean
  googleTimeSlots:any[]
  calendarEvents: CalendarEvent[]
  gCalendarEvents: CalendarEvent[]

  includes: string[]
  excludes: string[]
  include: string
  exclude: string
  useTimeZone: boolean
  form: CustomField[][]
  timeZone: string

  constructor() {
    this.providerId = this.storageService.getProviderID()
    this.input = {} as ElementRef
    this.pf = {} as ElementRef
    this.selectPlacesElement = {} as ElementRef
    
    this.selectPlaces = false
    this.selectPlacesError = false
    this.statesAndCitiesMap = new Map()

    this.images = []
    this.title = ''
    this.description = ''
    this.price = ''
    this.timeSlots = []
    this.subscription = false
    this.interval = ''
    this.oldInterval = ''

    this.category = ""
    this.subCategory = ""
    this.categories = this.categoryService.getCategories()
    this.subCategories = []
    this.specialties = []
    this.selectedSpecialties = []
    this.otherServices = []
    this.dataLoading = true
    this.sent = false

    this.googleTimeSlots = []
    this.calendarEvents = []
    this.gCalendarEvents = []

    this.includes = []
    this.excludes = []
    this.include = ''
    this.exclude = ''

    this.form = []
    this.useTimeZone = true
    this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  ngOnInit(): void {
    this.preLoadEvents()
    this.imageService.isErrors().subscribe((error:boolean)=>{
      if(error) {
        this.toastService.show(this.imageService.getErrorMsg(), {classname: 'bg-danger text-light', delay: 15000})
      }
    })
    // this.httpService.getOtherServices(this.providerId)
    //   .subscribe((resp:any)=>{
    //     this.otherServices = resp.otherServices
    //     this.googleTimeSlots = resp.googleTimeSlots
    //     this.preLoadEvents()
    //     this.dataLoading = false
    //     this.pageLoader.hide()
    //   })
    this.httpService.getProfileSettings(this.providerId)
      .subscribe((settings: any) => {
        if(settings.timeZone) {
          this.timeZone = settings.timeZone
        }
      })
  }

  preLoadEvents() {
    this.dataLoading= false
    // if (typeof Worker !== 'undefined') {
    //   const worker = new Worker(new URL('../schedule.worker', import.meta.url));
    //   worker.onmessage = ({ data }) => {
    //     this.dataLoading= false
    //     this.calendarEvents = data.calendarEvents
    //     this.gCalendarEvents = data.gCalendarEvents
    //     this.timeSlots = data.timeSlots
    //     this.otherServices = data.otherServices
    //   };
    //   worker.postMessage({
    //     timeSlots:this.timeSlots,
    //     googleTimeSlots:this.googleTimeSlots,
    //     otherServices:this.otherServices,
    //     subscription:this.subscription,
    //     interval:this.interval
    //   });
    // }
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
        this.subCategories = category.subCategories
        this.specialties = []
        this.selectedSpecialties = []
      }
    }
  }

  selectFilters() {
    for (let subCategory of this.subCategories) {
      if (this.subCategory === subCategory.subCategory) {
        this.specialties = subCategory.specialties
        this.selectedSpecialties = []
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

  selectPlacesUpdate(selectPlaces:boolean) {
    if(this.selectPlaces) {
      this.openAreasModal()
    } else {
      this.clearCityMap(selectPlaces)
    }
  }

  clearCityMap(selectPlaces:boolean) {
    if (this.statesAndCitiesMap.size) {
      const modalRef = this.modalService.open(ContinueComponent, { centered: true });
      modalRef.componentInstance.message = 'This will clear the selections you\'ve made?'
      modalRef.result.then(() => {
        this.selectPlacesError = false
        this.selectPlacesElement.nativeElement.setCustomValidity("")
        this.statesAndCitiesMap = new Map()
      }, () => {
        this.selectPlaces = !selectPlaces
      })
    } else {
      this.selectPlacesError = false
      this.selectPlacesElement.nativeElement.setCustomValidity("")
      this.statesAndCitiesMap = new Map()
    }
  }

  openAreasModal() {
    const modalRef = this.modalService.open(StateCitiesComponent, { centered: true });
    modalRef.componentInstance.statesAndCitiesMap = this.statesAndCitiesMap
    modalRef.result.then((statesAndCitiesMap: Map<string, []>) => {
      this.statesAndCitiesMap = statesAndCitiesMap
      let notExist = this.cityMapError()
      if (this.statesAndCitiesMap.size !== 0 || !notExist) {
        this.selectPlacesError = false
      }
    }, ()=>{})
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

  openScheduleModal() {
    const modalRef = this.modalService.open(ServiceScheduleComponent, { centered: true, scrollable:true, fullscreen: 'sm', size: 'lg', modalDialogClass:'h-auto' });
    modalRef.componentInstance._calendarEvents = this.calendarEvents  
    modalRef.componentInstance._gCalendarEvents = this.gCalendarEvents  
    modalRef.componentInstance.googleTimeSlots = this.googleTimeSlots    
    modalRef.componentInstance.otherServices = this.otherServices
    modalRef.componentInstance.timeSlots = this.timeSlots
    modalRef.componentInstance.subscription = this.subscription
    modalRef.componentInstance.interval = this.interval
    modalRef.componentInstance.providerId = this.providerId
    modalRef.componentInstance.timeZone = this.useTimeZone? this.timeZone:''
    modalRef.result.then((timeSlots: TimeSlot[]) => {
      if(Array.isArray(timeSlots)){
        this.timeSlots = timeSlots
        this.dataLoading = true
        this.preLoadEvents()
      }
    }, () => {
      this.dataLoading = true
      this.preLoadEvents()
    })
  }

  openCustomFormModal(){
    const modalRef = this.modalService.open(CustomFormComponent, { centered: true });
    modalRef.componentInstance.form = this.form
    modalRef.componentInstance.create = !this.form.length
    modalRef.result.then((form:CustomField[][]) => {
      this.form = form
    }, () => {})
  }

  updateTimeZone(){
    const modalRef = this.modalService.open(TimezoneComponent, { centered: true });
    modalRef.componentInstance.timeZone = this.timeZone
    modalRef.componentInstance.providerId = this.providerId
    modalRef.result.then((timeZone) => {
      this.timeZone = timeZone
    }, () => {})
  }

  updateSubscription(subscription: boolean) {
    if (this.timeSlots.length) {
      const modalRef = this.modalService.open(ContinueComponent, { centered: true });
      modalRef.componentInstance.message = 'This will clear the schedule you\'ve made?'
      modalRef.result.then(() => {
        this.timeSlots = []
        this.calendarEvents = []
        this.interval = ''
      }, () => {
        this.subscription = !subscription
      })
    } else {
      this.interval = ''
    }
  }

  updateInterval($event: any) {
    if (this.timeSlots.length) {
      const modalRef = this.modalService.open(ContinueComponent, { centered: true });
      modalRef.componentInstance.message = 'This will clear the schedule you\'ve made?'
      modalRef.result.then(() => {
        this.timeSlots = []
        this.calendarEvents = []
      }, () => {
        this.interval = this.oldInterval
      })
    } else {
      this.oldInterval = $event.target.value
    }
  }

  close() {
    this.router.navigate(['../'], {relativeTo:this.route})
  }

  toLocaleString() {
    let timeSlots = []
    for (let timeSlot of this.timeSlots) {
      timeSlots.push({
        startTime: timeSlot.startTime.toLocaleString(),
        endTime: timeSlot.endTime.toLocaleString(),
        bookings: timeSlot.bookings
      })
    }
    return timeSlots
  }

  create(productForm: any) {
    this.renderer.addClass(this.pf.nativeElement, 'was-validated');
    if (this.selectPlaces) {
      if (this.cityMapError() || this.statesAndCitiesMap.size === 0) {
        this.selectPlacesError = true
        this.selectPlacesElement.nativeElement.setCustomValidity("error")
      }
    }
    if (productForm.form.status === 'VALID' && !this.selectPlacesError) {
      this.sent = true
      this.renderer.removeClass(this.pf.nativeElement, 'was-validated');
      let statesAndCitiesJson = Array.from(this.statesAndCitiesMap, ([state, cities]) => ({ state, cities }))
      let request = {
        category: this.category,
        subcategory: this.subCategory,
        statesAndCities: statesAndCitiesJson,
        title: this.title,
        description: this.description,
        images: this.images,
        price: this.price,
        subscription: this.subscription,
        interval: this.interval,
        timeSlots: this.toLocaleString(),
        selectPlaces: this.selectPlaces,
        specialties: this.selectedSpecialties,
        includes: this.includes,
        excludes: this.excludes,
        form:this.form,
        timeZone:this.useTimeZone
      }
      this.httpService.createPrice(request, this.providerId).subscribe((resp: any) => {
        if(resp.created){
          this.router.navigate(['../'], {relativeTo:this.route})
        } else {
          this.sent = false
          this.toastService.show('Failed to create service', {classname: 'bg-danger text-light', delay: 15000})
        }
      })
    }
  }
}
