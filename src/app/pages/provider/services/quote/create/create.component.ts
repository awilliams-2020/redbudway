import { Component, ElementRef, inject, Renderer2, ViewChild } from '@angular/core';
import { StorageService } from '../../../../../services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../../services/http.service';
import { ImageService } from '../../../../../services/image.service';
import { ToastService } from '../../../../../services/toast.service';
import { CategoryService } from '../../../../../services/category.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../../../../components/toast/toast.component';

@Component({
  selector: 'app-create',
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './create.component.html',
  styleUrl: './create.component.css'
})
export class CreateComponent {
  private storageService = inject(StorageService)
  private renderer = inject(Renderer2)
  private router = inject(Router)
  private modalService = inject(NgbModal)
  private httpService = inject(HttpService)
  private toastService = inject(ToastService)
  private imageService = inject(ImageService)
  private categoryService = inject(CategoryService)
  private route = inject(ActivatedRoute)

  @ViewChild('pf') pf: ElementRef;
  @ViewChild("selectPlacesElement") selectPlacesElement: ElementRef
  @ViewChild("input") input: ElementRef
  
  providerId: string
  images: any
  title: string
  description: string
  selectPlaces: boolean
  statesAndCitiesMap: Map<string, []>
  selectPlacesError: boolean
  category: string
  subCategory: string
  categories: any[]
  subCategories: any[]
  specialties: string[]
  selectedSpecialties:string[]
  sent:boolean

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
    this.category = ""
    this.subCategory = ""
    this.categories = this.categoryService.getCategories()
    this.subCategories = []
    this.specialties = []
    this.selectedSpecialties = []
    this.sent = false
  }

  ngOnInit(): void {
    this.imageService.isErrors().subscribe((error:boolean)=>{
      if(error) {
        this.toastService.show(this.imageService.getErrorMsg(), {classname: 'bg-danger text-light', delay: 15000})
      }
    })
  }

  openFileExplorer() {
    this.input.nativeElement.click()
  }

  addImage($event: any) {
    // const modalRef = this.modalService.open(CropperComponent, { centered: true });
    // modalRef.componentInstance.image = $event
    // modalRef.result.then((image:string)=>{
    //   this.images = this.imageService.addImage(image, this.images)
    // }, ()=>{})
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

  selectPlacesUpdate() {
    if(this.selectPlaces) {
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
      if(value === undefined){
        notExist = true
      } else if(value.length == 0) {
        notExist = true
      }
    })
    return notExist
  }

  close() {
    this.router.navigate(["../"], {relativeTo: this.route})
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
      let cityJson = Array.from(this.statesAndCitiesMap, ([state, cities]) => ({ state, cities }))
      let request = {
        providerId: this.providerId,
        category: this.category,
        subcategory: this.subCategory,
        statesAndCities: cityJson,
        title: this.title,
        description: this.description,
        images: this.images,
        selectPlaces: this.selectPlaces,
        specialties:this.selectedSpecialties
      }

      this.httpService.createQuote(this.providerId, request).subscribe((resp: any) => {
        if(resp.created){
          this.router.navigate(['/provider', 'services', 'quotes'])
        } else {
          this.sent = false
          this.toastService.show('Failed to create quote', {classname: 'bg-danger text-light', delay: 15000})
        }
      })
    }
  }
}
