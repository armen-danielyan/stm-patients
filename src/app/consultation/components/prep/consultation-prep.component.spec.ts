import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationPrepComponent } from './consultation-prep.component';

describe('ConsultationPrepComponent', () => {
  let component: ConsultationPrepComponent;
  let fixture: ComponentFixture<ConsultationPrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultationPrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultationPrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ConsultationPrepComponent', () => {
    expect(component).toBeTruthy();
  });
});
