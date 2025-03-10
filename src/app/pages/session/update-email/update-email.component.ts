import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';
import { HttpService } from '../../../services/http.service';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-email',
  imports: [FormsModule, NgbAlert, CommonModule],
  templateUrl: './update-email.component.html',
  styleUrls: ['./update-email.component.css']
})
export class UpdateEmailComponent implements OnInit {
  private router = inject(Router)
  private renderer = inject(Renderer2)
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)

  @ViewChild('ef') pf: ElementRef;
  @ViewChild('card') card: ElementRef
  email: string
  password: string
  providerId: string
  customerId: string
  type: string
  emailUpdated: boolean
  loading: boolean
  submitted: boolean

  constructor() {
    this.email = ''
    this.password = ''
    this.pf = {} as ElementRef;
    this.card = {} as ElementRef
    this.providerId = ''
    this.customerId = ''
    this.type = 'password'
    this.emailUpdated = false
    this.loading = false
    this.submitted = false
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(filter(params => params['providerId']))
      .subscribe(params => {
        this.providerId = params['providerId']
      })
    this.route.queryParams
      .pipe(filter(params => params['customerId']))
      .subscribe(params => {
        this.customerId = params['customerId']
      })
  }

  showPassword() {
    this.type = this.type === 'password'? 'text':'password'
  }

  update(passwordForm: any) {
    this.renderer.addClass(this.pf.nativeElement, 'was-validated');
    if (passwordForm.form.status === 'VALID') {
      this.loading = true
      let request = {
        email: this.email,
        curPassword: this.password,
      }
      if (this.customerId !== '') {
        this.httpService.updateCustomerEmail(request, this.customerId)
          .subscribe((resp: any) => {
            this.loading = false
            this.submitted = true
            this.renderer.removeClass(this.pf.nativeElement, 'was-validated');
            passwordForm.resetForm()
            if(resp.updated) {
              this.emailUpdated = true
            } else {
              this.emailUpdated = false
            }
          })
      } else if (this.providerId !== '') {
        this.httpService.updateProviderEmail(request, this.providerId)
          .subscribe((resp: any) => {
            this.loading = false
            this.submitted = true
            this.renderer.removeClass(this.pf.nativeElement, 'was-validated');
            passwordForm.resetForm()
            if(resp.updated) {
              this.emailUpdated = true
            } else {
              this.emailUpdated = false
            }
          })
      }
    }
  }

  close() {
    this.router.navigateByUrl("/")
  }

}
