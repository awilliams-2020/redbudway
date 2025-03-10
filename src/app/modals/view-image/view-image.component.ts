import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-image',
  imports: [CommonModule],
  templateUrl: './view-image.component.html',
  styleUrls: ['./view-image.component.css']
})
export class ViewImageComponent {
  public activeModal = inject(NgbActiveModal)

  @Input() image: any
  @Input() status: string
  loading: boolean

  constructor() {
    this.status = ''
    this.loading = true
  }

  onLoad() {
    this.loading = false
  }

}
