import { PlatformLocation } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-description',
  imports: [FormsModule],
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {
  public activeModal = inject(NgbActiveModal)
  private platformLocation = inject(PlatformLocation)

  @Input() description:string

  constructor() {
    this.platformLocation.onPopState(() => this.activeModal.close());
    this.description = ''
  }

  ngOnInit(): void {
  }

  update(){
    this.activeModal.close(this.description)
  }
}
