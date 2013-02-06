#pragma strict

//Minigame references
var minigames = ["minigame1"]; 
private var _minigame1 : minigame1;
_minigame1 = new minigame1();
/**
*	starts a random minigame
**/

function startGame () {		

//disable character controller
//change camera to right minigame
swapCam(minigames[Random.Range(0,minigames.length)]);

_minigame1.Start();

}

function swapCam(currentCam : String){
 var cameras = GameObject.FindGameObjectsWithTag("camera");
 
 for (var cams : GameObject in cameras){
  cams.GetComponent(Camera).enabled = false;
 }  
 
 var oneToUse : String = "camera_"+currentCam;
 //Debug.Log("camera: "+oneToUse);
 gameObject.Find(oneToUse).GetComponent(Camera).enabled = true;
}