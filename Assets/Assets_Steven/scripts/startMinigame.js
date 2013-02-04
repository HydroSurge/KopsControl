#pragma strict

//Minigame references
var minigames = ["MiniGame1"]; 

/**
*	starts a random minigame
**/

function startGame () {		
Debug.Log("start game");
	Application.LoadLevel(minigames[Random.Range(0,minigames.length)]);
}

