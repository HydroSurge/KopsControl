#pragma strict

private var game : startMinigame;

//Pump/valve colider detection
function OnTriggerStay (myTrigger : Collider) {
 	
 if(myTrigger.gameObject.tag == "valve" ||myTrigger.gameObject.tag == "pump" ){
 
	if(Input.GetButtonDown("Jump")) {
		Debug.Log("pressed");		
		//Start a minigame
		game = new startMinigame();
		game.startGame();
		
		}
 }
 };
 
 