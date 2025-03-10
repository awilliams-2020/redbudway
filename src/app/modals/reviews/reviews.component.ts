import { PlatformLocation } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/core/http.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  @Input() priceId: string
  @Input() quoteId: string
  @Input() rating: number
  reviews:any
  page: number

  oneStar = 1
  twoStar = 2
  threeStar = 3
  fourStar = 4
  fiveStar = 5
  
  constructor(public activeModal: NgbActiveModal, private httpService:HttpService, private location:PlatformLocation) {
    this.location.onPopState(() => this.activeModal.close());
    this.reviews = {
      reviews: [],
      oneStars: 0,
      twoStars: 0,
      threeStars: 0,
      fourStars: 0,
      fiveStars: 0
    }
    this.page = 1
    this.priceId = ''
    this.quoteId = ''
    this.rating = 0
  }

  ngOnInit(): void {
    if(this.priceId !== '') {
      this.httpService.viewFixedPriceReviews(this.priceId, this.page).subscribe((reviews:any)=>{
        for(let review of reviews.reviews){
          review.date = new Date(review.date)
          if(review.respDate){
            review.respDate = new Date(review.respDate)
          }
        }
        this.reviews = reviews
      })
    } else if (this.quoteId !== '') {
      this.httpService.viewQuoteReviews(this.quoteId, this.page).subscribe((reviews:any)=>{
        for(let review of reviews.reviews){
          review.date = new Date(review.date)
          if(review.respDate){
            review.respDate = new Date(review.respDate)
          }
        }
        this.reviews = reviews
      })
    }
  }

}
