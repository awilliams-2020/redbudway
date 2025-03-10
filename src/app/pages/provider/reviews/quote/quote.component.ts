import { Component, inject } from '@angular/core';
import { StorageService } from '../../../../services/storage.service';
import { NgbModal, NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from '../../../../services/http.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quote',
  imports: [CommonModule, FormsModule, NgbRating],
  templateUrl: './quote.component.html',
  styleUrl: './quote.component.css'
})
export class QuoteComponent {
  private httpService = inject(HttpService)
  private storageService = inject(StorageService)
  private modalService = inject(NgbModal)

  loading: boolean
  providerID: string
  reviews: any
  response: string
  error: boolean

  constructor() {
    this.providerID = this.storageService.getProviderID()
    this.loading = true
    this.reviews = []
    this.response = ''
    this.error = false
  }

  ngOnInit(): void {
    this.httpService.getQuoteReviews(this.providerID)
      .subscribe((resp: any) => {
        this.reviews = resp
        this.loading = false
      })
  }

  writeResponse(reviewId: number, modal: any) {
    let modalRef = this.modalService.open(modal, { centered: true })
    modalRef.result.then((result: any) => {
      let request = {
        reviewId: reviewId,
        response: this.response,
      }
      this.httpService.respondToQuoteReview(this.providerID, request)
        .subscribe((resp: any) => {
          if(resp.responded){
            this.ngOnInit()
          }
        })
    }, (reason: any) => {

    })
  }

  removeErr($event:any){
    if(this.error && this.response !== '') {
      this.error = false
    } else if (!this.error && this.response == '') {
      this.error = true
    }
  }

  respond(modal:any) {
    if(this.response !== ''){
      modal.close('')
    } else {
      this.error = true
    }
  }
}
