import { Component, OnInit } from '@angular/core';
import { GuardService } from '../shared/services/guard.service';

@Component({
  selector: 'app-payments-filled',
  templateUrl: './payments-filled.component.html',
  styleUrls: ['./payments-filled.component.scss']
})
export class PaymentsFilledComponent implements OnInit {

  constructor(private guardServ: GuardService) {
    this.guardServ.nav_footer.footer_show = false;
  }

  ngOnInit() {
  }


}
