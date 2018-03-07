var SkylinkWrapper = {
  skylink: undefined,

  /**
   * Initializes the SkylinkWrapper. Internally, it executes
   * a command of queries to initialize the Skylink events.
   *
   * @param options Attributes to initialize Skylink framework.
   */
  init: function (options) {
    window.endCallPacient = true;
    this.initWindowConfigs(options);
    this.instantiateSkylinkFramework();
    this.initOnMediaAccessSuccessEvent();
    this.initIncomingStreamEvent();
    this.initStreamEndedEvent();
    this.initPeerLeftEvent();
    this.initPeerJoinEvent();
    this.start();
    this.initIncomingMessage();
    this.initGetMessage();
  },

  /**
   * It adds the options to the window. This is needed
   * by the Skylink framework.
   *
   * @params options Options to initialize Skylink framework.
   */
  initWindowConfigs: function (options) {
    console.log('Room ID', options.defaultRoom);
    window.config = {
      appKey: options.appKey || "",
      defaultRoom: options.defaultRoom || "default_room",
      enableDataChannel: options.enableDataChannel || true,
      enableIceTrickle: options.enableDataChannel || true,
      audioFallback: options.audioFallback || true,
      forceSSL: options.forceSSL || true,
      audio: options.audio || true,
      video: options.video || true,
      localVideoEl: options.localVideoEl || "localVideoEl",
      remoteVideoEl: options.remoteVideoEl || "remoteVideoEl",
      credentials: {
        duration: options.duration,
        startDateTime: options.startDateTimeStamp,
        credentials: options.credentials
      }
    };
  },

  instantiateSkylinkFramework: function () {
    skylink = new Skylink();
  },

  /**
   * It initializes the "mediaAccessSuccess" event.
   */
  initOnMediaAccessSuccessEvent: function () {
    skylink.on('mediaAccessSuccess', function (stream) {
      attachMediaStream(document.getElementById(window.config.localVideoEl), stream);
      console.log("mediaAccessSuccess");
    });
  },

  /**
   * It initializes the "incomingStream" event.
   */
  initIncomingStreamEvent: function () {
    skylink.on('incomingStream', function (peerId, stream, isSelf, peerInfo) {

      console.log("incomingStream isSelf=" + isSelf);

      var currentEl;
      if (isSelf) {
        currentEl = window.config.localVideoEl
      } else {
        currentEl = window.config.remoteVideoEl;
      }

      var DOMVideo = document.getElementById(currentEl);

      DOMVideo.autoplay = true;
      DOMVideo.controls = false;
      DOMVideo.muted = isSelf;
      DOMVideo.setAttribute('playsinline', true);


      setTimeout(function () {
        DOMVideo.removeAttribute('controls');
        if (!isSelf) {
          skylink.refreshConnection(peerId);
          DOMVideo.onclick = function () {
            skylink.refreshConnection(peerId);
          };
          attachMediaStream(DOMVideo, stream);
        }
      }, 100);

    });
  },

  /**
   * It initializes the "streamEnded" event.
   */
  initStreamEndedEvent: function () {
    skylink.on('streamEnded', function (peerID, peerInfo, isSelf) {
      if (!isSelf) {
        console.log("streamEnded");
        var DOMvideo = document.getElementById(window.config.remoteVideoEl);
        try {
          DOMvideo.src = '';
        } catch (error) {
          console.log(error);
        }
      }
    });
  },

  /**
   * It initializes the "peerLeft" event.
   */
  initPeerLeftEvent: function () {
    skylink.on('peerLeft', function (peerID) {
      console.log("peerLeft");
      var DOMvideo = document.getElementById(window.config.remoteVideoEl);
      try {
        DOMvideo.src = '';
        window.endCallPacient = false;
      } catch (error) {
        console.log(error);
      }
    });
  },

  /**
   * It initializes the "peerJoined" event.
   */
  initPeerJoinEvent: function () {
    skylink.on('peerJoined', function (peerId, peerInfo, isSelf) {
      console.log("Peer Joined");
    });
  },

  /**
   * It initializes the "incomingMessage" event.
   */
  initIncomingMessage: function () {
    var that = this;
    skylink.on('incomingMessage', function (message, peerId, peerInfo, isSelf) {
      var Name = peerInfo.userData + ((isSelf) ? " (You)" : "");
      userName = Name;
      var InputFileChat = document.getElementById("ChatFile").value;

      if (InputFileChat !== '') {
        document.getElementById("MessageInput").value = InputFileChat;
        document.getElementById("ChatFile").value = "";
        that.addFile(Name, that.textDecode(message.content), isSelf);
      } else {
        that.addMessage(Name, that.textDecode(message.content), isSelf);
      }
    });
  },

  /**
   * It executes the init function of instance of Skylink framework.
   */
  start: function () {
    skylink.init(window.config, function (error, success) {
      console.log('windows**********');
      console.log(window.config);
      console.log(config + 'config**********');
      console.log(config);
      if (success)
        skylink.joinRoom({
          audio: window.config.audio,
          video: window.config.video
        });
    });
  },

  /**
   * It gets message from input
   */
  initGetMessage: function () {
    var that = this;
    var userInputMessageButton = document.getElementById("MessageInputButton");
    var userInputMessage = document.getElementById("MessageInput");

    userInputMessage.addEventListener("keypress", function (event) {
      if (event.keyCode === 13) {
        if (userInputMessage.value !== '') {
          that.sendMessage(userInputMessage.value);
          userInputMessage.value = '';
        }
      }

    });

    userInputMessageButton.addEventListener("click", function (event) {
      if (userInputMessage.value !== '') {
        that.sendMessage(userInputMessage.value);
        userInputMessage.value = '';
      }
    });
  },

  /**
   * It sends message
   */
  sendMessage: function (message) {
    skylink.sendP2PMessage(this.textEncode(message));
  },

  /**
   * It creats text message
   */
  addMessage: function (user, message, isSelf) {
    var that = this;
    var messageList = document.getElementById("MessageList");
    var writerClassName = 'message-block writer';
    var receiverClassName = 'message-block reciever';

    var filename = message.split("/");
    var timestamp = new Date();
    var div = document.createElement('div');

    if (filename[0] === 'https:' && filename[1] === "" && (filename[3] !== 'stm.patient' && filename[3] !== 'stm.doctor')) {
      div.innerHTML = '<div class="message-box"><div class="file-container"><a href=' + message + ' target="_blank">' + message + '</a></div></div><p class="message-time">' + timestamp.getHours() + ':' + timestamp.getMinutes() + '</p>';
      messageList.appendChild(div);
      messageList.scrollTop = messageList.scrollHeight;

      if (isSelf) {
        div.className = writerClassName;
        document.getElementsByClassName("online-sign")[0].style.display = 'none';
      } else {
        div.className = receiverClassName;
        document.getElementsByClassName("online-sign")[0].style.display = 'block';
      }
    } else if (filename[0] === 'https:' && filename[1] === "" && (filename[3] === 'stm.patient' || filename[3] === 'stm.doctor')) {
      that.addFile(userName, message, isSelf);
    } else {
      div.innerHTML = '<div class="message-box">' + message + '</div><p class="message-time">' + timestamp.getHours() + ':' + timestamp.getMinutes() + '</p>';
      messageList.appendChild(div);
      messageList.scrollTop = messageList.scrollHeight;

      if (isSelf) {
        div.className = writerClassName;
        document.getElementsByClassName("online-sign")[0].style.display = 'none';
      } else {
        div.className = receiverClassName;
        document.getElementsByClassName("online-sign")[0].style.display = 'block';
      }
    }
  },

  /**
   * It creates file text message
   */
  addFile: function (user, message, isSelf) {
    var messageList = document.getElementById("MessageList");
    var writerClassName = 'message-block writer';
    var receiverClassName = 'message-block reciever';
    var timestamp = new Date();
    var div = document.createElement('div');
    var filename = message.split("/");

    if (isSelf) {
      div.className = writerClassName;
      div.innerHTML = '<div class="message-box"><div class="file-container file-up" style="width: 11em; word-wrap:break-word;text-overflow: ellipsis; white-space: nowrap;  overflow: hidden; padding: 5px;">' +
        '<a href=' + message + ' target="_blank" ><img src="assets/img/icons/download.svg"></a>' + filename[filename.length - 1] + '</div></div><p class="message-time">' + timestamp.getHours() + ':' + timestamp.getMinutes() + '</p>';
      messageList.appendChild(div);
      messageList.scrollTop = messageList.scrollHeight;
      document.getElementsByClassName("online-sign")[0].style.display = 'none';
    } else {
      div.className = receiverClassName;
      div.innerHTML = '<div class="message-box"><div class="file-container file-up" style="width: 11em; word-wrap:break-word;text-overflow: ellipsis; white-space: nowrap;overflow: hidden;">' +
        '<a href=' + message + ' target="_blank" ><img src="assets/img/icons/download.svg"></a>' + filename[filename.length - 1] + '</div></div><p class="message-time">' + timestamp.getHours() + ':' + timestamp.getMinutes() + '</p>';
      messageList.appendChild(div);
      messageList.scrollTop = messageList.scrollHeight;
      document.getElementsByClassName("online-sign")[0].style.display = 'block';
    }
  },

  /**
   * It decodes text message
   */
  textDecode: function (message) {
    var decodedMessage = '';
    var msg = message.split('\\u');
    for (var i = 1; i < msg.length; i++) {
      decodedMessage += String.fromCharCode(msg[i]);
    }
    return decodedMessage;
  },

  /**
   * It encodes text message
   */
  textEncode: function (message) {
    var encodedMessage = '';
    for (var i = 0; i < message.length; i++) {
      encodedMessage += '\\u' + message[i].charCodeAt(0);
    }
    return encodedMessage;
  }
};

