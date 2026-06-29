import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenddingAccount } from './pendding-account';

describe('PenddingAccount', () => {
  let component: PenddingAccount;
  let fixture: ComponentFixture<PenddingAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenddingAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PenddingAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
