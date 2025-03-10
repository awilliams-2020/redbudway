import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedPriceComponent } from './fixed-price.component';

describe('FixedPriceComponent', () => {
  let component: FixedPriceComponent;
  let fixture: ComponentFixture<FixedPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FixedPriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixedPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
