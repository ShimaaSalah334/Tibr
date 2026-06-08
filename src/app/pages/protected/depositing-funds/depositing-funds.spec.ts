import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepositingFunds } from './depositing-funds';

describe('DepositingFunds', () => {
  let component: DepositingFunds;
  let fixture: ComponentFixture<DepositingFunds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepositingFunds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepositingFunds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
