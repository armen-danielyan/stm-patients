import { Component, OnInit } from '@angular/core';
import { GuardService } from '../../../shared/services/guard.service';
import { ReferencesService } from '../../services/references.service';
import { HistoryService } from '../../../shared/services/history.service';
import { ProfileApiService } from '../../../shared/services/profile-api.service';

@Component({
  selector: 'app-consultation-endcall',
  templateUrl: './consultation-end.component.html',
  styleUrls: ['./consultation-end.component.scss']
})
export class ConsultationEndComponent implements OnInit {

  room_id;
  req_id;
  docor_id;
  first_name;
  last_name;
  mid_name;
  doctor_spec;
  call_duration;
  show_waiting_time;
  loading: boolean = true;

  constructor(private guardServ: GuardService, private referenceService: ReferencesService, private historyService: HistoryService, private profileApi: ProfileApiService) {
    this.profileApi.checkOrLogout();
    this.guardServ.nav_footer.footer_show = false;
    this.guardServ.nav_footer.header_show = true;

    console.log(window);
  }

  ngOnInit() {
    this.req_id = localStorage.getItem('req_id');
    console.log(this.req_id);

    this.room_id = localStorage.getItem('app_id');

    //get info about appointment
    this.referenceService.getInfoAppointment(this.room_id).subscribe(response => {
      console.log(response['duration']);
      this.call_duration = response['duration'];
      if (this.call_duration < 60) {
        this.show_waiting_time = this.call_duration + ' сек.';
      }
      else {
        this.show_waiting_time = Math.floor(this.call_duration / 60) + ' мин. ' + this.call_duration % 60 + ' сек.';
      }

      this.doctor_spec = response['doctor']['specialty']['caption_key'];
      this.docor_id = {
        'ids': response['doctor']['doctor_id']
      };
      this.historyService.getDoctorInfo(this.docor_id).subscribe(response => {
        console.log(response[0]);
        this.first_name = response[0]['first_name'];
        this.last_name = response[0]['last_name'];
        this.mid_name = response[0]['mid_name'];
        this.loading = false;
      });
    });

  }
}
