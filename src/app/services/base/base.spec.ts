import { TestBed } from '@angular/core/testing';

import { BaseService } from './base';

describe('Base', () => {
  let service: BaseService<null>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
