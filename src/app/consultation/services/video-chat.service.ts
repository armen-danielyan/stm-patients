import { Injectable } from '@angular/core';


declare var Skylink;
var Demo = Demo || {};
Demo.Skylink = new Skylink();

@Injectable()
export class VideoChatService {

  constructor() {
  }

  /**
   * Enable Audio
   */
  on_microphone() {
    window['skylink'].muteStream({
      audioMuted: false,
      videoMuted: window['skylink'].getPeerInfo().mediaStatus.videoMuted
    });
  }

  /**
   * Disable Audio
   */
  off_microphone() {
    window['skylink'].muteStream({
      audioMuted: true,
      videoMuted: window['skylink'].getPeerInfo().mediaStatus.videoMuted
    });
  }

  /**
   * Enable Video
   */
  on_camera() {
    window['skylink'].muteStream({
      videoMuted: false,
      audioMuted: window['skylink'].getPeerInfo().mediaStatus.audioMuted
    });
  }

  /**
   * Disable Video
   */
  off_camera() {
    window['skylink'].muteStream({
      videoMuted: true,
      audioMuted: window['skylink'].getPeerInfo().mediaStatus.audioMuted
    });
  }

  live_room() {
    window['skylink'].leaveRoom();
  }


}
