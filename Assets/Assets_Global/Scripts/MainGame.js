/*
 * This file stores the current gameplay information.
 * Access this data anywhere using 
 * MainGame.Instance()     (e.g. Instance().CurrentLevel) 
 */
enum GameAction { 
    IncreaseValve,
    IncreasePump, 
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

// Total time spent playing
var PlayTime:float = 0;
var PlayerScore:int = 0;

// Time limits to recieve a better score.
var GoldTimeLimit:int = 360; // 6 Minutes
var SilverTimeLimit:int = 480;	// 8 Minutes
var BronzeTimeLimit:int = 720;	// 12 Minutes

var GoldScoreMult: int = 4;
var SilverScoreMult:int = 2;
var BronzeScoreMult:float = 1.5f;

var Level = 0;

private var _nextUpdate:float=0;

private var _leftLabelStyle:GUIStyle;
private var _centerLabelStyle:GUIStyle;
private var _rightLabelStyle:GUIStyle;

private var _pumpValveControllers:Array;

private var _gridBalance: float = 0;    

private var _currentCamera:Camera; 

private var _currentAction:GameAction;
private var _currentActionParam:float;
private var _currentActionController:int;
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
    _leftLabelStyle.alignment = TextAnchor.UpperLeft;
    _rightLabelStyle = new GUIStyle(labelStyle);
    _rightLabelStyle.alignment = TextAnchor.UpperRight; 
    _centerLabelStyle = new GUIStyle(labelStyle);
    _centerLabelStyle.alignment = TextAnchor.UpperCenter; 
     
    var mainCameras = GameObject.FindGameObjectsWithTag("MainCamera");
    if(mainCameras == null || mainCameras.length == 0) {
        return null;
    } 
    _currentCamera = mainCameras[0].GetComponent(Camera);
    _flashMovement = mainCameras[0].GetComponent(TwoDObjectMovement);
    
    _demandBar = DemandBar(Vector2(100,100), 400,200,200);
    
    // initialize controllers
    _pumpValveControllers = new Array();
    
    //
    // Valve/Pump 1 
    var ctrl1 = ValvePumpController();
    ctrl1.ValvePercentage = 0.5;
    ctrl1.ValveMaxPower = 10;
    ctrl1.PumpMaxPower = 10;
    ctrl1.SetupValveRate(1, 1);
    ctrl1.SetupPumpRate(1, 1);
    _pumpValveControllers.push(ctrl1);
    //
    // Valve/Pump 1 
    var ctrl2 = ValvePumpController();
    ctrl2.ValvePercentage = 0.5;
    ctrl2.ValveMaxPower = 25;
    ctrl2.PumpMaxPower = 25;
    ctrl2.SetupValveRate(2, 3);
    ctrl2.SetupPumpRate(2, 3);
    _pumpValveControllers.push(ctrl2);
    //
    // Valve/Pump 1 
    var ctrl3 = ValvePumpController();
    ctrl3.ValvePercentage = 0.5;
    ctrl3.ValveMaxPower = 50;
    ctrl3.PumpMaxPower = 50;
    ctrl3.SetupValveRate(2, 3);
    ctrl3.SetupPumpRate(2, 3);
    _pumpValveControllers.push(ctrl3);
}

/* Main Game processing Loop */
function Update () {
	
	if(Time.time > _nextUpdate) {
	    if(MainGame.Instance().State == GameStates.Cavern) {

	        _energyProduced = PowerGeneration;
	        _gridBalance = PowerGeneration - PowerDemand;
	        
	        for(var c in _pumpValveControllers) {
                var ctrl:ValvePumpController = c as ValvePumpController;
	            if(ctrl.CanOperate(RESERVOIRWATER, LAKEWATER)) {
	                var powerGeneration = ctrl.CalculateCurrentPowerGeneration();
	                var powerDemand = ctrl.CalculateCurrentPowerDemand();
	                var waterPump = ctrl.CalculateCurrentWaterPump();
	                var waterNeed = ctrl.CalculateCurrentWaterNeed();

	                _energyProduced += powerGeneration;
	                _gridBalance += powerGeneration;
	                _gridBalance -= powerDemand;

	                LAKEWATER += waterPump;
	                RESERVOIRWATER -= waterPump;

	                LAKEWATER -= waterNeed;
	                RESERVOIRWATER += waterNeed;
	            }
	        }
            
            RESPRESENT = RESERVOIRWATER / (RESERVOIRWATER+LAKEWATER);
            LAKEPRESENT = LAKEWATER / (RESERVOIRWATER+LAKEWATER);
        	
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

    PlayTime += Time.deltaTime;
    Debug.Log(PlayTime);
} 

function OnGUI() {
	if(MainGame.Instance().State != GameStates.Cavern) return;
	var screenThird = Screen.width * 0.33;
	var labelHeight = 30;
	var topPadding = 10;
	var sidePadding = 25;

	
	if(SHOW){
		var size = 300;
		var itemNum = 1;
		var yPos = Screen.height;
		var xPos = Screen.width - (size*2);	
		
		GUI.Box	(Rect(xPos+350,0,size,size ), IMGdam,boxStyle);
		GUI.Box	(Rect(xPos+250,40,90,30),  String.Format("{0:0%}",LAKEPRESENT));
		
		GUI.Box	(Rect(xPos+450,yPos -(size*itemNum)+170,size,size ), IMGres,boxStyle);
		GUI.Box	(Rect(xPos+350,yPos-100,90,30), String.Format("{0:0%}",RESPRESENT));
		
		var bottom = (Screen.height - 250);
		var boxHeight = bottom; 
		GUI.Box	(Rect(xPos+350,bottom - (boxHeight * LAKEPRESENT),size,size ), IMGwave,boxStyle);
		
		var s=200;
		GUI.Box	(Rect(0,-30,s,s ), IMGPowerPlant,boxStyle);
		GUI.Box	(Rect(Screen.width - s - s - 40,yPos -600,s,s ), IMGcity,boxStyle);
    
		var ctrlY = Screen.height - (_pumpValveControllers.length * labelHeight);
		for(var ctrl:ValvePumpController in _pumpValveControllers) { 
		    GUI.Label(Rect(sidePadding,ctrlY, screenThird, labelHeight), ctrl.ToString(), _leftLabelStyle);
		    ctrlY += labelHeight;
		}
        
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
        // Award player score based on their money and time taken.
    	if(PlayTime <= GoldTimeLimit) {
    		PlayerScore = Money*GoldScoreMult;
    	}
    	else if(PlayTime <= SilverTimeLimit) {
    		PlayerScore = Money*SilverScoreMult;
    	}
  		else if(PlayTime <= BronzeTimeLimit) {
  			PlayerScore = Money*BronzeScoreMult;
  		}
  		else {
  			PlayerScore = Money;
  		}
        
        CurrentLevel = 0;
    }
}

/* use targetController if you use IncreaseValve/-Pump to access a specific controller */
function InvokeGameAction(action:GameAction, param:float, targetController:int) {
    Debug.Log(Time.time + " - Yeay! Interaction: " + action + "(" + param + ")");
    switch (action) {
        case GameAction.IncreaseValve: 
            _pumpValveControllers[targetController].ValvePercentage += param;
        break;
        case GameAction.IncreasePump: 
            _pumpValveControllers[targetController].ValvePercentage -= param;
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
            
function StartRandomMiniGame(action:GameAction, param:float, controller:int, callback) { 
	_currentAction = action;
	_currentActionParam = param; 
	_currentActionController = controller;
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
	
    InvokeGameAction(_currentAction, _currentActionParam, _currentActionController); 
    _callback();
}
