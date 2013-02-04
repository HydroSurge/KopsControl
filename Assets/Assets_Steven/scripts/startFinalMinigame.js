#pragma strict

//Minigame references
var FinalMinigames = ["FinalMinigame1","FinalMinigame2"]; 

/**
*	starts a random minigame
**/
function Start () {		
	Application.LoadLevel(FinalMinigames[Random.Range(0,FinalMinigames.length)]);
}

