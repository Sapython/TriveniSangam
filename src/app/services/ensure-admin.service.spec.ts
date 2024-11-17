import { TestBed } from '@angular/core/testing';

import { EnsureAdminService } from './ensure-admin.service';

describe('EnsureAdminService', () => {
  let service: EnsureAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnsureAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
