import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payments-process',
  templateUrl: './payments-process.component.html',
  styleUrls: ['./payments-process.component.scss']
})
export class PaymentsProcessComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit() {
  }

  redirectPaymentsFill() {
    localStorage.setItem('check_card', 'true');
    this.router.navigate(['./payments-filled']);
  }
}
