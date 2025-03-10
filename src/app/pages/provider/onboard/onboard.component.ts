import { Component, EventEmitter, inject, Output } from '@angular/core';
import { HttpService } from '../../../services/http.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { relative } from 'path';

@Component({
  selector: 'app-onboard',
  imports: [CommonModule],
  templateUrl: './onboard.component.html',
  styleUrl: './onboard.component.css'
})
export class OnboardComponent {
  private httpService = inject(HttpService)
  private storageService = inject(StorageService)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  providerId:string
  checking:boolean
  @Output() statusUpdate = new EventEmitter()
  
  constructor() {
    this.providerId = this.storageService.getProviderID()
    this.checking = false
  }

  ngOnInit(): void {}

  getStatus() {
    this.checking = true
    this.httpService.getStripeAccountStatus(this.providerId).then((resp)=>{
      if (resp.submitted && resp.enabled) {
        this.statusUpdate.emit(resp)
        this.router.navigate(['../'], {relativeTo: this.route})
      } else {
        this.checking = false
      }
    })
  }

  stripeOnboard() {
    this.httpService.continueOnBoarding(this.providerId).subscribe((resp: any) => {
      location.href = resp.url
    })
  }
}
