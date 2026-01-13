import { TestBed } from '@angular/core/testing';

import { SwettAlerteService } from './swett-alerte.service';

describe('SwettAlerteService', () => {
  let service: SwettAlerteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwettAlerteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
