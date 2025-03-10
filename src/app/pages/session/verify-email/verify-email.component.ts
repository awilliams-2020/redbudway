import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../../services/http.service';
import { StorageService } from '../../../services/storage.service';
import { IconsModule } from '../../../icons/icons.module';

@Component({
  selector: 'app-verify-email',
  imports: [IconsModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  private router = inject(Router)
  private httpService = inject(HttpService)
  private storageService = inject(StorageService)

  customerId:any 

  constructor() {
    this.customerId = null
  }

  ngOnInit(): void {
    this.customerId = this.storageService.getCustomerID()
    if(!this.customerId){
      this.router.navigateByUrl('/session/customer-login')
    } else {
      this.httpService.customerVerified(this.customerId)
        .subscribe((resp:any)=>{
          if(resp.verified) {
            this.router.navigateByUrl('/')
          }
        })
    }
  }

  close() {
    this.router.navigateByUrl('/')
  }

  send() {
    this.httpService.resendVerification(this.customerId)
      .subscribe((resp:any) => {
        this.router.navigateByUrl('/')
      })
  }

}
