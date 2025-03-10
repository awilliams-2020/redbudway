import { TestBed } from '@angular/core/testing';

import { UnitedStatesService } from './united-states.service';

describe('UnitedStatesService', () => {
  let service: UnitedStatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitedStatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
