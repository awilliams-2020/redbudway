import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualInvoicesComponent } from './manual-invoices.component';

describe('ManualInvoicesComponent', () => {
  let component: ManualInvoicesComponent;
  let fixture: ComponentFixture<ManualInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualInvoicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
