import { TestBed } from '@angular/core/testing';

import { GestionMetierService } from './gestion-metier.service';

describe('GestionMetierService', () => {
  let service: GestionMetierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionMetierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
