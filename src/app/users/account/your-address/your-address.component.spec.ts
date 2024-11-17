import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourAddressComponent } from './your-address.component';

describe('YourAddressComponent', () => {
  let component: YourAddressComponent;
  let fixture: ComponentFixture<YourAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
