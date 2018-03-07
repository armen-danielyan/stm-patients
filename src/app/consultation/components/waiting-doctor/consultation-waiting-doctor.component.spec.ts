import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingDoctorComponent } from './consultation-waiting-doctor.component';

describe('WaitingDoctorComponent', () => {
  let component: WaitingDoctorComponent;
  let fixture: ComponentFixture<WaitingDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create WaitingDoctorComponent', () => {
    expect(component).toBeTruthy();
  });
});
