#pragma strict
var svart : GameObject;
		
function Start () {

}

function Update () {
	var x = svart.transform.position.x;
	var z = svart.transform.position.z;
	if(Mathf.Abs((transform.position.x - x)) < 10 && Mathf.Abs((transform.position.z - z)) < 10) {
		if(Input.GetButtonDown("Jump")) {
			//To-do-code whenever space is pressed in the vicinity of pump
		}
	}
}