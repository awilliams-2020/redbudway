import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-line-item',
  templateUrl: './line-item.component.html',
  styleUrls: ['./line-item.component.css']
})
export class LineItemComponent implements OnInit {
  @Input() product:any
  invalidNumFormat:boolean
  invalidNum:boolean
  invalidQuantityFormat:boolean
  invalidQuantity:boolean
  invalidTitle:boolean
  newProduct: EventEmitter<any[]>
  
  constructor(public activeModal: NgbActiveModal, private location: PlatformLocation) {
    this.location.onPopState(() => this.activeModal.close());
    this.product = {
      title: '',
      price: '',
      quantity: ''
    }
    this.newProduct = new EventEmitter()
    this.invalidNumFormat = false
    this.invalidNum = false
    this.invalidQuantityFormat = false
    this.invalidQuantity = false
    this.invalidTitle = false
  }

  ngOnInit(): void {
  }

  add(){
    let price = parseFloat(this.product.price).toFixed(2)
    let quantity = parseInt(this.product.quantity).toFixed(0)

    if(price != 'NaN' && price !== '0.00' &&
        quantity != 'NaN' && quantity !== '0' && this.product.title !== ''){
          this.product.price = price
          this.product.quantity = quantity
          this.newProduct.emit(this.product)
          this.activeModal.close()
    } else {
      if(price === 'NaN'){
        this.invalidNumFormat = true
      }
      if(price === '0.00'){
        this.invalidNum = true
      }
      if(quantity === 'NaN'){
        this.invalidQuantityFormat = true
      }
      if(quantity === '0'){
        this.invalidQuantity = true
      }
      if(this.product.title === '') {
        this.invalidTitle = true
      }
    }
  }

}
