// $(document).ready(function () {
//
// /*
//  *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
//  *
//  *  Use of this source code is governed by a BSD-style license
//  *  that can be found in the LICENSE file in the root of the source
//  *  tree.
//  */
//
// /* global AudioContext, SoundMeter */
//
// 'use strict';
//
// var instantMeter = document.querySelector('#instant meter');
//
//
// var instantValueDisplay = document.querySelector('#instant .value');
//
//   var  getUserMedia = navigator.getUserMedia ||
//     navigator.webkitGetUserMedia ||
//     navigator.mozGetUserMedia ||
//     navigator.msGetUserMedia;
// try {
//   window.AudioContext = window.AudioContext || window.webkitAudioContext;
//   window.audioContext = new AudioContext();
// } catch (e) {
//   // alert('Web Audio API not supported.');
// }
//
// // Put variables in global scope to make them available to the browser console.
// var constraints  = {
//   audio: true,
//   video: true
// };
//
// function handleSuccess(stream) {
//   // Put variables in global scope to make them available to the
//   // browser console.
//   window.stream = stream;
//   var soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
//   soundMeter.connectToSource(stream, function(e) {
//     if (e) {
//       alert(e);
//       return;
//     }
//     setInterval(function() {
//       // alert('test');
//       instantMeter.value = instantValueDisplay.innerText =
//         soundMeter.instant.toFixed(2);
//       // alert(soundMeter.instant.toFixed(2));
//       console.log(soundMeter.instant.toFixed(2));
//       }, 200);
//
//   });
// }
//
// function handleError(error) {
//   console.log('navigator.getUserMedia error: ', error);
// }
//   getUserMedia.call(navigator, constraints, handleSuccess, handleError);
//   console.log( getUserMedia);
//
// });
