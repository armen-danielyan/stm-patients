import { Component, OnInit } from '@angular/core';
import { GlobalRoutingService } from '../shared/services/global-routing.service';

@Component({
  selector: 'app-global-routing',
  templateUrl: './global-routing.component.html',
  styleUrls: ['./global-routing.component.scss']
})
export class GlobalRoutingComponent implements OnInit {

  page: string;

  constructor(private globalService: GlobalRoutingService) {
  }

  ngOnInit() {
    this.globalService.currentpage.subscribe(page => this.page = page);
  }

}
