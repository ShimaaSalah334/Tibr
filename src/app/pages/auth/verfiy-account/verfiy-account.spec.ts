import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerfiyAccount } from './verfiy-account';

describe('VerfiyAccount', () => {
  let component: VerfiyAccount;
  let fixture: ComponentFixture<VerfiyAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerfiyAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerfiyAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
