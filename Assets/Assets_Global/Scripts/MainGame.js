/*
 * This file stores the current gameplay information.
 * Access this data anywhere using 
 * MainGame.Instance()     (e.g. Instance().CurrentLevel) 
 */
enum GameAction { 
    IncreaseValve1, IncreaseValve2, IncreaseValve3, 
    IncreasePump1, IncreasePump2, IncreasePump3  
}

enum GameStates {
	Cavern,
	MiniGame1 , 
	GameOver
}


var minigames = ["minigame1"]; 

/* Some Styles */
var labelStyle:GUIStyle;  

// The maximum value the grid and generation can change.
var gameOverEnergyOffset : float =   15;

/* Current highscore within the Gameplay */
var Money:int = 0; 

/* The current level we are playing (0-9, 10 -> Game is finished) */
var CurrentLevel:int = 0; 

/* The current gamespeed (update interval in seconds) */
var GameSpeed:int = 3;

/* The current power amount generated by the power plants (unit: MwH) */
var PowerGeneration:int = 100; 
/* The current power amount needed by the households (unit: MwH) */
var PowerDemand:int = 100; 

var State: GameStates = GameStates.Cavern;

/* whether to show the game menu */
var ShowGameMenu = true;

var Level = 0;

private var _nextUpdate:float=0;

private var _leftLabelStyle:GUIStyle;
private var _centerLabelStyle:GUIStyle;
private var _rightLabelStyle:GUIStyle;

private var _valve1Percentage:float = 0.5;
private var _valve2Percentage:float = 0.5;
private var _valve3Percentage:float = 0.5;  

private var _valve1Rate : float = 1; 
private var _valve2Rate : float = 2.0/3; 
private var _valve3Rate : float = 2.5/5; 

private var _pump1Rate : float = 1; 
private var _pump2Rate : float = 2.0/3;
private var _pump3Rate : float = 2.5/5;  

private var _valve1Max : float = 10; 
private var _valve2Max : float = 25; 
private var _valve3Max : float = 50; 

private var _pump1Max : float = 10; 
private var _pump2Max : float = 25;
private var _pump3Max : float = 50;

private var _gridBalance: float = 0;    

private var _currentCamera:Camera; 

private var _currentAction:GameAction;
private var _currentActionParam:float;
private var _callback;
private var _flashesToCreate:int = 0;
private var _nextCreationTime:float = 0;

private var _demandBar:DemandBar;
private var _energyProduced:float;
var creationTimeout:float = 0.5;

private var _flashMovement:TwoDObjectMovement;

var boxStyle : GUIStyle;
var IMGPowerPlant : Texture;
var IMGres : Texture;
var IMGdam : Texture;
var IMGwave : Texture;
var IMGcity : Texture;
 var count = 250;
 var LAKEWATER :float = 75;
 var RESERVOIRWATER : float = 75;
 var LAKEPRESENT : float=50;
 var RESPRESENT : float=50;
 var SHOW=false;



function Start () {
    _leftLabelStyle = new GUIStyle(labelStyle);
    _leftLabelStyle.alignment = TextAnchor.MiddleLeft;
    _rightLabelStyle = new GUIStyle(labelStyle);
    _rightLabelStyle.alignment = TextAnchor.MiddleRight; 
    _centerLabelStyle = new GUIStyle(labelStyle);
    _centerLabelStyle.alignment = TextAnchor.MiddleCenter; 
     
    var mainCameras = GameObject.FindGameObjectsWithTag("MainCamera");
    if(mainCameras == null || mainCameras.length == 0) {
        return null;
    } 
    _currentCamera = mainCameras[0].GetComponent(Camera);
    _flashMovement = mainCameras[0].GetComponent(TwoDObjectMovement);
    
    _demandBar = DemandBar(Vector2(100,100), 400,200,200);
}

