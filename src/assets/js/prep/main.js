$(document).ready(function () {
  'use strict';

  var video = document.querySelector('video');
  var instantMeter = document.querySelector('#instant meter');
  var instantValueDisplay = document.querySelector('#instant .value');

// Put variables in global scope to make them available to the browser console.
  var getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var audioCtx = new AudioContext();



  function handleSuccess(stream) {
    window.stream = stream;
    var soundMeter = window.soundMeter = new SoundMeter(audioCtx);
    stream.oninactive = function () {
      console.log('Stream inactive');
    };
    window.stream = stream; // make variable available to browser console
    video.srcObject = stream;

    soundMeter.connectToSource(stream, function (e) {
      if (e) {
        alert(e);
        return;
      }
      setInterval(function () {
        instantMeter.value = instantValueDisplay.innerText =
          soundMeter.instant.toFixed(2);
      }, 500);

    });
  }

  function handleError(error) {
    if (error.name === 'ConstraintNotSatisfiedError') {
      errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
        constraints.video.width.exact + ' px is not supported by your device.');
    } else if (error.name === 'PermissionDeniedError') {
      errorMsg('Permissions have not been granted to use your camera and ' +
        'microphone, you need to allow the page access to your devices in ' +
        'order for the demo to work.');
    }
    console.log('navigator.getUserMedia error: ', error);
    errorMsg('getUserMedia error: ' + error.name, error);
  }

  var constraints = {
    audio: true,
    video: true
  };
  getUserMedia.call(navigator, constraints, handleSuccess, handleError);
  console.log(getUserMedia);


});
