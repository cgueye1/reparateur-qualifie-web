import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionMetiersComponent } from './gestion-metiers.component';

describe('GestionMetiersComponent', () => {
  let component: GestionMetiersComponent;
  let fixture: ComponentFixture<GestionMetiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionMetiersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionMetiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
