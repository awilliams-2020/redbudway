import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'angular-calendar';
import { HttpService } from '../../../../../services/http.service';
import { ImageService } from '../../../../../services/image.service';
import { ToastService } from '../../../../../services/toast.service';
import { CategoryService } from '../../../../../services/category.service';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../../../../../icons/icons.module';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../../../services/storage.service';
import { ToastComponent } from '../../../../../components/toast/toast.component';
import { CropperComponent } from '../../../../../modals/cropper/cropper.component';
import { TimezoneComponent } from '../../../../../modals/timezone/timezone.component';
import { ContinueComponent } from '../../../../../modals/continue/continue.component';
import { StateCitiesComponent } from '../../../../../modals/state-cities/state-cities.component';
import { ServiceScheduleComponent } from '../../../../../modals/service-schedule/service-schedule.component';
import { CustomFormComponent } from '../../../../../modals/custom-form/custom-form.component';

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
  selector: 'app-update',
  imports: [CommonModule, IconsModule, FormsModule, ToastComponent],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent {
  private route = inject(ActivatedRoute)
  private renderer = inject(Renderer2)
  private router = inject(Router)
  private modalService = inject(NgbModal)
  private httpService = inject(HttpService)
  private imageService = inject(ImageService)
  private toastService = inject(ToastService)
  private storageService = inject(StorageService)
  private categoryService = inject(CategoryService)

  @ViewChild('pf') pf: ElementRef;
  @ViewChild("selectPlacesElement") selectPlacesElement: ElementRef
  @ViewChild("input") input: ElementRef

  loading: boolean
  providerId: string
  fixedPrice: any
  price: string
  statesAndCitiesMap: Map<string, []>
  selectPlacesError: boolean
  categories: any[]
  subCategories: any[]
  specialties: string[]
  priceId: any
  // otherServices: { subscription: number, interval: string, timeSlots: TimeSlot[] }[]
  dataLoading: boolean
  updateSent: boolean
  url: string
  googleTimeSlots:any[]
  calendarEvents: CalendarEvent[]
  gCalendarEvents: CalendarEvent[]
  include: string
  exclude: string
  availableSlots: number
  today: Date
  timeZone: string

  constructor() {
    this.providerId = this.storageService.getProviderID()
    this.pf = {} as ElementRef
    this.input = {} as ElementRef
    this.selectPlacesElement = {} as ElementRef
    this.loading = true
    this.selectPlacesError = false
    this.statesAndCitiesMap = new Map()
    this.price = ''
    this.categories = this.categoryService.getCategories()
    this.subCategories = []
    this.specialties = []
    this.priceId = ''
    // this.otherServices = []
    this.dataLoading = false
    this.updateSent = false
    this.url = ''
    this.googleTimeSlots = []
    this.calendarEvents = []
    this.gCalendarEvents = []
    this.include = ''
    this.exclude = ''
    this.availableSlots = 0
    this.today = new Date()
    this.today.setHours(24,0,0)
    this.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  ngOnInit(): void {
    this.imageService.isErrors().subscribe((error: boolean) => {
      if(error) {
        this.toastService.show(this.imageService.getErrorMsg(), {classname: 'bg-danger text-light', delay: 15000})
      }
    })
    this.route.paramMap
      .subscribe((params) => {
        this.priceId = params.get("priceId")
        this.getPrice()
        this.getTimeZone()
      })
  }

  getPrice() {
    this.httpService.getPrice(this.priceId, this.providerId).subscribe((resp: any) => {
      if (Object.keys(resp.fixedPrice).length !== 0) {
        this.url = 'https://redbudway.com/fixed-price/'+this.priceId
        this.fixedPrice = resp.fixedPrice
        this.selectSubCategories(this.fixedPrice.specialties)
        this.selectSpecialties(this.fixedPrice.specialties)
        this.statesAndCitiesMap = new Map(
          resp.fixedPrice.statesAndCities.map((object: any) => {
            return [object.state, object.cities];
          })
        )
        this.price = resp.fixedPrice.price.toFixed(2)
        // this.otherServices = resp.otherServices
        // this.googleTimeSlots = resp.googleTimeSlots
        this.preLoadEvents()
        this.loading = false
      } else {
        sessionStorage.clear()
        this.router.navigateByUrl('/session/provider-login')
      }
    })
  }

  getTimeZone() {
    this.httpService.getProfileSettings(this.providerId)
      .subscribe((settings: any) => {
        if(settings.timeZone) {
          this.timeZone = settings.timeZone
        }
      })
  }

  preLoadEvents() {
    this.dataLoading = true
    if (typeof Worker !== 'undefined') {
      this.dataLoading = true
      const worker = new Worker(new URL('./service-schedule.worker', import.meta.url));
      worker.onmessage = ({ data }) => {
        this.dataLoading= false
        this.calendarEvents = data.calendarEvents
        this.gCalendarEvents = data.gCalendarEvents
        this.fixedPrice.timeSlots = data.timeSlots
        // this.otherServices = data.otherServices
        this.availableTimeSlots()
      };
      worker.postMessage({
        timeSlots:this.fixedPrice.timeSlots,
        googleTimeSlots:this.googleTimeSlots,
        // otherServices:this.otherServices,
        subscription:this.fixedPrice.subscription,
        interval:this.fixedPrice.interval,
      });
    } else {
      this.dataLoading = false
    }
  }

  openFileExplorer() {
    this.input.nativeElement.click()
  }

  selectSubCategories(specialties:string[]) {
    for (let category of this.categories) {
      if (this.fixedPrice.category === category.category) {
        this.subCategories = category.subCategories
        this.specialties = []
        this.fixedPrice.specialties = specialties
      }
    }
  }

  selectSpecialties(specialties: string[]) {
    for (let subCategory of this.subCategories) {
      if (this.fixedPrice.subCategory === subCategory.subCategory) {
        this.specialties = subCategory.specialties
        this.fixedPrice.specialties = specialties
      }
    }
  }

  addInclude() {
    if(this.include !== '') {
      this.fixedPrice.includes.push(this.include)
      this.include = ''
    }
  }
  
  removeInclude(index:number) {
    this.fixedPrice.includes.splice(index, 1)
  }

  addExclude() {
    if(this.exclude !== '') {
      this.fixedPrice.excludes.push(this.exclude)
      this.exclude = ''
    }
  }
  
  removeExclude(index:number) {
    this.fixedPrice.excludes.splice(index, 1)
  }

  addImage($event: any) {
    const modalRef = this.modalService.open(CropperComponent, { centered: true });
    modalRef.componentInstance.image = $event
    modalRef.result.then((image:string)=>{
      this.fixedPrice.images = this.imageService.addImage(image, this.fixedPrice.images)
    }, ()=>{})
  }

  removeImage(index: number) {
    const items = document.getElementsByClassName("carousel-item")
    const indicators = document.getElementsByClassName("carousel-indicators")[0].children
    for (let i=0; i<=items.length-1; i++) {
      const item = items[i]
      const button = indicators[i]
      if (!item.classList.contains('active')) {
        this.renderer.addClass(item, 'active')
        this.renderer.addClass(button, 'active')
        break;
      }
    }
    this.fixedPrice.images.splice(index, 1)
  }

  selectPlacesUpdate(selectPlaces:boolean) {
    if(this.fixedPrice.selectPlaces) {
      this.openAreasModal()
    } else {
      this.clearCityMap(selectPlaces)
    }
  }

  updateTimeZone(){
    const modalRef = this.modalService.open(TimezoneComponent, { centered: true });
    modalRef.componentInstance.timeZone = this.timeZone
    modalRef.componentInstance.providerId = this.providerId
    modalRef.result.then((timeZone) => {
      this.timeZone = timeZone
    }, () => {})
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
        this.fixedPrice.selectPlaces = !selectPlaces
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

  openScheduleModal() {
    const modalRef = this.modalService.open(ServiceScheduleComponent, { centered: true, scrollable:true, fullscreen: 'sm', size: 'lg', modalDialogClass:'h-auto' });
    modalRef.componentInstance._calendarEvents = this.calendarEvents  
    modalRef.componentInstance._gCalendarEvents = this.gCalendarEvents  
    modalRef.componentInstance.googleTimeSlots = this.googleTimeSlots 
    // modalRef.componentInstance.otherServices = this.otherServices
    modalRef.componentInstance.timeSlots = this.fixedPrice.timeSlots
    modalRef.componentInstance.subscription = this.fixedPrice.subscription
    modalRef.componentInstance.interval = this.fixedPrice.interval
    modalRef.componentInstance.providerId = this.providerId
    modalRef.componentInstance.timeZone = this.fixedPrice.timeZone? this.timeZone:''
    modalRef.result.then((timeSlots:TimeSlot[]) => {
      if(Array.isArray(timeSlots)){
        this.fixedPrice.timeSlots = timeSlots
        this.dataLoading = true
        this.availableTimeSlots()
        this.preLoadEvents()
      }
    }, () => {})
  }

  openCustomFormModal(){
    const modalRef = this.modalService.open(CustomFormComponent, { centered: true });
    modalRef.componentInstance.form = this.fixedPrice.form
    modalRef.componentInstance.create = !this.fixedPrice.form.length
    modalRef.result.then((form: CustomField[][]) => {
      this.fixedPrice.form = form
    }, () => {})
  }

  availableTimeSlots() {
    this.availableSlots = 0
    for (let timeSlot of this.fixedPrice.timeSlots) {
      if(this.fixedPrice.subscription) {
        if (timeSlot.booked !== timeSlot.bookings) {
          this.availableSlots++
        }
      } else {
        if (timeSlot.booked !== timeSlot.bookings && timeSlot.startTime.getTime() > this.today.getTime()) {
          this.availableSlots++
        }
      }
    }
  }

  cityMapError(): boolean {
    let notExist = false
    this.statesAndCitiesMap.forEach((value, key) => {
      if (value === undefined) {
        notExist = true
      } else if (value.length == 0) {
        notExist = true
      }
    })
    return notExist
  }

  close() {
    this.router.navigate(["../"], {relativeTo:this.route})
  }

  toLocaleString() {
    let timeSlots = []
    for (let timeSlot of this.fixedPrice.timeSlots) {
      timeSlots.push({
        startTime: timeSlot.startTime.toLocaleString(),
        endTime: timeSlot.endTime.toLocaleString(),
        bookings: timeSlot.bookings
      })
    }
    return timeSlots
  }

  update(productForm: any) {
    this.renderer.addClass(this.pf.nativeElement, 'was-validated');
    if (this.fixedPrice.selectPlaces) {
      if (this.cityMapError() || this.statesAndCitiesMap.size === 0) {
        this.selectPlacesError = true
        this.selectPlacesElement.nativeElement.setCustomValidity("error")
      }
    }
    if (productForm.form.status === 'VALID' && !this.selectPlacesError) {
      this.updateSent = true
      this.renderer.removeClass(this.pf.nativeElement, 'was-validated');
      let statesAndCitiesJson = Array.from(this.statesAndCitiesMap, ([state, cities]) => ({ state, cities }))
      let request = {
        category: this.fixedPrice.category,
        subcategory: this.fixedPrice.subCategory,
        statesAndCities: statesAndCitiesJson,
        title: this.fixedPrice.title,
        description: this.fixedPrice.description,
        images: this.fixedPrice.images,
        timeSlots: this.toLocaleString(),
        selectPlaces: this.fixedPrice.selectPlaces,
        archived: this.fixedPrice.archived,
        specialties: this.fixedPrice.specialties,
        includes:this.fixedPrice.includes,
        excludes:this.fixedPrice.excludes,
        form:this.fixedPrice.form,
        timeZone:this.fixedPrice.timeZone
      }

      this.httpService.updatePrice(request, this.providerId, this.priceId).subscribe((resp: any) => {
        if (resp.updated) {
          productForm.resetForm()
          this.router.navigate(['../'], {relativeTo:this.route})
        } else {
          this.updateSent = false
          this.toastService.show('Failed to update service', {classname: 'bg-danger text-light', delay: 15000})
        }
      })
    }
  }
}
