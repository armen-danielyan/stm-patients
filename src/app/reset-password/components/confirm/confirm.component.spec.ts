import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Reset3Component } from './confirm.component';

describe('Reset3Component', () => {
  let component: Reset3Component;
  let fixture: ComponentFixture<Reset3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Reset3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Reset3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Reset3Component', () => {
    expect(component).toBeTruthy();
  });
});
