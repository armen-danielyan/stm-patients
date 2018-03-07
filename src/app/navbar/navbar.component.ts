import { Component, OnInit } from '@angular/core';
import { GuardService } from '../shared/services/guard.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  nav_config: any;

  constructor(private guardServ: GuardService) {

  }

  ngOnInit() {
    this.nav_config = this.guardServ.nav_footer;
    console.log(this.nav_config);
  }

}
