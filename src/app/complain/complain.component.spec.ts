import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplainComponent } from './complain.component';

describe('ComplainComponent', () => {
  let component: ComplainComponent;
  let fixture: ComponentFixture<ComplainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ComplainComponent', () => {
    expect(component).toBeTruthy();
  });
});
