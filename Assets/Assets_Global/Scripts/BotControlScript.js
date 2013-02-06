#pragma strict

@script RequireComponent(Animator)

var animSpeed = 1.5; 
var mouseRotationSpeed = 7;
var standRotationSpeed = 80;
var sidewalkSpeed = 7;

private var anim:Animator;

function Start () {
    anim = GetComponent(Animator);
}

function FixedUpdate () {
	if(MainGame.Instance().State != GameStates.Cavern) return;
	
    var h = Input.GetAxis("Horizontal");
    var v = Input.GetAxis("Vertical");

	anim.SetFloat("Speed", v);				
	//anim.SetFloat("Direction", h); 			
	anim.speed = animSpeed;					
	anim.SetLookAtWeight(0);

    var rotationX = transform.localEulerAngles.y + Input.GetAxis("Mouse X") * mouseRotationSpeed + h * standRotationSpeed;
    transform.localEulerAngles = new Vector3(0, rotationX, 0);
}