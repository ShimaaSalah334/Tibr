import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawFunds } from './withdraw-funds';

describe('WithdrawFunds', () => {
  let component: WithdrawFunds;
  let fixture: ComponentFixture<WithdrawFunds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WithdrawFunds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WithdrawFunds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
