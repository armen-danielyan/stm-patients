import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CallComponent } from './consultation-call.component';

describe('CallComponent', () => {
  let component: CallComponent;
  let fixture: ComponentFixture<CallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create CallComponent', () => {
    expect(component).toBeTruthy();
  });

  // it(`should have as title 'app works!'`, async(() => {
  //   const fixture = TestBed.createComponent(CallComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('app-call');
  // }));

});
