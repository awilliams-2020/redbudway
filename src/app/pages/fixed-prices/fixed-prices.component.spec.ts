import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedPricesComponent } from './fixed-prices.component';

describe('FixedPricesComponent', () => {
  let component: FixedPricesComponent;
  let fixture: ComponentFixture<FixedPricesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedPricesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedPricesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
