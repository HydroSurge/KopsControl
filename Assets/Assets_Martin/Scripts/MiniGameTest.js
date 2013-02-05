#pragma strict
var keyPresses : float = 0;
var instructions : GUIText;
var currentRotation : float;

function Start() {
	instructions.material.color = new Color(0,0,0,1);
	instructions.fontSize = 24;
	instructions.transform.position.x = 0.35;
	instructions.transform.position.y = 0.2;
	instructions.text = "Spam the spacebar as fast as possible \nto activate the 'X'";
}

function Update () {
	if(Input.GetButtonDown("Jump")) {
		transform.eulerAngles.y += 15;
	}	
	if(transform.eulerAngles.y > 0) {
		transform.eulerAngles.y -= 0.4;
	}
	if(transform.eulerAngles.y > 359) {
		
	}
}	