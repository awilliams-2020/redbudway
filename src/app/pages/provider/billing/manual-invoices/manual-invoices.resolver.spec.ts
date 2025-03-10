import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { manualInvoicesResolver } from './manual-invoices.resolver';

describe('manualInvoicesResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => manualInvoicesResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
