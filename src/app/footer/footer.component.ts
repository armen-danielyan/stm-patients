import { Component, OnInit } from '@angular/core';
import { GuardService } from '../shared/services/guard.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  nav_config: any;

  constructor(private guardServ: GuardService) {
    this.nav_config = this.guardServ.nav_footer;
  }

  ngOnInit() {

  }

}
