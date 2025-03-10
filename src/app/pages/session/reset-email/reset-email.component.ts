import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { HttpService } from '../../../services/http.service';
import { PageLoaderComponent } from '../../../components/page-loader/page-loader.component';
import { IconsModule } from '../../../icons/icons.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-email',
  imports: [PageLoaderComponent, IconsModule, CommonModule],
  templateUrl: './reset-email.component.html',
  styleUrls: ['./reset-email.component.css']
})
export class ResetEmailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private httpService = inject(HttpService)
  private router = inject(Router)

  @ViewChild('pageLoader') pageLoader: PageLoaderComponent = {} as PageLoaderComponent
  email:string
  updated: boolean

  constructor() {
    this.email = ''
    this.updated = false
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(filter(params => params['token']))
      .pipe(filter(params => params['email']))
      .pipe(filter(params => params['tradespersonId']))
      .subscribe(params => {
        this.httpService.revertProviderEmail(params['token'], params['email'], params['tradespersonId'])
          .subscribe((resp: any) => {
            this.pageLoader.hide()
            this.updated = resp.updated
            if(this.updated){
              this.email = params['email']
            }
          })
      })
  }

  close() {
    this.router.navigateByUrl('/')
  }

}
