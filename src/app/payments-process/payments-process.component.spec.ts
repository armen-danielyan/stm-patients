import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsProcessComponent } from './payments-process.component';

describe('PaymentsProcessComponent', () => {
  let component: PaymentsProcessComponent;
  let fixture: ComponentFixture<PaymentsProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
