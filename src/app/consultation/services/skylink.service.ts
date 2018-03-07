import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

declare let SkylinkWrapper: any;


@Injectable()
export class SkylinkService {
  private secret = environment.skylink.secret;
  private duration = 2;
  private startDateTimeStamp = (new Date()).toISOString();


  private appKey = environment.skylink.appKey;
  private enableDataChannel = true;
  private enableIceTrickle = true;
  private audioFallback = true;
  private forceSSL = true;
  private localVideoEl = 'myVideo';
  private remoteVideoEl = 'remoteVideo';
  private audio = true;
  private video = true;

  constructor() {

  }

  init(room_id) {
    const genHashForCredentials = CryptoJS.HmacSHA1(room_id + '_' + this.duration + '_' + this.startDateTimeStamp, this.secret);
    const credentials = encodeURIComponent(genHashForCredentials.toString(CryptoJS.enc.Base64));
    SkylinkWrapper.init({
      appKey: this.appKey,
      audio: this.audio,
      video: this.video,
      defaultRoom: room_id,
      enableDataChannel: this.enableDataChannel,
      enableIceTrickle: this.enableIceTrickle,
      audioFallback: this.audioFallback,
      forceSSL: this.forceSSL,
      localVideoEl: this.localVideoEl,
      remoteVideoEl: this.remoteVideoEl,
      duration: this.duration,
      startDateTime: this.startDateTimeStamp,
      credentials: credentials
    });
  }

}
