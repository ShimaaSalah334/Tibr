import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAcademyComponent } from './ai-academy-component';

describe('AiAcademyComponent', () => {
  let component: AiAcademyComponent;
  let fixture: ComponentFixture<AiAcademyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiAcademyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiAcademyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
