import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PaymentsEmptyComponent} from './payments-empty.component';

describe('PaymentsEmptyComponent', () => {
  let component: PaymentsEmptyComponent;
  let fixture: ComponentFixture<PaymentsEmptyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentsEmptyComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create PaymentsEmptyComponent', () => {
    expect(component).toBeTruthy();
  });
});
