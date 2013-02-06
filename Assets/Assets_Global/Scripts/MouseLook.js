#pragma strict

var sensitivityX = 15.0;
var sensitivityY = 15.0;

var minimumX = -360.0;
var maximumX = 360.0;

var minimumY = -60.0;
var maximumY = 60.0;

private var rotationY = 0.0;

function Start () {
	if (rigidbody)
		rigidbody.freezeRotation = true;
}

function Update () {
    var rotationX = transform.localEulerAngles.y + Input.GetAxis("Mouse X") * sensitivityX;
			
	rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
	rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			
	transform.localEulerAngles = new Vector3(-rotationY, rotationX, 0);
}