import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerfiyKYC } from './verfiy-kyc';

describe('VerfiyKYC', () => {
  let component: VerfiyKYC;
  let fixture: ComponentFixture<VerfiyKYC>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerfiyKYC]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerfiyKYC);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
