import { CommonModule, PlatformLocation } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageService } from '../../services/image.service';
import { HttpService } from '../../services/http.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-email',
  imports: [CommonModule, FormsModule],
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  public activeModal = inject(NgbActiveModal)
  private httpService = inject(HttpService)
  private imageService = inject(ImageService)
  private location = inject(PlatformLocation)

  @ViewChild("input") input: ElementRef = {} as ElementRef

  @Input() quoteId: string = ''
  @Input() priceId: string = ''
  @Input() customerId: string = ''
  @Input() providerID: string = ''
  message: string = ''
  emailSent: boolean = false
  images: any[] = []
  error: boolean = false
  errMsg: string = ''

  constructor() {
    this.location.onPopState(() => this.activeModal.close());
  }

  ngOnInit(): void {
    this.imageService.resetAttachmentSize()
    this.imageService.isErrors().subscribe((error: boolean) => {
      this.error = error
      this.errMsg = this.imageService.getErrorMsg()
    })
  }

  openFileExplorer() {
    this.input.nativeElement.click()
  }

  addImage($event: any) {
    this.images = this.imageService.addImage($event, this.images)
  }

  removeImage(index: number) {
    this.error = false
    const image = this.images.splice(index, 1)
    this.imageService.reduceAttachmentSize(image[0])
  }

  send() {
    this.emailSent = true
    let request = {
      message: this.message,
      priceId: this.priceId,
      quoteId: this.quoteId,
      customerId: this.customerId,
      images: this.images
    }
    const requestSize = JSON.stringify(request)
    if (requestSize.length / 1024 < 1000) {
      this.httpService.emailProvider(this.providerID, request)
        .subscribe((resp: any) => {
          if (resp.sent) {
            this.activeModal.close()
          } else {
            this.emailSent = false
            this.errMsg = 'Failed to send message'
            this.error = true
          }
        })
    } else {
      this.emailSent = false
      this.errMsg = "Request too large. Reduce message size or remove images"
      this.error = true
    }
  }

}
