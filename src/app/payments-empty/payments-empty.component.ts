import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuardService } from '../shared/services/guard.service';

@Component({
  selector: 'app-payments-empty',
  templateUrl: './payments-empty.component.html',
  styleUrls: ['./payments-empty.component.scss']
})
export class PaymentsEmptyComponent implements OnInit {

  constructor(private router: Router, private guardServ: GuardService) {
    this.guardServ.nav_footer.footer_show = false;
  }

  ngOnInit() {
  }

  redirectPaymentsAddCard() {
    this.router.navigate(['./payments-card']);
  }
}
