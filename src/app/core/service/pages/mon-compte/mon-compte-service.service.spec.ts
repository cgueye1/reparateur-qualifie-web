import { TestBed } from '@angular/core/testing';

import { MonCompteServiceService } from './mon-compte-service.service';

describe('MonCompteServiceService', () => {
  let service: MonCompteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonCompteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
