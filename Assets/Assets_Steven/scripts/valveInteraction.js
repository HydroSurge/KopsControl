#pragma strict

function Start () {

}

function Update () {


}

function OnTriggerEnter (myTrigger : Collider) {

 //check if tag is 'valve'
 if(myTrigger.gameObject.tag == "valve"){
	//Debug.Log("found valve");
	
 }
 
 
 //check if button is pressed
 //use gameupdate functions
 //Global.DAMWATER -= 20;
 //Global.RESERVOIRWATER += 20;
 //Global.POWER +=20;
}