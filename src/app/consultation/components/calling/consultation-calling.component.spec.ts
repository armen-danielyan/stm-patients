import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultingCallingComponent } from './consultation-calling.component';

describe('ConsultingCallingComponent', () => {
  let component: ConsultingCallingComponent;
  let fixture: ComponentFixture<ConsultingCallingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultingCallingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultingCallingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ConsultingCallingComponent', () => {
    expect(component).toBeTruthy();
  });
});
