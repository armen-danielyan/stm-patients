import { inject, TestBed } from '@angular/core/testing';

import { PersonalViewGuard } from './personal-view.guard';

describe('PersonalViewGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PersonalViewGuard]
    });
  });

  it('should ...', inject([PersonalViewGuard], (guard: PersonalViewGuard) => {
    expect(guard).toBeTruthy();
  }));
});
