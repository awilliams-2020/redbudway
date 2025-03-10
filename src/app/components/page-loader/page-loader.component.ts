import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  imports: [CommonModule],
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnInit {
  loading:boolean

  constructor(private renderer:Renderer2) {
    this.loading = true
  }

  ngOnInit(): void {
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  show(): void {
    this.loading = true
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
  }

  hide(): void {
    this.loading = false
    this.renderer.removeStyle(document.body, 'overflow');
  }

  isLoading(): boolean {
    return this.loading
  }

}
