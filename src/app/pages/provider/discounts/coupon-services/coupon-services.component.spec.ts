import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponServicesComponent } from './coupon-services.component';

describe('CouponServicesComponent', () => {
  let component: CouponServicesComponent;
  let fixture: ComponentFixture<CouponServicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CouponServicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CouponServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
