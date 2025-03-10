import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleadsService {

  window: any

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.window = this.document.defaultView;
  }
  
  pushAd() {
    (this.window["adsbygoogle"] = this.window["adsbygoogle"] || []).push({});
  }
}
