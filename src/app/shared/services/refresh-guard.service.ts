import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class RefreshGuardService {

  private readonly GUARD_URLS: Array<string> = [
    'consultation/calling',
    'consultation/waiting-doctor',
    'consultation/call'
  ];

  private readonly EXCLUDE_URLS: Array<string> = [];

  constructor (private  router: Router) {}

  addListener(): void {
    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  removeListener(): void {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
  }

  private onBeforeUnload = (event: BeforeUnloadEvent): string => {
    const message = 'text';
    const currentUrl = this.router.url;
    const protectedUrl = this.getProtectedUrl(currentUrl);

    if (protectedUrl) {
      event.returnValue = message;
    }

    return protectedUrl ? message : null;
  }

  private getProtectedUrl(url: string): string {
    const excludeUrl = this.EXCLUDE_URLS.find(exclude => {
      return url.indexOf(exclude) !== -1;
    });

    if (excludeUrl) {
      return null;
    }

    return this.GUARD_URLS.find(guard => {
      return url.indexOf(guard) !== -1;
    }) ;
  }
}
