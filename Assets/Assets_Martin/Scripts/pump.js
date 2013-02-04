#pragma strict
var character : GameObject;
function Start () {

}

function Update () {
	var x = character.transform.position.x;
	var z = character.transform.position.z;
	if(Mathf.Abs((transform.position.x - x)) < 5 && Mathf.Abs((transform.position.z - z)) < 5) {
		if(Input.GetButtonDown("Jump")) {
			//To-do-code whenever spacebar is pressed in the vicinity of pump
			Debug.Log("interacted");
		}
	}
}