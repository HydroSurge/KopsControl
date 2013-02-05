#pragma strict
var keyPresses : float = 0;
var pos : Vector2 = new Vector2(0,0);
var size : Vector2 = new Vector2(Screen.width/2, Screen.height);
var progressBarEmpty : Texture2D;
var progressBarFull : Texture2D;
var instructions : GUIText;

function Start() {
	instructions.material.color = new Color(0,0,0,1);
	instructions.fontSize = 20;
	instructions.transform.position.x = 0.5;
	instructions.text = "Spam the spacebar as fast as possible \n to activate the 'X'";
}

function Update () {
	if(Input.GetButtonDown("Jump")) {
		keyPresses++;
	}	
	if(keyPresses > 0) {
		keyPresses -=0.04;
	}
}
function OnGUI() {
    GUI.DrawTexture(Rect(pos.x, pos.y, Screen.height, Screen.width/2), progressBarEmpty);
    GUI.DrawTexture(Rect(pos.x, pos.y, Screen.height, Screen.width/2 * Mathf.Clamp01(keyPresses*0.1)), progressBarFull);
}