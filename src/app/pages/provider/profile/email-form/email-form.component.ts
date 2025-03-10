import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../services/http.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-form',
  imports: [CommonModule, FormsModule, NgbAlert],
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css']
})
export class EmailFormComponent implements OnInit {
  private httpService = inject(HttpService)
  public activeModal = inject(NgbActiveModal)
  private renderer = inject(Renderer2)
  private platformLocation = inject(PlatformLocation)
  private router = inject(Router)

  @ViewChild('ef') ef: ElementRef;
  @Input() _email: any
  @Input() providerID: string
  email:string
  error:boolean
  isDisabled: boolean

  constructor() {
    this.platformLocation.onPopState(() => this.activeModal.close());
    this.ef = {} as ElementRef
    this.email = ''
    this.providerID = ''
    this.error = false
    this.isDisabled = false
  }

  ngOnInit(): void {
    this.email = this._email? this._email: ''
  }

  updateAccountEmail(){
    this.router.navigate(['/session/update-email', {queryParams:{providerID:this.providerID}}])
    this.activeModal.close()
  }

  update(numberForm:any) {
    this.renderer.addClass(this.ef.nativeElement, 'was-validated');
    if (numberForm.form.status === 'VALID') {
      this.isDisabled = true;
      let request = {
        email:numberForm.form.value.email,
      }
      this.httpService.updateProfile(this.providerID, request).subscribe((resp: any) => {
        if (resp.updated) {
          this.activeModal.close(this.email)
        } else {
          this.isDisabled = false
          this.error = true
        }
      })
    }
  }

}
