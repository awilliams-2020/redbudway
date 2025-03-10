import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-thank-you',
  imports: [CommonModule],
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent implements OnInit {
  public activeModal = inject(NgbActiveModal)
  private platformLocation = inject(PlatformLocation)

  @Input() type:any
  intervalID: any

  constructor() {
    this.platformLocation.onPopState(() => {this.activeModal.close()});
  }

  ngOnInit(): void {}
}
