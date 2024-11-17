import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewGuestComponent } from './create-new-guest.component';

describe('CreateNewGuestComponent', () => {
  let component: CreateNewGuestComponent;
  let fixture: ComponentFixture<CreateNewGuestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewGuestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
