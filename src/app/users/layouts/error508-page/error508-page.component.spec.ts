import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Error508PageComponent } from './error508-page.component';

describe('Error508PageComponent', () => {
  let component: Error508PageComponent;
  let fixture: ComponentFixture<Error508PageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Error508PageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Error508PageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
