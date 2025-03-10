import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../../../../../services/data.service';
import { HttpService } from '../../../../../../services/http.service';
import { ImageService } from '../../../../../../services/image.service';
import { ToastService } from '../../../../../../services/toast.service';
import { IconsModule } from '../../../../../../icons/icons.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../../../../services/storage.service';

@Component({
  selector: 'app-create',
  imports: [CommonModule, FormsModule, IconsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private renderer = inject(Renderer2)
  private modalService = inject(NgbModal)
  private toastService = inject(ToastService)
  private imageService = inject(ImageService)
  private storageService = inject(StorageService)

  @ViewChild('card') card: ElementRef
  @ViewChild('if') if: ElementRef;
  @ViewChild('input') input: ElementRef

  providerID:any
  createSent:boolean

  customers: any[]
  customer:any
  fixedPrices: any[]
  fixedPrice:any
  price:string
  dueDate:string
  minDate:string
  products:any[]
  total:string
  description:string
  productError: boolean
  loading: boolean
  images:string[]

  constructor() {
    this.providerID = this.storageService.getProviderID()
    this.createSent = false
    this.customers = []
    this.customer = ''
    this.fixedPrices = []
    this.fixedPrice = ''
    this.card = {} as ElementRef
    this.if = {} as ElementRef
    this.price = ''
    this.dueDate = ''
    this.products = []
    let tempDate = new Date()
    tempDate.setDate(tempDate.getDate() + 1);
    let month = tempDate.getMonth() < 9? '0'+(tempDate.getMonth()+1): tempDate.getMonth()+1
    let date = tempDate.getDate() < 10? '0'+tempDate.getDate(): tempDate.getDate()
    this.minDate = tempDate.getFullYear() +'-'+month+ '-'+ date
    this.total = '0.00'
    this.description = ""
    this.productError = false
    this.loading = true
    this.input = {} as ElementRef
    this.images = []
  }

  ngOnInit(): void {
    //resolver
    this.httpService.getProviderCustomers(this.providerID)
      .subscribe((customers:any[]) =>{
        this.loading = false
        this.customers = customers
      })
  }

  selectedCustomer($event:any) {
    let selectedCustomer = JSON.parse($event.target.value)
    for(let customer of this.customers){
      if(customer.name === selectedCustomer.name && customer.email === selectedCustomer.email){
        this.customer = customer
        this.fixedPrices = customer.fixedPrices
      }
    }
  }

  selectedService($event:any) {
    let selectedService = JSON.parse($event.target.value)
    for(let fixedPrice of this.fixedPrices){
      if(fixedPrice.title === selectedService.title && fixedPrice.id === selectedService.id ){
        this.fixedPrice = fixedPrice
      }
    }
  }

  addDescription(){
    // const modalRef = this.modalService.open(DescriptionComponent, { centered: true });
    // modalRef.componentInstance.description = this.description
    // modalRef.result.then((description: string) => {
    //   this.description = description
    // })
  }

  addCost() {
    // const modalRef = this.modalService.open(LineItemComponent, { centered: true });
    // modalRef.componentInstance.newProduct.subscribe((product: any) => {
    //   this.productError = false
    //   this.products.push(product)
    //   this.total = (parseFloat(this.total) + (parseFloat(product.price) * parseInt(product.quantity))).toFixed(2)
    // })
  }

  updateCost(product:any, index:number) {
      // const modalRef = this.modalService.open(LineItemComponent, { centered: true });
      // modalRef.componentInstance.product = product
      // modalRef.componentInstance.newProduct.subscribe((updatedProduct: any) => {      
      //   this.total = '0'
      //   for(let product of this.products) {
      //     this.total = (parseFloat(this.total) + (parseFloat(product.price) * parseInt(product.quantity))).toFixed(2)
      //   }  
      // })
  }

  removeCost(index:number) {
    let product = this.products.splice(index, 1)[0]
    this.total = (parseFloat(this.total) - (parseFloat(product.price) * parseInt(product.quantity))).toFixed(2)
  }

  openCamera() {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video:
        {
          facingMode: { exact: "environment" },
        }
      }).then((stream) => {
      //   const modalRef = this.modalService.open(CameraComponent, { centered: true });
      //   modalRef.componentInstance.stream = stream
      //   modalRef.result.then((image: any) => {
      //     this.openCropper(image)
      //   }, () => { })
      })
      .catch((err) => {
        this.openFileExplorer()
      })
  }

  openFileExplorer() {
    this.input.nativeElement.click()
  }

  addImage($event: any) {
    // const modalRef = this.modalService.open(CropperComponent, { centered: true });
    // modalRef.componentInstance.image = $event
    // modalRef.result.then((image: string) => {
    //   this.images = this.imageService.addImage(image, this.images)
    // }, () => { })
  }

  openCropper(image: any) {
    // const modalRef = this.modalService.open(CropperComponent, { centered: true });
    // modalRef.componentInstance.base64Image = image
    // modalRef.result.then((image: string) => {
    //   this.images = this.imageService.addImage(image, this.images)
    // }, () => { })
  }

  viewImage(index: number) {
    // const modalRef = this.modalService.open(ViewImageComponent, { centered: true });
    // modalRef.componentInstance.image = this.images[index]
    // modalRef.result.then((remove) => {
    //   if (remove) {
    //     this.images.splice(index, 1)
    //   }
    // }, () => { })
  }

  createInvoice(invoiceForm:any) {
    this.renderer.addClass(this.if.nativeElement, 'was-validated');
    if(this.products.length === 0 || this.customer == ''){
      this.productError = true
    }
    if (invoiceForm.form.status === 'VALID' && !this.productError) {
      this.createSent = true
      for(let i=0; i<this.products.length; i++) {
        let product = this.products[i]
        product.price = Math.trunc(parseFloat(product.price) * 100)
        product.quantity = parseInt(product.quantity, 10)
        this.products[i] = product
      }
      let request = {
        cuStripeId:this.customer.id,
        products:this.products,
        description:this.description,
        images:this.images,
        // dueDate: formatInTimeZone(invoiceForm.form.value.dueDate, Intl.DateTimeFormat().resolvedOptions().timeZone, 'yyyy-MM-dd\'T\'HH:mm:ssXXX')
      }
      this.httpService.createProviderManualInvoice(this.providerID, request)
        .subscribe((resp:any) =>{
          if(resp.created) {
            this.router.navigate(["../"], {relativeTo:this.route})
          } else {
            this.createSent = false
            this.toastService.show("Failed to create invoice", {classname: 'bg-danger text-light', delay: 15000})
          }
        })
    }
    
  }

  close() {
    this.router.navigate(["../"], {relativeTo:this.route})
  }

}
