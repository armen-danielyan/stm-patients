import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuardService } from '../shared/services/guard.service';

@Component({
  selector: 'app-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss']
})
export class PaymentCardComponent implements OnInit {

  constructor(private router: Router, private guardServ: GuardService) {
    this.guardServ.nav_footer.footer_show = false;
  }

  ngOnInit() {
  }

  redirectPaymentsFill() {
    localStorage.setItem('check_card', 'true');
    this.router.navigate(['./payments-filled']);
  }

}
