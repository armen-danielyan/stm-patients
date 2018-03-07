document.addEventListener("DOMContentLoaded", function(event) {

var sound_check = document.getElementById('sound-check'); // id for audio element
var duration; // Duration of audio clip
var pButton = document.getElementById('pButton'); // play button
var playhead = document.getElementById('playhead'); // playhead
var audio_progress_bar = document.getElementById('audio-progress-bar'); // audio_progress_bar

// audio_progress_bar width adjusted for playhead
var audio_progress_bar_width = audio_progress_bar.offsetWidth - playhead.offsetWidth;

// play button event listenter
pButton.addEventListener("click", play);

// timeupdate event listener
sound_check.addEventListener("timeupdate", timeUpdate, false);

// makes audio_progress_bar clickable
audio_progress_bar.addEventListener("click", function(event) {
    moveplayhead(event);
    sound_check.currentTime = duration * clickPercent(event);
}, false);

// returns click as decimal (.77) of the total audio_progress_bar_width
function clickPercent(event) {
    return (event.clientX - getPosition(audio_progress_bar)) / audio_progress_bar_width;

}

// makes playhead draggable
playhead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

// Boolean value so that audio position is updated only when the playhead is released
var onplayhead = false;

// mouseDown EventListener
function mouseDown() {
    onplayhead = true;
    window.addEventListener('mousemove', moveplayhead, true);
    sound_check.removeEventListener('timeupdate', timeUpdate, false);
}

// mouseUp EventListener
// getting input from all mouse clicks
function mouseUp(event) {
    if (onplayhead == true) {
        moveplayhead(event);
        window.removeEventListener('mousemove', moveplayhead, true);
        // change current time
        sound_check.currentTime = duration * clickPercent(event);
        sound_check.addEventListener('timeupdate', timeUpdate, false);
    }
    onplayhead = false;
}
// mousemove EventListener
// Moves playhead as user drags
function moveplayhead(event) {
    var newMargLeft = event.clientX - getPosition(audio_progress_bar);

    if (newMargLeft >= 0 && newMargLeft <= audio_progress_bar_width) {
        playhead.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
        playhead.style.marginLeft = "0px";
    }
    if (newMargLeft > audio_progress_bar_width) {
        playhead.style.marginLeft = audio_progress_bar_width + "px";
    }
}

// timeUpdate
// Synchronizes playhead position with current point in audio
function timeUpdate() {
    var playPercent = audio_progress_bar_width * (sound_check.currentTime / duration);
    playhead.style.marginLeft = playPercent + "px";
    if (sound_check.currentTime == duration) {
        pButton.className = "";
        pButton.className = "play";
    }
}

//Play and Pause
function play() {
    // start sound_check
    if (sound_check.paused) {
        sound_check.play();
        // remove play, add pause
        pButton.className = "";
        pButton.className = "pause";
    } else { // pause sound_check
        sound_check.pause();
        // remove pause, add play
        pButton.className = "";
        pButton.className = "play";
    }
}

// Gets audio file duration
sound_check.addEventListener("canplaythrough", function() {
    duration = sound_check.duration;
}, false);

// getPosition
// Returns elements left position relative to top-left of viewport
function getPosition(el) {
    return el.getBoundingClientRect().left;
}

/* DOMContentLoaded*/
});
