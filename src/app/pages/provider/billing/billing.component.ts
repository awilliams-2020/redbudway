import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-billing',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './billing.component.html',
  styleUrl: './billing.component.css'
})
export class BillingComponent implements OnInit {
  private router = inject(Router)
  private route = inject(ActivatedRoute)

  public routePath: string = './'
  private today: Date = new Date()
  public year: number = this.today.getFullYear()
  public years: number[] = []
  public quarter: number = this.getQuarter()

  constructor() {
    let incepYear = 2022
    this.years.push(incepYear)
    while (incepYear < this.year) {
      incepYear += 1
      this.years.push(incepYear)
    }
  }

  ngOnInit() {
    const validRoutes = ['manual', 'subscriptions', 'quotes']
    this.route.children[0].url.subscribe(segments =>{
      if(segments.length && validRoutes.includes(segments[0].path)) {
        this.routePath = "./"+segments[0].path
      }
    })
    this.route.queryParamMap.subscribe(params => {
      if (params.has('quarter')) {
        this.quarter = parseInt(params.get('quarter')!)
      }
      if (params.has('year')) {
        this.year = parseInt(params.get('year')!)
      }
    });
  }
 
  selectRoute() {
    this.quarter = 1
    this.year = this.today.getFullYear()
    this.navigate()
  }

  changeQuarter() {
    this.navigate()
  }

  changeYear() {
    this.navigate()
  }

  getQuarter() {
    if (this.today.getMonth() >= 3 && this.today.getMonth() <= 5) {
      return 2
    } else if (this.today.getMonth() >= 6 && this.today.getMonth() <= 8) {
      return 3
    } else if (this.today.getMonth() >= 9 && this.today.getMonth() <= 11) {
      return 4
    }
    return 1
  }

  navigate() {
    this.router.navigate([this.routePath], {queryParams:{quarter:this.quarter, year:this.year}, relativeTo: this.route})
  }
}
