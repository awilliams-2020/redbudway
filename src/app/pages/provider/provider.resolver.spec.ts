import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { providerResolver } from './provider.resolver';

describe('providerResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => providerResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
