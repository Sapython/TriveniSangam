import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HousekeepingCardComponent } from './housekeeping-card.component';

describe('HousekeepingCardComponent', () => {
  let component: HousekeepingCardComponent;
  let fixture: ComponentFixture<HousekeepingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HousekeepingCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HousekeepingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
