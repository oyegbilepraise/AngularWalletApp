import { TestBed } from '@angular/core/testing';

import { BankGuard } from './bank.guard';

describe('BankGuard', () => {
  let guard: BankGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BankGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
