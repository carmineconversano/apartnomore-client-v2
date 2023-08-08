import {TestBed} from '@angular/core/testing';

import {CommunityGuard} from './community.guard';

describe('CommunityGuard', () => {
  let guard: CommunityGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CommunityGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
