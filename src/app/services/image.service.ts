import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  errors: Subject<boolean>
  maxAttachmentSize: number
  totalAttachmentSize: number
  errorMsg: string

  constructor() {
    this.errors = new Subject()
    this.maxAttachmentSize = 2000
    this.totalAttachmentSize = 0
    this.errorMsg = ''
  }

  getSizeFromBase64(base64Image: string) {
    let data = base64Image.split(',')
    let sizeInBytes = Math.ceil(data[1].length / 4) * 3
    if (data[1].slice(-2) === '==') {
      sizeInBytes -= 2
    } else if (data[1].slice(-1) === '=') {
      sizeInBytes -= 1
    }
    return sizeInBytes
  }

  reduceAttachmentSize(base64Image: string) {
    this.totalAttachmentSize -= (this.getSizeFromBase64(base64Image) / 1024)
  }

  resetAttachmentSize() {
    this.totalAttachmentSize = 0
  }

  overAttachmentSize(dataURL: string, fileType: string) {
    const head = "data:image/" + fileType + ";base64,";
    const sizeInBytes = Math.round((dataURL.length - head.length) * 3 / 4);
    let tempSize = this.totalAttachmentSize + (sizeInBytes / 1024)
    if (tempSize > this.maxAttachmentSize) {
      this.setErrorMsg('Images can\'t exceed 2MB')
      this.errors.next(true)
      return true
    }
    this.totalAttachmentSize += tempSize
    return false
  }
  
  addImage(image: string, images: any[]) {
    if (images.length === 8) {
      this.setErrorMsg('Only 8 images are allowed.')
      this.errors.next(true)
    } else if (!this.overAttachmentSize(image, 'png')) {
        images.push(image)
    }
    return images
  }

  setErrorMsg(msg: string) {
    this.errorMsg = msg
  }

  getErrorMsg() {
    return this.errorMsg
  }

  isErrors(): Observable<boolean> {
    return this.errors.asObservable()
  }

}
