import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditRoomComponent } from './view-edit-room.component';

describe('ViewEditRoomComponent', () => {
  let component: ViewEditRoomComponent;
  let fixture: ComponentFixture<ViewEditRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewEditRoomComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEditRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
