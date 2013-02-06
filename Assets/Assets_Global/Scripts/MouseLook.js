#pragma strict

var sensitivityY = 15.0;

var minimumY = -60.0;
var maximumY = 60.0;

private var rotationY = 0.0;

function Start () {
	if (rigidbody)
		rigidbody.freezeRotation = true;
}

function Update () {			
	rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
	rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			
	transform.localEulerAngles = new Vector3(-rotationY, 0, 0);
}