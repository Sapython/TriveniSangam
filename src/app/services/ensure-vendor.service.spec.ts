import { TestBed } from '@angular/core/testing';

import { EnsureVendorService } from './ensure-vendor.service';

describe('EnsureVendorService', () => {
  let service: EnsureVendorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnsureVendorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
