import { PlatformLocation } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-continue',
  templateUrl: './continue.component.html',
  styleUrls: ['./continue.component.css']
})
export class ContinueComponent implements OnInit {
  @Input() message:string;

  constructor(public activeModal: NgbActiveModal, private location: PlatformLocation) {
    this.location.onPopState(() => this.activeModal.close());
    this.message = ''
  }

  ngOnInit(): void {
  }

}
