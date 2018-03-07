import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class GlobalRoutingService {

  private pageSource = new BehaviorSubject('');
  currentpage = this.pageSource.asObservable();

  constructor() {
    if (localStorage.getItem('isloggedin') === 'true') {
      this.changePage('personal-data');
    }
    else {
      this.changePage('login');
    }
  }

  changePage(page: string) {
    this.pageSource.next(page);
  }

}
