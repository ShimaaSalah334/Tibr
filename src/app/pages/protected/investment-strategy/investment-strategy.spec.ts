import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentStrategy } from './investment-strategy';

describe('InvestmentStrategy', () => {
  let component: InvestmentStrategy;
  let fixture: ComponentFixture<InvestmentStrategy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentStrategy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentStrategy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
