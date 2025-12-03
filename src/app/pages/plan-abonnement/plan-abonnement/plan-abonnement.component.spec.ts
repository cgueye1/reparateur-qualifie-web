import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanAbonnementComponent } from './plan-abonnement.component';

describe('PlanAbonnementComponent', () => {
  let component: PlanAbonnementComponent;
  let fixture: ComponentFixture<PlanAbonnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanAbonnementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanAbonnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
