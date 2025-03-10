import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../services/http.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-number-form',
  imports: [CommonModule, FormsModule, NgbAlert],
  templateUrl: './number-form.component.html',
  styleUrls: ['./number-form.component.css']
})
export class NumberFormComponent implements OnInit {
  private httpService = inject(HttpService)
  public activeModal = inject(NgbActiveModal)
  private renderer = inject(Renderer2)
  private platformLocation = inject(PlatformLocation)
  
  @ViewChild('nf') nf: ElementRef;
  @Input() _number: any
  @Input() providerID: string
  number:string
  error:boolean
  isDisabled: boolean

  constructor() {
    this.platformLocation.onPopState(() => this.activeModal.close());
    this.nf = {} as ElementRef
    this.number = ''
    this.providerID = ''
    this.error = false
    this.isDisabled = false
  }

  ngOnInit(): void {
    this.number = this._number? this._number: ''
  }

  addHyphen($event:any) {
    if(this.number.length === 3){
      this.number += '-'
    } else if(this.number.length === 7) {
      this.number += '-'
    }
  }

  update(numberForm:any) {
    this.renderer.addClass(this.nf.nativeElement, 'was-validated');
    if (numberForm.form.status === 'VALID') {
      this.isDisabled = true;
      let request = {
        number:numberForm.form.value.number,
      }
      this.httpService.updateProfile(this.providerID, request).subscribe((resp: any) => {
        if (resp.updated) {
          this.activeModal.close(this.number)
        } else {
          this.isDisabled = false
          this.error = true
        }
      })
    }
  }
}
