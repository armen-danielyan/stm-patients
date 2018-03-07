import { Component, OnInit } from '@angular/core';
import { UserLoginService } from '../shared/services/user-login.service.';
import { Router } from '@angular/router';
import { CognitoUtil, User } from '../shared/services/cognito.service';

import { NgForm } from '@angular/forms';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ScriptLoaderService } from '../shared/services/script-loader.service';
import { SpprService } from '../shared/services/sppr.service';
import { GuardService } from '../shared/services/guard.service';
import { UserAggrService } from '../shared/services/user-aggr.service';
import { ProfileApiService } from '../shared/services/profile-api.service';
import { environment } from '../../environments/environment';

declare var jquery: any;
declare var $: any;

const albumBucketName = 'stm.patient';
const bucketRegion = 'us-east-2';
const AWS = window.AWS;


@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.sass'],
  providers: [UserLoginService]
})


export class PersonalDataComponent implements OnInit {

  private userS3: any = environment.aws.s3.user;
  private baseUrl: string = environment.api.url;

  gender = [
    {
      id: 1,
      name: 'мужской'
    },
    {
      id: 2,
      name: 'женский'
    }
  ];

  mask: any[] = [/[1-9]/, /\d/, /\d/];
  desease = [];
  desease_res: any;
  desease_all = [];
  selected_desease = [];
  alergy = [];
  selected_alergy = [];
  selected_alergy_all = [];
  genders = 'Пол';
  disease = 'Выберите состояние';
  Countries: any;
  City: any;
  CountrieName = '';
  CountrieId = '';
  CountrieAll = [];
  myCity = '';
  viewdata = true;
  viewdatastring = false;
  change = false;
  alergy_name = '';
  maxDate = new Date();

  user: User = new User;
  count = 0;
  url = '/assets/img/profile/profile-default.svg';
  dow = true;
  del = false;
  // delfoto = false;
  errorMessage = '';
  value: any;
  searchText: string;
  show_select_D: boolean = false;
  show_select_A: boolean = false;
  show_select_City: boolean = false;
  show_Countrie: boolean = false;

  profile_filled: boolean = false;
  profile_filled_id: number;

  information;
  service_rules_html;

  // page:string;
  headers;
  Img;
  ImgChange;
  checkPhoto = 200;
  GeoCountrieName;
  GeoCutyName;
  search_result: boolean = false;
  gender_desease;

  loading: boolean = true;

  constructor(
    private _script: ScriptLoaderService,
    public userService: UserLoginService,
    private router: Router,
    public cUtil: CognitoUtil,
    private http: HttpClient,
    private sppr: SpprService,
    private guardServ: GuardService,
    private userAggr: UserAggrService,
    private profileApi: ProfileApiService
  ) {
    this.profileApi.checkOrLogout();
    const cognitoUser = this.cUtil.getCurrentUser();
    console.log('cognitoUser \n', cognitoUser);
    cognitoUser && cognitoUser.getSession((err, session) => {
      if (session.getIdToken().payload.phone_number_verified === false) {
        this.router.navigate(['./change/number/confirm']);
      }
    });

    !cognitoUser && this.router.navigate(['/login']);

    this.guardServ.nav_footer.footer_show = false;
    localStorage.setItem('check_card', 'false');
    console.log(this.cUtil.getCurrentUser());
    this.count++;
    if (this.count === 1) {

      this.count = 2;
      return;
    }
    console.log(this.count);


  }

