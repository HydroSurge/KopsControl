#pragma strict
var keyPresses : float = 0;
var pos : Vector2 = new Vector2(20,40);
var size : Vector2 = new Vector2(20,60);
var progressBarEmpty : Texture2D;
var progressBarFull : Texture2D;
 
function Start() {
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
    GUI.DrawTexture(Rect(pos.x, pos.y, size.y, size.x), progressBarEmpty);
    GUI.DrawTexture(Rect(pos.x, pos.y, size.y, size.x * Mathf.Clamp01(keyPresses*0.1)), progressBarFull);
}