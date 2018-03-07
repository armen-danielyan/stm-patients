import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GuardService {
  public nav_footer: any = {
    header_show: true,
    footer_show: true
  };

  constructor(private router: Router) {

  }

  getUserLoggedIn() {
    if (localStorage.getItem('isloggedin') === 'false') {
      this.router.navigate(['/login']);
    }
    if (!localStorage.getItem('isloggedin')) {
      this.router.navigate(['/login']);
    }
    return true;
  }

  personalDataPage() {
    if (localStorage.getItem('personal_data_page') === 'true') {
      this.router.navigate(['/personal-data']);
    }
    return true;
  }

  registerStep1() {
    if (localStorage.getItem('register-step-1') !== 'true') {
      return this.router.navigate(['/register']);
    }
    return true;
  }

  registerStep2() {
    if (localStorage.getItem('register-step-2') === 'true') {
      this.router.navigate(['/register/confirm']);
    }
    return true;
  }

  mainGuard() {
    if (localStorage.getItem('personal-data-verification') !== 'true') {
      this.router.navigate(['/personal-data']);
    } else {
      return true;
    }
  }

  personalView() {
    if (localStorage.getItem('personal-data-verification') !== 'true') {
      this.router.navigate(['/personal-data']);
    } else {
      return true;
    }
  }

}
