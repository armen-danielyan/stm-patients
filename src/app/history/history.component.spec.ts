import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppealHistoryComponent } from './history.component';

describe('AppealHistoryComponent', () => {
  let component: AppealHistoryComponent;
  let fixture: ComponentFixture<AppealHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppealHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppealHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create AppealHistoryComponent', () => {
    expect(component).toBeTruthy();
  });
});