  ngOnInit() {

    this._script.load('app-personal-data',
      'assets/js/lacation.js');

    console.log('sddddddddddddddddddddddddddddddddddddddddj');
    console.log(this.GeoCountrieName);
    //user aggreement modal data
    this.userAggr.getServiceRules().subscribe(response => {
      this.service_rules_html = response['text'];
      console.log(this.service_rules_html);
    });
    console.log('aaaaaaaaaaaaaaaaaaaaaa 140');
    console.log(navigator);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    localStorage.setItem('personal-data-verification', 'false');
    const cognitoUser = this.cUtil.getCurrentUser();


    this.sppr.getDisease().subscribe(response => {
        this.desease_res = response;
        this.gender_desease = response;
        for (let d of this.desease_res) {
          this.desease_all.push(d);
        }
        this.desease = this.desease_all;
      },
      error => console.log(error));


    console.log('this.desease');


    // *******************
    cognitoUser && cognitoUser.getSession((err, session) => {
      this.http.get(`https://s3.${this.userS3.region}.amazonaws.com/${this.userS3.bucket}/` +
        this.cUtil.getCurrentUser().getUsername() + '/' + 'avatar.jpeg').subscribe(response => {
          console.log('response my');
          console.log(response);
        },
        error => {
          console.log(error.status);
          this.checkPhoto = error.status;
        });

      const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', session.getIdToken().getJwtToken());

      this.http.get(`${this.baseUrl}/patient/profile/check`, {headers: headers})

        .subscribe((res) => {
          if (res['name'] && res['name'] == 'error') {
            this.profile_filled = false;
            console.log('chi lracrel => create ' + this.profile_filled);

          } else {
            this.information = res;
            this.change = true;
            localStorage.setItem('personal-data-verification', 'true');
            this.dow = false;
            console.log(typeof  this.information.allergies);
            if (this.information.allergies !== '[]' || this.information.chronic_diseases !== '[]' || this.information.allergies !== '' || this.information.chronic_diseases !== '') {
              console.log(JSON.parse(this.information.allergies));
              console.log(JSON.parse(this.information.chronic_diseases));
              this.selected_desease = JSON.parse(this.information.chronic_diseases);
              this.selected_alergy = JSON.parse(this.information.allergies);
            }
            this.viewdata = false;
            this.viewdatastring = true;
            this.user['birth_date'] = this.information.birth_date.split('T')[0];
            this.user['last_name'] = this.information.last_name;
            this.user['first_name'] = this.information.first_name;
            this.user['mid_name'] = this.information.mid_name;
            for (let g of this.gender) {
              if (g.id === this.information.gender_id) {
                this.genders = g.name;
                this.getValue(g.id, g.name);
              }
              this.user['height'] = this.information.height;
              this.user['height'] = this.information.height;
              this.user['weight'] = this.information.weight;
              this.CountrieName = this.information.country;
              this.myCity = this.information.city;


              console.log(this.information);
              console.log(this.user);
            }
            console.log('ffffff', this.checkPhoto);
            if (this.checkPhoto != 200) {
              console.log('chka nkar');
              this.url = '/assets/img/profile/profile-default.svg';

            }
            else {
              console.log('ka nkar')
              this.url = `https://s3.${this.userS3.region}.amazonaws.com/${this.userS3.bucket}/` +
                this.cUtil.getCurrentUser().getUsername() + '/' + 'avatar.jpeg';
            }


            console.log(res['id']);
            this.profile_filled_id = res['id'];
            this.profile_filled = true;

            console.log('lracrel a => update u vercnel datan cuyc tal ' + this.profile_filled);
          }
          this.loading = false;
        });
    });
  }

