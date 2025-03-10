import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateCitiesComponent } from './state-cities.component';

describe('StateCitiesComponent', () => {
  let component: StateCitiesComponent;
  let fixture: ComponentFixture<StateCitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StateCitiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StateCitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
