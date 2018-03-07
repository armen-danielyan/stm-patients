$(document).ready(function () {
    
    var sound_check = document.getElementById('sound-check'); // id for audio element
    var pButton = document.getElementById('pButton'); // play button
    var img_audio = document.getElementById('img_audio'); // pause button
    
    window.SetAudioVolume = function(value_percent)
    {
        console.log(value_percent)
        console.log(sound_check.volume)
        sound_check.volume = value_percent / 100.0;
    }
    
    pButton.addEventListener("click", function(e){
        if (sound_check.paused) {
            sound_check.play();
          img_audio.src = "assets/img/icons/Pause.svg";
            // remove play, add pause
            pButton.className = "";
            pButton.className = "pause";
        } else { // pause sound_check
            sound_check.pause();
          img_audio.src = "assets/img/icons/play.svg" ;
            // remove pause, add play
            pButton.className = "";
            pButton.className = "play";
        }
        
    });

});
    