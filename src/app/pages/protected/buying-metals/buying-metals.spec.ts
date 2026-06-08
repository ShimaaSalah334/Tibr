import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyingMetals } from './buying-metals';

describe('BuyingMetals', () => {
  let component: BuyingMetals;
  let fixture: ComponentFixture<BuyingMetals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyingMetals]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyingMetals);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
