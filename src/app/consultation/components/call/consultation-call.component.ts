import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ScriptLoaderService } from '../../../shared/services/script-loader.service';
import { GuardService } from '../../../shared/services/guard.service';
import { Router } from '@angular/router';
import { VideoChatService } from '../../services/video-chat.service';
import { ChatService } from '../../services/chat.service';
import { ChatCallback } from '../../../shared/services/cognito.service';
import { ReferencesService } from '../../services/references.service';
import { HistoryService } from '../../../shared/services/history.service';
import { Observable } from 'rxjs/Observable';
import { SkylinkService } from '../../services/skylink.service';
import { ProfileApiService } from '../../../shared/services/profile-api.service';
import { DialogComponent, IDialogData } from '../../../shared/components/dialog/dialog.component';
import { ICanDeactivateComponent } from '../../../guard/can-deactivate-dialog.guard';
import { MatDialog } from '@angular/material';


@Component({
  selector: 'app-call',
  templateUrl: './consultation-call.component.html',
  styleUrls: [ './consultation-call.component.scss' ],
  providers: [ ScriptLoaderService ]
})

export class ConsultationCallComponent implements ChatCallback, AfterViewChecked, OnInit, AfterViewInit, ICanDeactivateComponent {
  camera: boolean = true;
  microphone: boolean = true;
  chat: boolean = false;
  fileurl = '';
  errorColor = '';
  req_id;
  room_id;
  loadingupload;
  upolad_file = false;
  online = 'none';
  Color = '';
  docor_id;
  first_name;
  last_name;
  mid_name;
  doctor_spec;

  online_hiden = true;

  ticks = 0;
  timer;
  minutesDisplay = 0;
  hoursDisplay = 0;
  secondsDisplay = 0;
  meeting_start_time;
  chat_video = 'video_show';

  private isCallFinish = false;

  @ViewChild('myFil') myFil: ElementRef;

  constructor(public videoService: VideoChatService,
              private _script: ScriptLoaderService,
              private guardServ: GuardService,
              private router: Router,
              public upload: ChatService,
              private eleRef: ElementRef,
              private referenceService: ReferencesService,
              private historyService: HistoryService,
              private skylinkService: SkylinkService,
              private profileApi: ProfileApiService,
              private dialog: MatDialog) {
    window[ 'endCallPacient' ] = true;
    this.profileApi.checkOrLogout();
  }

  ngOnInit() {

    localStorage.setItem('page3', 'true');
    this.startTimer();
    this.guardServ.nav_footer.header_show = false;
    this.guardServ.nav_footer.footer_show = false;

    // get request id from local storage
    this.req_id = localStorage.getItem('req_id');
  }

  ngOnDestroy() {
    this.guardServ.nav_footer.header_show = true;
  }

  ngAfterViewInit() {
    this.room_id = localStorage.getItem('app_id');
    console.log('rooooooooommmmmmmmm_id *************', this.room_id);
    // this._script.load('app-call',
    //   'assets/js/chat/edge-attachmediastream.js');
    this.skylinkService.init(this.room_id.toString());
    // get info about appointment
    this.referenceService.getInfoAppointment(this.room_id).subscribe(response => {
      this.doctor_spec = response[ 'doctor' ][ 'specialty' ][ 'caption_key' ];
      this.docor_id = {
        'ids': response[ 'doctor' ][ 'doctor_id' ]
      };
      this.historyService.getDoctorInfo(this.docor_id).subscribe(response => {
        this.first_name = response[ 0 ][ 'first_name' ];
        this.last_name = response[ 0 ][ 'last_name' ];
        this.mid_name = response[ 0 ][ 'mid_name' ];
      });
    });

  }

  redirectChat() {
    this.online_hiden = true;
    this.chat = true;
    this.chat_video = 'chat_video_show';

  }

  redirectVideo() {
    this.chat = false;
    this.chat_video = 'video_show';
  }

  on_off_camera() {
    if (this.camera) {
      this.camera = false;
      this.videoService.off_camera();
    }
    else {
      this.camera = true;
      this.videoService.on_camera();
    }

  }

  on_off_microphone() {
    if (this.microphone) {
      this.microphone = false;
      this.videoService.off_microphone();
    } else {
      this.microphone = true;
      this.videoService.on_microphone();
    }

  }


  ngAfterViewChecked() {
    if (window[ 'endCallPacient' ] === false) {
      this.videoService.live_room();
      this.isCallFinish = true;
      this.router.navigate([ './consultation/end' ]);
    }
  }


  end_call() {
    this.referenceService.finishAppointment(this.room_id).subscribe(response => {
      this.videoService.live_room();
      this.isCallFinish = true;
      this.router.navigate([ './consultation/end' ]);
    });
  }

  FileUpload(event: any) {
    if (event.target.files && event.target.files[ 0 ]) {
      if (event.target.files[ 0 ].size <= 10003010) {
        const reader = new FileReader();

        reader.onload = (event: any) => {
        };
        this.upload.fileUploadChat(event.target.files[ 0 ].name, event.target.files[ 0 ], this);
        this.errorColor = '';
      } else {
        this.fileurl = 'минимальный размер файла - 10M';
        this.errorColor = 'red';
        return;
      }


    }

  }

  ChatCallback(data: string, result: any) {
    this.errorColor = '#fff';
    if (result === '100%') {
      result = '97%';
      this.loadingupload = result;

      setTimeout(() => {
        result = '80%';
        this.loadingupload = result;
        result = '100%';
        this.loadingupload = result;
        this.upolad_file = false;
      }, 500);

    }

    this.fileurl = data;
    this.Color = '#FFF';
    setTimeout(() => {
      document.getElementById('MessageInputButton').click();
      this.Color = '';
    }, -15);

    if (result) {
      this.upolad_file = true;
      this.loadingupload = result;
      if (this.loadingupload === '100%') {
        this.upolad_file = false;
        this.fileurl = data;
      }
    }
    this.errorColor = '';

  }

  FileUploadCall() {
    this.chat = true;
    const el: HTMLElement = this.myFil.nativeElement as HTMLElement;
    el.click();
  }

  styleMethod() {
    return {
      color: this.errorColor,
    };
  }

  canDeactivate(): Observable<boolean> | boolean {

    if (this.isCallFinish) {
      return true;
    }

    const data: IDialogData = {
      title: 'Подтверждение действия',
      text: `
        Вы пытаетесь покинуть страницу!
        В случае подтверждения вашего действия соединение с доктором
        разорвется и прием будет завершен
      `
    };

    return DialogComponent.createModalAndGetResult(data, this.dialog);
  }

  private startTimer() {

    this.timer = Observable.timer(1, 1000);
    this.timer.subscribe(
      t => {
        this.ticks = t;
        this.secondsDisplay = this.getSeconds(this.ticks);
        this.minutesDisplay = this.getMinutes(this.ticks);
        this.hoursDisplay = this.getHours(this.ticks);
      }
    );
  }


  private getSeconds(ticks: number) {
    return this.pad(ticks % 60);
  }

  private getMinutes(ticks: number) {
    return this.pad((Math.floor(ticks / 60)) % 60);
  }

  private getHours(ticks: number) {
    return this.pad(Math.floor((ticks / 60) / 60));
  }

  private pad(digit: any) {
    return digit <= 9 ? '0' + digit : digit;
  }


}
