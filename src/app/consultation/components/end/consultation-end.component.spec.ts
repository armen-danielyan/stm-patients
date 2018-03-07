import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationEndcallComponent } from './consultation-end.component';

describe('ConsultationEndcallComponent', () => {
  let component: ConsultationEndcallComponent;
  let fixture: ComponentFixture<ConsultationEndcallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationEndcallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationEndcallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ConsultationEndcallComponent', () => {
    expect(component).toBeTruthy();
  });
});
