import { TestBed } from '@angular/core/testing';

import { FlixbusService } from './flixbus.service';

describe('FlixbusService', () => {
  let service: FlixbusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlixbusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
