import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTibr } from './team-tibr';

describe('TeamTibr', () => {
  let component: TeamTibr;
  let fixture: ComponentFixture<TeamTibr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamTibr]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamTibr);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
