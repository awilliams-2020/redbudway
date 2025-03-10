import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAreasComponent } from './select-areas.component';

describe('SelectAreasComponent', () => {
  let component: SelectAreasComponent;
  let fixture: ComponentFixture<SelectAreasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAreasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