  searchCountries(ev) {
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      console.log(this.user);
      this.headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', session.getIdToken().getJwtToken());
    });
    const a = [];
    if (ev.length <= 3) {
      console.log(ev.length);
      this.show_Countrie = false;
      this.Countries = [];
    }
    if (ev.length >= 3) {
      console.log(this.headers);
      this.http.get(`${this.baseUrl}/patient/core/reference/country?name=` + ev, {headers: this.headers})
        .subscribe((res) => {
          console.log('RESSSULT');
          console.log(res);
          this.Countries = res;
          this.show_Countrie = true;
        });
    }
  }

  dataview() {
    this.viewdata = true;
    this.viewdatastring = false;
  }


  ngAfterViewInit() {
    this._script.load('app-personal-data',
      'assets/js/select/select.js');
  }


  logoutUser() {
    this.userService.logout();
    localStorage.setItem('isloggedin', 'false');
    localStorage.setItem('personal_data_page', 'false');
    localStorage.setItem('phone_number', '');
    localStorage.setItem('register-step-1', 'false');
    localStorage.setItem('register-step-2', 'false');
    localStorage.setItem('register-step-3', 'false');
    localStorage.clear();
    console.log('logouted');
    this.router.navigate(['./login']);
  }

  ChangePassword() {
    this.router.navigate(['./change/password']);
  }

  selectDesease(ev) {
    this.desease = this.desease.filter((e) => {
      return e != ev;
    });
    console.log(this.desease);
    this.show_select_D = false;
    this.selected_desease.push(ev);

    console.log(this.selected_desease);
  }

  deleteSelectedDesase(ev, index) {
    this.selected_desease.splice(index, 1);
    this.desease.push(ev);
  }

  selectAlergy(ev) {
    this.alergy = this.alergy.filter((e) => {
      return e != ev;
    });
    console.log(ev);
    this.show_select_A = false;
    this.selected_alergy.push(ev);
    this.alergy_name = '';


    console.log(this.selected_alergy);
  }

  deleteSelectedAlergy(ev, index) {
    this.selected_alergy.splice(index, 1);
    this.alergy.push(ev);
  }


  getValue(e_id, e_name) {
    this.user['gender_id'] = e_id;
    this.genders = e_name;
    this.desease = this.gender_desease;
    if( e_id == 1 && this.desease ) {
      this.desease = this.desease.filter((e)=>{
        return !e.name.includes('Лактация') && !e.name.includes('Беременность');
      });
    }
    console.log(this.desease);
  }

  onSubmitData(form: NgForm) {
    console.log('ahjdgaddahgda');
    console.log(this.GeoCountrieName);
    this.user['chronic_diseases'] = JSON.stringify(this.selected_desease);
    this.user['allergies'] = JSON.stringify(this.selected_alergy);
    this.user['height'] = +this.user.height;
    this.user['weight'] = +this.user.weight;
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      console.log(this.user);
      const headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', session.getIdToken().getJwtToken());
      if (this.profile_filled == false) {
        this.http.post(`${this.baseUrl}/patient/profile/add`, this.user, {headers: headers})

          .subscribe((res) => {
            if (res['name'] === 'success') {
              localStorage.setItem('personal-data-verification', 'true');
              this.router.navigate(['./main']);
            } else {
              console.log(res);
            }
          });
      } else {
        this.http.post(`${this.baseUrl}/patient/profile/update/` + this.profile_filled_id, this.user, {headers: headers})

          .subscribe((res) => {
            if (res['name'] === 'success') {
              localStorage.setItem('personal-data-verification', 'true');
              this.router.navigate(['./main']);
            } else {
              console.log(res);
            }
          });
      }

    });
  }

  readUrl(event: any) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size <= 2500000) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.url = event.target.result;
        };
        reader.readAsDataURL(event.target.files[0]);

        this.del = true;
        this.dow = false;
        this.change = false;
        this.errorMessage = '';
      } else {
        console.log(event.target.files[0].size);
        this.errorMessage = 'The maximum avatar size must be 2.4 M';
        return;
      }
    }

    this.userService.createPhoto(event.target.files[0].name, event.target.files[0]);
  }

  deletePhoto(name) {
    this.userService.deletePhoto(name);
    this.url = '/assets/img/profile/profile-default.svg';
    this.del = false;
    this.dow = true;
  }


  searchAlergy(ev) {
    this.search_result = true;
    console.log(ev);
    if (ev.length >= 3) {
      this.sppr.getAlergy(ev).subscribe(res => {
        console.log(res);
        if (res instanceof Array) {
          this.selected_alergy_all = res.map(value => {
            return value;
          });
          this.search_result = false;
          this.alergy = this.selected_alergy_all;
        }
      });
      console.log(this.selected_alergy_all);
    } else {
      this.search_result = false;
      this.alergy = [];
    }
  }


  clickInputA() {
    if (!this.show_select_A) {
      this.show_select_A = true;
    }


  }

  ChangeNumber() {
    this.router.navigate(['./change/number/confirm']);
  }


  getCountries(id, name) {
    console.log(name);
    this.CountrieName = name;
    this.show_Countrie = false;
    this.CountrieId = id;
  }

  searchCity(name) {
    const cognitoUser = this.cUtil.getCurrentUser();
    cognitoUser && cognitoUser.getSession((err, session) => {
      console.log(this.user);
      this.headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', session.getIdToken().getJwtToken());
    });
    if (name.length >= 3) {
      console.log(name);
      this.show_select_City = true;
      if (this.CountrieId !== '') {
        console.log('this.CountrieId ************');
        console.log(this.CountrieId);
        this.http.get(`${this.baseUrl}/patient/core/reference/city?country_id=` + this.CountrieId +
          '&name=' + name, {headers: this.headers})
          .subscribe((res) => {
            console.log(res);
            this.City = res;
            this.show_select_City = true;
          });
        console.log(this.City);
      }
    } else {
      this.show_select_City = false;
      this.City = [];

    }
  }


  createCity(city) {
    this.myCity = city.name;
    this.show_select_City = false;
    this.user['city'] = city.name;
    this.user['country'] = this.CountrieName;

  }
}

export const
  MY_FORMATS = {
    parse: {
      dateInput: 'L',
    },
    display: {
      dateInput: 'L',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'L',
      monthYearA11yLabel: 'MMMM YYYY',
    },
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'DD.MM.YYYY',
      LL: 'D MMMM YYYY',
      LLL: 'D MMMM YYYY HH:mm',
      LLLL: 'dddd, D MMMM YYYY HH:mm'
    },
  };
