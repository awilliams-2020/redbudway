import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberFormComponent } from './number-form.component';

describe('NumberFormComponent', () => {
  let component: NumberFormComponent;
  let fixture: ComponentFixture<NumberFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NumberFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
