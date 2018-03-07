import { Inject, Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MatDialog } from '@angular/material';

export interface ICanDeactivateComponent {
  canDeactivate(): Observable<boolean> | boolean;
}

@Injectable()
export class CanDeactivateDialogGuard implements CanDeactivate<ICanDeactivateComponent> {

  constructor() {
  }

  canDeactivate(component: ICanDeactivateComponent): Observable<boolean> | boolean {
    return component.canDeactivate();
  }
}
