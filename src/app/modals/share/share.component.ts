import { Component, inject, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { IconsModule } from '../../icons/icons.module';

@Component({
  selector: 'app-share',
  imports: [
    IconsModule
  ],
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {
  public activeModal = inject(NgbActiveModal)

  @Input() url:string
  @Input() title:string
  
  constructor() {
    this.title = ''
    this.url = ''
  }

  ngOnInit(): void {
    // this.url = encodeURIComponent(this.url)
  }

  copy(url:any) {
    url.select();
    url.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(url.value);
  }

}
