import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailVerificationComponent } from './detail-verification.component';

describe('DetailVerificationComponent', () => {
  let component: DetailVerificationComponent;
  let fixture: ComponentFixture<DetailVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailVerificationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
