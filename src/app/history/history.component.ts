import { Component, OnInit } from '@angular/core';
import { GuardService } from '../shared/services/guard.service';
import { HistoryService } from '../shared/services/history.service';
import { BadgesService } from '../shared/services/badges.service';
import { Router } from '@angular/router';
import { ProfileApiService } from '../shared/services/profile-api.service';

@Component({
  selector: 'app-appeal-history',
  templateUrl: './history.component.html',
  styleUrls: [ './history.component.scss' ]
})
export class HistoryComponent implements OnInit {

  history;
  loading: boolean = true;
  doctors_ids = [];
  doctors;
  result = [];
  json_doctors_ids;

  constructor(private guardServ: GuardService,
              private historyService: HistoryService,
              private badgesService: BadgesService,
              private router: Router,
              private profileApi: ProfileApiService) {
    this.profileApi.checkOrLogout();
  }

  ngOnInit() {

    this.guardServ.nav_footer.footer_show = false;
    this.historyService.getAppealHistory().subscribe(response => {
      this.history = response;

      this.history.forEach(element => {

        this.doctors_ids.push(element[ 'doctor' ][ 'doctor_id' ]);

      });


      this.json_doctors_ids = {
        'ids': this.doctors_ids
      };

      this.historyService.getDoctorInfo(this.json_doctors_ids).subscribe(response => {
        this.doctors = response;
        for (let i = 0; i < this.history.length; i++) {

          this.doctors.forEach(doc => {
            if (this.history[ i ].doctor.doctor_id == doc.sub) {
              this.result.push({
                doctor_first_name: doc.first_name,
                doctor_last_name: doc.last_name,
                doctor_mid_name: doc.mid_name,
                doctor_speciality: this.history[ i ].doctor.specialty.caption,
                history_id: this.history[ i ].id,
                history_message: this.history[ i ].message,
                history_meeting_start_time: this.history[ i ].meeting_start_time,
                history_duration: this.history[ i ].duration,
              });
            }
          });
        }

        this.badgesService.getBadgesExpanded().subscribe(response => {
          if (response.appointments && response.appointments.events) {
            this.result.map(item => {
              response.appointments.events.forEach(event => {
                if (item.history_id == event.id) {
                  item.event = event.event;
                  return item;
                }
              });

              return item;
            });
          }
        });
        this.loading = false;
        console.log(this.result);
      });


    });


  }

  navComplain() {
    this.router.navigate([ './complain' ]);
  }

  correctTime(sec_num) {
    var hours;
    var minutes;
    var seconds;
    hours = Math.floor(sec_num / 3600);
    minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours == 0) {
      hours = '';
    }
    else {
      hours = hours + ' час ';
    }

    if (minutes == 0) {
      minutes = '';
    }
    else {
      minutes = minutes + ' мин ';
    }

    if (seconds == 0) {
      seconds = '';
    }
    else {
      seconds = seconds + ' сек';
    }

    var result = hours + minutes + seconds;

    return result != '' ? result : 'false';
  }

}
