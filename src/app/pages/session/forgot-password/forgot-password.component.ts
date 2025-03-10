import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { HttpService } from '../../../services/http.service';
import { FormsModule } from '@angular/forms';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, NgbAlert, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  private renderer = inject(Renderer2)
  private router = inject(Router)
  private httpService = inject(HttpService)
  private route = inject(ActivatedRoute)

  @ViewChild('pf') pf: ElementRef;
  @ViewChild('card') card: ElementRef

  email: string
  emailMessage: boolean
  accountType: string
  loading: boolean

  constructor() {
    this.card = {} as ElementRef
    this.pf = {} as ElementRef
    this.email = ''
    this.emailMessage = false
    this.accountType = ''
    this.loading = false
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(filter(params => params['accountType']))
      .subscribe(params => {
        this.accountType = params['accountType']
      })
  }

  forgot(passwordForm: any) {
    this.renderer.addClass(this.pf.nativeElement, 'was-validated');
    if (passwordForm.form.status === 'VALID') {
      this.loading = true
      let email = passwordForm.form.value.email
      if (this.accountType !== '') {
        this.httpService.forgotPassword(email, this.accountType)
          .subscribe((resp: any) => {
            this.renderer.removeClass(this.pf.nativeElement, 'was-validated');
            passwordForm.resetForm()
            this.emailMessage = true
            this.loading = false
          })
      }
    }
  }

  close() {
    this.router.navigateByUrl("/")
  }

}
