#pragma strict

@script RequireComponent(Animator)

var animSpeed = 1.5;
var rotateSpeed = 80;
var mouseRotateSpeed = 80;

private var anim:Animator;

function Start () {
    anim = GetComponent(Animator);
}

function FixedUpdate () {
    var h = Input.GetAxis("Horizontal");
    var v = Input.GetAxis("Vertical");

	anim.SetFloat("Speed", v);				
	anim.SetFloat("Direction", h); 			
	anim.speed = animSpeed;					
	anim.SetLookAtWeight(0);	
    
    // TODO: use TestHarryControl with a new state to let him rotate using an animation
    transform.Rotate(Vector3.up * h * Time.deltaTime * rotateSpeed);
    var sideWalkModificator = 0;
    if(Input.GetKey(KeyCode.Q)) {
        sideWalkModificator = -5;
    }
    else if(Input.GetKey(KeyCode.E)) {
        sideWalkModificator = 5;
    }

    transform.Translate(Vector3.right * sideWalkModificator * Time.deltaTime);
}