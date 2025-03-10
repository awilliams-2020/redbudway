import { Component, ElementRef, ViewChild } from '@angular/core';
import { IconsModule } from '../../icons/icons.module';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule, IconsModule, NavbarComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  @ViewChild('banner') banner: ElementRef
  loading: boolean

  constructor() {
    this.banner = {} as ElementRef;
    this.loading = true
  }

  onLoad() {
    this.loading = false
  }
}
