import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../services/http.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  imports: [CommonModule, FormsModule, NgbAlert],
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  private httpService = inject(HttpService)
  public activeModal = inject(NgbActiveModal)
  private renderer = inject(Renderer2)
  private platformLocation = inject(PlatformLocation)

  @ViewChild('af') af: ElementRef = {} as ElementRef
  @Input() address: any = ''
  @Input() providerId: string = ''

  lineOne:string = ''
  lineTwo:string = ''
  state:string = ''
  city:string = ''
  zipCode:string = ''
  error:boolean = false
  isDisabled: boolean = false
  states: any[] = [] // STATESANDCITIES
  cities: any[] = []

  constructor() {
    this.platformLocation.onPopState(() => this.activeModal.close());
  }

  ngOnInit(): void {
    this.lineOne = this.address.lineOne? this.address.lineOne: ''
    this.lineTwo = this.address.lineTwo? this.address.lineTwo: ''
    this.state = this.address.state? this.address.state: ''
    this.city = this.address.city? this.address.city: ''
    this.zipCode = this.address.zipCode? this.address.zipCode: ''
    if(this.state !== ''){
      for(let state of this.states) {
        if(state.state === this.state) {
          this.cities = state.cities
        }
      }
    }
  }

  selectedState($event:any) {
    for(let state of this.states) {
      if(state.state === $event.target.value) {
        this.cities = state.cities
      }
    }
  }

  update(addressForm:any) {
    this.renderer.addClass(this.af.nativeElement, 'was-validated');
    if (addressForm.form.status === 'VALID') {
      this.isDisabled = true;
      let request = {
        address: {
          lineOne:addressForm.form.value.addressLineOne,
          lineTwo:addressForm.form.value.addressLineTwo,
          state:addressForm.form.value.state,
          city:addressForm.form.value.city,
          zipcode:addressForm.form.value.zipcode,
        },
      }
      this.httpService.updateProfile(this.providerId, request).subscribe((resp: any) => {
        if (resp.updated) {
          this.activeModal.close({
            lineOne: this.lineOne,
            lineTwo: this.lineTwo,
            state:this.state,
            city:this.city,
            zipCode: this.zipCode
          })
        } else {
          this.isDisabled = false
          this.error = true
        }
      })
    }
  }

}