/* Main Game processing Loop */
function Update () {
	
	if(Time.time > _nextUpdate) {
        if(MainGame.Instance().State == GameStates.Cavern) {        
	    	_energyProduced = PowerGeneration +
	    	ValvePower(_valve1Percentage,_valve1Max) + 
        	ValvePower(_valve2Percentage,_valve2Max) + 
        	ValvePower(_valve3Percentage,_valve3Max);
        	
        	_gridBalance = _energyProduced - PowerDemand -  
        	PumpPower(1-_valve1Percentage,_pump1Max) - 
        	PumpPower(1-_valve2Percentage,_pump2Max) -
        	PumpPower(1-_valve3Percentage,_pump3Max) ;
        	
    	    var waterDownflow:float = 
    	    (ValvePower(_valve1Percentage,_valve1Max) / _valve1Rate) +
    	    (ValvePower(_valve2Percentage,_valve2Max) / _valve2Rate) +
    	    (ValvePower(_valve3Percentage,_valve3Max) / _valve3Rate);
    	    
    	   	var waterUpflow:float = (PumpPower(1-_valve1Percentage,_pump1Max) / _pump1Rate) +
    	    (PumpPower(1-_valve2Percentage,_pump2Max) / _pump2Rate) +
    	    (PumpPower(1-_valve3Percentage,_pump3Max) / _pump3Rate);
        	 
        	
    	    LAKEWATER = LAKEWATER + waterUpflow - waterDownflow;
        	RESERVOIRWATER = RESERVOIRWATER + waterDownflow - waterUpflow;
        	
        	LAKEPRESENT = Mathf.Max(0, Mathf.Min(1,LAKEWATER/(LAKEWATER + RESERVOIRWATER))); 
        	RESPRESENT = Mathf.Max(0, Mathf.Min(1,RESERVOIRWATER/(LAKEWATER + RESERVOIRWATER)));
      		_flashesToCreate += System.Convert.ToInt32(_energyProduced / 50);
      		
        	if(Mathf.Abs(_gridBalance) > gameOverEnergyOffset ) {
        		 Debug.Log("Game over!"); 
        		 //State = GameStates.GameOver;//exit the game
        	}
        	
        	
        }
        	
		_nextUpdate = Time.time + GameSpeed;	
        
    }
    SHOW = (Input.GetKey(KeyCode.Tab));
    
    if(Time.time > _nextCreationTime) {
		if(_flashesToCreate > 0) {
			_flashMovement.createLightning(0.4);
			_flashesToCreate--;
		}
		_nextCreationTime = Time.time + creationTimeout;
	}

} 
function ValvePower(percentage: float, maximum: float){  

	return maximum * percentage   ;
}
function PumpPower(percentage: float, maximum: float){ 
	return maximum * percentage   ;
}
function OnGUI() {
	if(MainGame.Instance().State != GameStates.Cavern) return;
	var screenThird = Screen.width * 0.33;
	var labelHeight = 25;
	var topPadding = 10;
	var sidePadding = 25;

	
	if(SHOW){
		var size = 300;
		var itemNum = 1;
		var yPos = Screen.height;
		var xPos = Screen.width - (size*2);	
		
		GUI.Box	(Rect(xPos+350,0,size,size ), IMGdam,boxStyle);
		GUI.Box	(Rect(xPos+250,150,90,30),  String.Format("{0:0%}",LAKEPRESENT));
		
		GUI.Box	(Rect(xPos+450,yPos -(size*itemNum)+170,size,size ), IMGres,boxStyle);
		GUI.Box	(Rect(xPos+350,yPos-100,90,30), String.Format("{0:0%}",RESPRESENT));
		
		var bottom = (Screen.height - 250);
		var boxHeight = bottom; 
		GUI.Box	(Rect(xPos+350,bottom - (boxHeight * LAKEPRESENT),size,size ), IMGwave,boxStyle);
		
		var s=200;
		GUI.Box	(Rect(0,-30,s,s ), IMGPowerPlant,boxStyle);
		GUI.Box	(Rect(Screen.width - s - s - 40,yPos -600,s,s ), IMGcity,boxStyle);
    
	  
		   
		    // some logging
		    GUI.Label(Rect(sidePadding,Screen.height - (3 * labelHeight), screenThird, labelHeight), String.Format("{0:0%} Valve ({1:0.0}MWh) / {2:0%} Pump ({3:0.0}MwH)", _valve1Percentage, ValvePower(_valve1Percentage, _valve1Max), 1-_valve1Percentage, PumpPower(1-_valve1Percentage, _pump1Max)), _leftLabelStyle);
		    GUI.Label(Rect(sidePadding,Screen.height - (2 * labelHeight), screenThird, labelHeight), String.Format("{0:0%} Valve ({1:0.0}MWh) / {2:0%} Pump ({3:0.0}MwH)", _valve2Percentage, ValvePower(_valve2Percentage, _valve2Max), 1-_valve2Percentage, PumpPower(1-_valve2Percentage, _pump2Max)), _leftLabelStyle);
		    GUI.Label(Rect(sidePadding,Screen.height - (1 * labelHeight), screenThird, labelHeight), String.Format("{0:0%} Valve ({1:0.0}MWh) / {2:0%} Pump ({3:0.0}MwH)", _valve3Percentage, ValvePower(_valve3Percentage, _valve3Max), 1-_valve3Percentage, PumpPower(1-_valve3Percentage, _pump3Max)), _leftLabelStyle);
				
			_demandBar.Update(Time.deltaTime);
			_demandBar.DrawGraph((_energyProduced/200.0)*100);
		}
	// PowerPlant Generation -> Top Left
	GUI.Label(Rect(sidePadding,topPadding, screenThird, labelHeight), FormatNumber(PowerGeneration), _leftLabelStyle);
	
	// CurrentBalance -> Top Center
	GUI.Label(Rect(0,topPadding, Screen.width, labelHeight), FormatNumber(_gridBalance), _centerLabelStyle);
	
	// Household Consumption -> Top Right
	GUI.Label(Rect(Screen.width - sidePadding - screenThird,topPadding, screenThird, labelHeight), FormatNumber(PowerDemand), _rightLabelStyle);

}

