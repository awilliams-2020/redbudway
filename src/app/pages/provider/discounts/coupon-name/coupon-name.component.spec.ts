import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponNameComponent } from './coupon-name.component';

describe('CouponNameComponent', () => {
  let component: CouponNameComponent;
  let fixture: ComponentFixture<CouponNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponNameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
