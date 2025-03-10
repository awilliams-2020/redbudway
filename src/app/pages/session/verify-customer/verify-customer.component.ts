import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { HttpService } from '../../../services/http.service';
import { IconsModule } from '../../../icons/icons.module';
import { PageLoaderComponent } from '../../../components/page-loader/page-loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-customer',
  imports: [IconsModule, PageLoaderComponent, CommonModule],
  templateUrl: './verify-customer.component.html',
  styleUrls: ['./verify-customer.component.css']
})
export class VerifyCustomerComponent implements OnInit, AfterViewInit {
  @ViewChild('pageLoader') pageLoader: PageLoaderComponent = {} as PageLoaderComponent
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private router = inject(Router)

  customerId:string
  verified: boolean

  constructor() {
    this.customerId = ''
    this.verified = false
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(filter(params => params['token']))
      .pipe(filter(params => params['customerId']))
      .subscribe(params => {
        this.customerId = params['customerId']
        this.httpService.verifyCustomer(params['token'], params['customerId'])
          .subscribe((resp: any) => {
            this.pageLoader.hide()
            this.verified = resp.verified
          })
      })
  }

  ngAfterViewInit() {
    if(this.customerId === ''){
      this.close()
    }
  }

  close() {
    this.router.navigateByUrl('/')
  }

  send() {
    this.httpService.resendVerification(this.customerId)
      .subscribe((resp: any) => {
        this.router.navigateByUrl('/')        
      })
  }

}
