import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-review',
  imports: [FormsModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  @Input() rating:number
  reviewMes: string
  typedMes: EventEmitter<string>

  constructor(public activeModal: NgbActiveModal, private location: PlatformLocation) {
    this.location.onPopState(() => this.activeModal.close());
    this.reviewMes = ''
    this.rating = 0
    this.typedMes = new EventEmitter()
  }

  ngOnInit(): void {}

  syncMessage() {
    this.typedMes.emit(this.reviewMes)
  }

  addReview() {
    this.activeModal.close()
  }

}
