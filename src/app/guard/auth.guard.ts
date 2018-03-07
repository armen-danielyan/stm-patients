import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { GuardService } from '../shared/services/guard.service';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private guard: GuardService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.guard.getUserLoggedIn();
  }
}
