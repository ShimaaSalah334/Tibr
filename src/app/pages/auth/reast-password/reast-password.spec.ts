import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReastPassword } from './reast-password';

describe('ReastPassword', () => {
  let component: ReastPassword;
  let fixture: ComponentFixture<ReastPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReastPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReastPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
