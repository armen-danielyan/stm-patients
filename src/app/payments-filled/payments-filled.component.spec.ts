import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsFilledComponent } from './payments-filled.component';

describe('PaymentsFilledComponent', () => {
  let component: PaymentsFilledComponent;
  let fixture: ComponentFixture<PaymentsFilledComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsFilledComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsFilledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create PaymentsFilledComponent', () => {
    expect(component).toBeTruthy();
  });
});
