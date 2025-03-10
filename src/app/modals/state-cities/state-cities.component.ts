import { CommonModule, PlatformLocation } from '@angular/common'
import { Component, inject, Input, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { UnitedStatesService } from '../../services/united-states.service'

interface City {
  name: string
}

@Component({
  selector: 'app-state-cities',
  imports: [FormsModule, CommonModule],
  templateUrl: './state-cities.component.html',
  styleUrls: ['./state-cities.component.css']
})
export class StateCitiesComponent implements OnInit {
  public activeModal = inject(NgbActiveModal)
  private location = inject(PlatformLocation)
  public unitedStates = inject(UnitedStatesService).getUS()

  @Input() statesAndCitiesMap: Map<string, []> = new Map()

  selectedStates: any[] = []
  citiesLookUp: Map<string, City[]> = new Map()

  constructor() {
    this.location.onPopState(() => this.activeModal.close());
  }

  ngOnInit(): void {
    for (let state of this.unitedStates) {
      this.citiesLookUp.set(state.name, state.cities)
    }
    this.statesAndCitiesMap.forEach((value, key, map) => {
      this.selectedStates.push(key)
    })
  }

  resolveCities(state: string): any[] {
    let cities = this.citiesLookUp.get(state) || []
    return cities
  }

  compareCities(c1:any, c2:any) {
    return c1.name === c2.name
  }

  save() {
    for (let state of this.unitedStates) {
      let found = false
      for (let state of this.selectedStates) {
        if (state.name === state) {
          found = true
        }
      }
      if (!found) {
        this.statesAndCitiesMap.delete(state.name)
      }
    }
    this.activeModal.close(this.statesAndCitiesMap)
  }

}
