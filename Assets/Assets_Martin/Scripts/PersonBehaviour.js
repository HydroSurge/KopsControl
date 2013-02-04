#pragma strict
function Start () {

}

function Update() {	
	var speed = 3;
	var rotateSpeed = 3;
	var controller : CharacterController = GetComponent(CharacterController);	
	transform.Rotate(0, Input.GetAxis ("Horizontal") * rotateSpeed, 0);	// Move forward / Backward	
	var forward = transform.TransformDirection(Vector3.forward);	
	var CurSpeed = speed * Input.GetAxis ("Vertical");	
	controller.SimpleMove(forward * CurSpeed);
}