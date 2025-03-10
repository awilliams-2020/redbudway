import { PlatformLocation } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements AfterViewInit {
  @ViewChild("video") video: ElementRef
  @ViewChild("canvas") canvas: ElementRef
  @Input() stream: any

  constructor(public activeModal: NgbActiveModal, private location: PlatformLocation){
    this.location.onPopState(() => this.stop());
    this.video = {} as ElementRef
    this.canvas = {} as ElementRef
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.video.nativeElement.srcObject = this.stream;
    this.video.nativeElement.play();
  }

  stop(){
    const tracks = this.video.nativeElement.srcObject.getTracks();
    tracks.forEach(function(track:any) {
      track.stop();
    });
    this.video.nativeElement.srcObject = null;
  }

  dismiss() {
    this.stop()
    this.activeModal.dismiss()
  }

  takePicture() {
    const width = this.video.nativeElement.videoWidth
    const height = this.video.nativeElement.videoHeight
    this.canvas.nativeElement.width = width;
    this.canvas.nativeElement.height = height;
    const context = this.canvas.nativeElement.getContext("2d");
    context.drawImage(this.video.nativeElement, 0, 0, width, height);
    const data = this.canvas.nativeElement.toDataURL();
    this.stop()
    this.activeModal.close(data)
  }
}