function FormatNumber(number:int) {
    if(number < 0) {
        return number + " MwH";
    }
    else {
        return "+" + number + " MwH";
    }
}
/*---------------------------------
 * Some Additional Game API
 *-------------------------------*/ 

static function Instance() {
    var mainCameras = GameObject.FindGameObjectsWithTag("MainCamera");
    if(mainCameras == null || mainCameras.length == 0) {
        return null;
    }

    var mainGame:MainGame = mainCameras[0].GetComponent(MainGame);
    return mainGame;
}

function CompleteLevel() {
    CurrentLevel++;
    if(CurrentLevel == 10) {
        Debug.Log("Yeay, we game is finished, let's restart!");
        CurrentLevel = 0;
    }
}

function InvokeGameAction(action:GameAction, param:float) {
    Debug.Log(Time.time + " - Yeay! Interaction: " + action + "(" + param + ")");
    switch (action) {
        case GameAction.IncreaseValve1: 
            _valve1Percentage = Mathf.Min(1, _valve1Percentage + param);
        break;
        case GameAction.IncreaseValve2: 
            _valve2Percentage = Mathf.Min(1, _valve2Percentage + param);
        break;
        case GameAction.IncreaseValve3: 
            _valve3Percentage = Mathf.Min(1, _valve3Percentage + param);
        break;
        case GameAction.IncreasePump1: 
            _valve1Percentage = Mathf.Max(0, _valve1Percentage - param);
        break;
        case GameAction.IncreasePump2:
            _valve2Percentage = Mathf.Max(0, _valve2Percentage - param);
        break;
        case GameAction.IncreasePump3:
            _valve3Percentage = Mathf.Max(0, _valve3Percentage - param);
        break; 
    }
}

function swapCam(currentCam : String){

 //var cameras = GameObject.FindGameObjectsWithTag("camera");
 //
 //for (var cams : GameObject in cameras){
 // cams.GetComponent(Camera).enabled = false;
 //}  
 
 
 
 //Debug.Log("camera: "+oneToUse);  
 _currentCamera.enabled = false; 
 _currentCamera = gameObject.Find(currentCam).GetComponent(Camera);
 _currentCamera.enabled = true;
}		
            
function StartRandomMiniGame(action:GameAction, param:float, callback) { 
	_currentAction = action;
	_currentActionParam = param; 
	_callback = callback;
	State = GameStates.MiniGame1;
	switchCavernLights(false);
	var miniGameName = minigames[Random.Range(0,minigames.length)];
	GameObject.FindGameObjectWithTag(miniGameName).SendMessage("StartGame");
	swapCam("camera_"+miniGameName);
}

function switchCavernLights(enabled){
	var cameras = GameObject.FindGameObjectsWithTag("cavernlight");
	 	for (var cams : GameObject in cameras){
	  		cams.GetComponent(Light).enabled = enabled;
	 } 
}

function minigameFinished(){
	//state back to maingame
	State = GameStates.Cavern;
	//enable global lights
	switchCavernLights(true);
	
	swapCam("MainCamera"); 
	
    InvokeGameAction(_currentAction, _currentActionParam); 
    _callback();
}
function addWaterLake(amount : int){
	LAKEWATER += amount;
	if(count>0){
		count-=5;
		LAKEPRESENT+=1;
		RESPRESENT-=1;
	}
}

function takeWaterLake(amount : int){
	LAKEWATER -= amount;
	if(count<500){
		count+=5;
		LAKEPRESENT-=1;
		RESPRESENT+=1;
	}
}

function addWaterReservoir(amount : int){
	RESERVOIRWATER += amount;
}

function takeWaterReservoir(amount : int){
	RESERVOIRWATER -= amount;
}
//function to be called after finishing minigame (valve)
function valveActivated(){
	takeWaterLake(20);
	addWaterReservoir(20);
}
//function to be called after finishing minigame (pump)
function pumpActivated(){
	addWaterLake(20);
	takeWaterReservoir(20);
}