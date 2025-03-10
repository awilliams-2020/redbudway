import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveOffcanvas, NgbDate, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-side-menu',
  imports: [CommonModule, FormsModule, NgbDatepicker],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  public activeOffcanvas = inject(NgbActiveOffcanvas)

  @Input() specialties:string[]
  @Input() selectedSpecialties: string[]
  @Input() subCategory: string
  @Input() serviceCount: number
  @Input() min: number
  @Input() max: number
	@Input() fromDate: NgbDate | null = null;
	@Input() toDate: NgbDate | null = null;
  @Input() isFixedPrice: boolean

  public hoveredDate: NgbDate | null = null;
  public isDisabled: any
  private current: NgbDate

  constructor() {
    this.specialties = []
    this.selectedSpecialties = []
    this.subCategory = ''
    this.serviceCount = 0
    this.min = 0
    this.max = 0
    this.fromDate = null
		this.toDate = null
    this.isFixedPrice = true
    let date = new Date()
    this.current = new NgbDate(date.getFullYear(), date.getMonth()+1,date.getDate())
    this.isDisabled = (date: NgbDate, current: NgbDate) => {
      return date.before(this.current)
    }
  }

  ngOnInit(): void {}

  onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

  selectSpecialty($event: any) {
    if (this.selectedSpecialties.includes($event.target.value)) {
      const index = this.selectedSpecialties.indexOf($event.target.value);
      if (index > -1) {
        this.selectedSpecialties.splice(index, 1)
      }
    } else {
      this.selectedSpecialties.push($event.target.value)
    }
  }

  selectFilters() {
    this.activeOffcanvas.close({
      selectedSpecialties: this.selectedSpecialties,
      min:Math.floor(this.min*100),
      max:Math.floor(this.max*100),
      fromDate: this.fromDate,
      toDate: this.toDate,
    })
  }

  resetFilters() {
    this.selectedSpecialties = []
    this.min = 0
    this.max = 0
    this.toDate = null
    this.fromDate = null
    this.activeOffcanvas.close({
      selectedSpecialties: this.selectedSpecialties,
      min:this.min,
      max:this.max,
      minSet: false,
      maxSet: false,
      toDate: this.toDate,
      fromDate: this.fromDate,
      toDateSet: false,
      fromDateSet: false
    })
  }

}
