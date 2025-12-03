import { TestBed } from '@angular/core/testing';

import { ServiceTopbarSidebarService } from './service-topbar-sidebar.service';

describe('ServiceTopbarSidebarService', () => {
  let service: ServiceTopbarSidebarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceTopbarSidebarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
