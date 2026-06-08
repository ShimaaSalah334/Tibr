import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingMetals } from './selling-metals';

describe('SellingMetals', () => {
  let component: SellingMetals;
  let fixture: ComponentFixture<SellingMetals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellingMetals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellingMetals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
