/*Change input type from password to text*/

// var eye = document.getElementById("eye");

var eye = document.getElementsByClassName("eye");

eye[0].addEventListener("click", togglePasswordFieldClicked);

function togglePasswordFieldClicked(e) {
    e.preventDefault();
    eye[0].classList.toggle("active");
	var passwordField = document.getElementsByClassName('pwd');
	var value = passwordField[0].value;
	if(passwordField[0].type == 'password') {
		passwordField[0].type = 'text';
	}
	else {
		passwordField[0].type = 'password';
	}

	// passwordField[0].value = value;

}

