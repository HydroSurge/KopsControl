#pragma strict

//Must be called when minigame is finished succesfully
function Start () {

var cameras = GameObject.FindGameObjectsWithTag("camera");
 
 for (var cams : GameObject in cameras){
  cams.GetComponent(Camera).enabled = false;
 }  
 
 //start main camera 
 var oneToUse : String = "Camera";
 //Debug.Log("camera: "+oneToUse);
 gameObject.Find(oneToUse).GetComponent(Camera).enabled = true;
 
}

