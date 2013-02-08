#pragma strict



var waterdrop :Transform;
var clone :Transform;

var list:List.<Transform>;
var numbers:List.<int>;
var count=0;

var spawnTime=30;
var spawnCount=0;
static var start = false;
static var GameOver=false;
static var GameWin=false;
var turbine:turbine;

function StartNewGame () {
    count=0;

    spawnTime=30;
    spawnCount=0;
    start = false;
    GameOver=false;
    GameWin=false;
    turbine.SendMessage("Restart");
}

function Update () {
    if(MainGame.Instance().State != GameStates.FinalMiniGame1) return;
    if(start){
        if(GameOver==false){
            if(GameWin==false){
                  if (Input.GetKey (KeyCode.C)){
                    create();
                  }
                 
                 if(spawnCount>spawnTime){
                     create();
                     spawnCount=0;
                 }
                    spawnCount++;
            }
         }
    }

}
function create(){
	var grab = transform.position.x + Mathf.Floor(Random.Range(-25,25));
    // 20 -> out of the screen to drop down
    // grab -> the horizontal orientation of the waterdrop being created
    // -15 -> 0 Is in Front, minus values are more to the back
	clone=Instantiate(waterdrop, Vector3(grab,20,-15),  waterdrop.rotation);
}
function OnGUI(){
    if(MainGame.Instance().State != GameStates.FinalMiniGame1) return;

		if(start==false){
			if(GUI.Button (Rect(0,0,Screen.width,Screen.height), "collect the water probs to make the turbine spin faster to generate power"+ "\n"+
			"the power must reach 100% to complete the level"+ "\n"+
			"dont let the power reach 0%"+"\n"+
			"click to start game"))
			{
			start = true;
			}
		}
		if(GameOver){
			MainGame.Instance().minigameFinished(false);		
		}
		if(GameWin){
            MainGame.Instance().minigameFinished(true);
		}
}