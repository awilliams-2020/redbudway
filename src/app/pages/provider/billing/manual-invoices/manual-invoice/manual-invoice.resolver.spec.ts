import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { manualInvoiceResolver } from './manual-invoice.resolver';

describe('manualInvoiceResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => manualInvoiceResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
