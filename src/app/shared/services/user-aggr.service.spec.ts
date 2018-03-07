import { TestBed, inject } from '@angular/core/testing';
import { UserAggrService } from './user-aggr.service';

describe('UserAggrService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAggrService]
    });
  });

  it('should be created', inject([UserAggrService], (service: UserAggrService) => {
    expect(service).toBeTruthy();
  }));
});
