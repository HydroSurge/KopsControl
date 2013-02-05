#pragma strict
var keyPresses : float = 0;
var instructions : GUIText;
var percentage : GUIText;
var currentRotation : float;
var perc : float;

function Start() {
	instructions.material.color = new Color(0, 0, 0);
	instructions.fontSize = 24;
	instructions.transform.position.x = 0.2;
	instructions.transform.position.y = 0.2;
	percentage.material.color = new Color(0, 0, 0);
	percentage.fontSize = 24;
	percentage.transform.position.x = 0.7;
	percentage.transform.position.y = 0.5;
	instructions.text = "Keep pressing the spacebar to turn the valve wheel!";
}

function Update () {
	if(Input.GetButtonDown("Jump")) {
		transform.eulerAngles.y += 15;
	}	
	if(transform.eulerAngles.y > 0) {
		transform.eulerAngles.y -= 0.4;
	}
	if(transform.eulerAngles.y > 359 || Input.GetButtonDown("Fire1")) {
		
	}
	perc = transform.eulerAngles.y/3.6;
	percentage.text = "" + perc.ToString("f1") + "%";
}	