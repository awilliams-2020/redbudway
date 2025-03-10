import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../services/http.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-name-form',
  imports: [CommonModule, FormsModule, NgbAlert],
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.css']
})
export class NameFormComponent implements OnInit {
  private httpService = inject(HttpService)
  public activeModal = inject(NgbActiveModal)
  private renderer = inject(Renderer2)
  private platformLocation = inject(PlatformLocation)

  @ViewChild('nf') nf: ElementRef;
  @Input() _name: any
  @Input() providerID: string
  name:string
  error:boolean
  isDisabled: boolean

  constructor() {
    this.platformLocation.onPopState(() => this.activeModal.close());
    this.nf = {} as ElementRef
    this.name = ''
    this.providerID = ''
    this.error = false
    this.isDisabled = false
  }

  ngOnInit(): void {
    this.name = this._name? this._name: ''
  }

  update(numberForm:any) {
    this.renderer.addClass(this.nf.nativeElement, 'was-validated');
    if (numberForm.form.status === 'VALID') {
      this.isDisabled = true;
      let request = {
        name:numberForm.form.value.name,
      }
      this.httpService.updateProfile(this.providerID, request).subscribe((resp: any) => {
        if (resp.updated) {
          this.activeModal.close(this.name)
        } else {
          this.isDisabled = false
          this.error = true
        }
      })
    }
  }

}
