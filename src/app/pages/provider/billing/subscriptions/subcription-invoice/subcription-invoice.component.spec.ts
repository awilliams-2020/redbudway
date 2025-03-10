import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcriptionInvoiceComponent } from './subcription-invoice.component';

describe('SubcriptionInvoiceComponent', () => {
  let component: SubcriptionInvoiceComponent;
  let fixture: ComponentFixture<SubcriptionInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubcriptionInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcriptionInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
