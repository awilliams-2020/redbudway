import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';

@Component({
  selector: 'app-cropper',
  imports: [CommonModule, ImageCropperComponent],
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.css']
})
export class CropperComponent {
  maxWidth = 480
  maxHeight = 480
  scaleDown = true
  @Input() image: any
  @Input() base64Image: any
  croppedImage: any
  loading: boolean
  imageFailed: boolean

  constructor(public activeModal: NgbActiveModal) {
    this.loading = true
    this.imageFailed = false
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64
  }
  
  imageLoaded() {
    this.loading = false
  }

  loadImageFailed() {
      this.imageFailed = true
  }

  cropImage() {
    this.activeModal.close(this.croppedImage)
  }
}
