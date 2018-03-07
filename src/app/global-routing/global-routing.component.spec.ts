import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalRoutingComponent } from './global-routing.component';

describe('GlobalRoutingComponent', () => {
  let component: GlobalRoutingComponent;
  let fixture: ComponentFixture<GlobalRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create GlobalRoutingComponent', () => {
    expect(component).toBeTruthy();
  });
});
