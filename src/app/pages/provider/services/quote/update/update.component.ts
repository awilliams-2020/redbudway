import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../../services/data.service';
import { HttpService } from '../../../../../services/http.service';
import { ImageService } from '../../../../../services/image.service';
import { ToastService } from '../../../../../services/toast.service';
import { CategoryService } from '../../../../../services/category.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../../../../../components/toast/toast.component';
import { StorageService } from '../../../../../services/storage.service';

@Component({
  selector: 'app-update',
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent {
  private route = inject(ActivatedRoute)
  private renderer = inject(Renderer2)
  private router = inject(Router)
  private modalService = inject(NgbModal)
  private httpService = inject(HttpService)
  private toastService = inject(ToastService)
  private imageService = inject(ImageService)
  private storageService = inject(StorageService)
  private categoryService = inject(CategoryService)

  @ViewChild('pf') pf: ElementRef;
  @ViewChild("selectPlacesElement") selectPlacesElement: ElementRef
  @ViewChild("input") input: ElementRef
  loading: boolean
  providerId: string
  quote:any
  statesAndCitiesMap: Map<string, []>
  selectPlacesError: boolean
  categories: any[]
  subCategories: any[]
  specialties: string[]
  quoteId: any
  archived: string
  updateSent: boolean
  url:string

  constructor() {
    this.providerId = this.storageService.getProviderID()
    this.pf = {} as ElementRef
    this.input = {} as ElementRef
    this.selectPlacesElement = {} as ElementRef
    this.loading = true
    this.selectPlacesError = false
    this.statesAndCitiesMap = new Map()
    this.categories = this.categoryService.getCategories()
    this.subCategories = []
    this.specialties = []
    this.quoteId = ''
    this.archived = "false"
    this.updateSent = false
    this.url = ''
  }

  ngOnInit(): void {
    this.imageService.isErrors().subscribe((error:boolean)=>{
      if(error) {
        this.toastService.show(this.imageService.getErrorMsg(), {classname: 'bg-danger text-light', delay: 15000})
      }
    })
    this.route.paramMap
      .subscribe((params) => {
        this.quoteId = params.get("quoteId")
        this.getQuote()
      })
  }

  getQuote() {
    this.httpService.getQuote(this.quoteId, this.providerId).subscribe((quote: any) => {
      if (Object.keys(quote).length !== 0) {
        this.url = 'https://redbudway.com/quote/'+this.quoteId
        this.quote = quote
        this.selectSubCategories()
        this.selectFilters()
        this.statesAndCitiesMap = new Map(
          quote.statesAndCities.map((object: any) => {
            return [object.state, object.cities];
          })
        )
        this.archived = quote.archived ? 'true' : 'false'
        this.loading = false
      } else {
        sessionStorage.clear()
        this.router.navigateByUrl('/session/provider-login')
      }
    })
  }

  openFileExplorer() {
    this.input.nativeElement.click()
  }

  selectSubCategories() {
    for (let category of this.categories) {
      if (this.quote.category === category.category) {
        this.subCategories = category.subCategories
        this.specialties = []
        this.quote.specialties = []
      }
    }
  }

  selectFilters() {
    for (let subCategory of this.subCategories) {
      if (this.quote.subCategory === subCategory.subCategory) {
        this.specialties = subCategory.specialties
        this.quote.specialties = []
      }
    }
  }

  addImage($event: any) {
    // const modalRef = this.modalService.open(CropperComponent, { centered: true });
    // modalRef.componentInstance.image = $event
    // modalRef.result.then((image:string)=>{
    //   this.quote.images = this.imageService.addImage(image, this.quote.images)
    // }, ()=>{})
  }

  removeImage(index: number) {
    this.quote.images.splice(index, 1)
    let item = document.getElementsByClassName("carousel-item")[0]
    if (!item.classList.contains('active')) {
      this.renderer.addClass(item, 'active')
    }
  }

  selectPlacesUpdate() {
    if(this.quote.selectPlaces) {
      this.openAreasModal()
    } else {
      this.clearCityMap()
    }
  }

  clearCityMap() {
    this.selectPlacesError = false
    this.selectPlacesElement.nativeElement.setCustomValidity("")
    this.statesAndCitiesMap = new Map()
  }

  openAreasModal() {
    // const modalRef = this.modalService.open(StateCitiesComponent, { centered: true });
    // modalRef.componentInstance.statesAndCities = STATESANDCITIES
    // modalRef.componentInstance.statesAndCitiesMap = this.statesAndCitiesMap
    // modalRef.result.then((statesAndCitiesMap: Map<string, []>) => {
    //   this.statesAndCitiesMap = statesAndCitiesMap
    //   let notExist = this.cityMapError()
    //   if (this.statesAndCitiesMap.size !== 0 || !notExist) {
    //     this.selectPlacesError = false
    //   }
    // },()=>{})
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
  
  update(quoteForm: any) {
    this.renderer.addClass(this.pf.nativeElement, 'was-validated');
    if (this.quote.selectPlaces) {
      if (this.cityMapError() || this.statesAndCitiesMap.size === 0) {
        this.selectPlacesError = true
        this.selectPlacesElement.nativeElement.setCustomValidity("error")
      }
    }
    if (quoteForm.form.status === 'VALID' && !this.selectPlacesError) {
      this.updateSent = true
      this.renderer.removeClass(this.pf.nativeElement, 'was-validated');
      let statesAndCitiesJson = Array.from(this.statesAndCitiesMap, ([state, cities]) => ({ state, cities }))
      let request = {
        category: this.quote.category,
        subcategory: this.quote.subCategory,
        statesAndCities: statesAndCitiesJson,
        title: quoteForm.form.value.title,
        description: quoteForm.form.value.description,
        images: this.quote.images,
        selectPlaces: this.quote.selectPlaces,
        archived: this.quote.archived,
        specialties: this.quote.specialties
      }

      this.httpService.updateQuote(request, this.providerId, this.quoteId).subscribe((resp: any) => {
        if (resp.updated) {
          quoteForm.resetForm()
          this.router.navigate(['../'], {relativeTo: this.route})
        } else {
          this.updateSent = false
          this.toastService.show('Failed to update quote.', {classname: 'bg-danger text-light', delay: 15000})
        }
      })
    }
  }
}
