import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IconsModule } from '../../icons/icons.module';

@Component({
  selector: 'app-not-found',
  imports: [IconsModule, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {
  private router = inject(Router)

  close() {
    this.router.navigate(['/'])
  }
}
