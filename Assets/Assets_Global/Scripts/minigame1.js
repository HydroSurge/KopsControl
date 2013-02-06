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
	instructions.enabled = false;
	percentage.enabled = false;
}

function StartGame() {
	instructions.enabled = true;
	percentage.enabled = true;
}

function Update () {
	if(MainGame.Instance().State != GameStates.MiniGame1) return;
	if(Input.GetButtonDown("Jump")) {
		transform.eulerAngles.y += 15;
	}	
	if(transform.eulerAngles.y > 0.4) {
		transform.eulerAngles.y -= 0.4;
	}
	if(transform.eulerAngles.y >= 350 || Input.GetButtonDown("Fire1")) {
        Debug.Log("Minigame succeess!: " + transform.eulerAngles);
		transform.eulerAngles.y = 0;
		instructions.enabled = false;
		percentage.enabled = false;		
		MainGame.Instance().minigameFinished();
	}
	perc = transform.eulerAngles.y/3.6;
	percentage.text = "" + perc.ToString("f1") + "%";
}	



		