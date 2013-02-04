#pragma strict
var boxStyle : GUIStyle;
var IMGsmiley : Texture;
var IMGpowerUsed : Texture;
var IMGpowerAvail : Texture;
var IMGmoney : Texture;
var IMGstocks : Texture;
var Timer = 0;
var firedtimer = 0;
var LOST = false;
var RatingStart = false;
var tickMATINENCE = 0;
static var TotalBuildingtHappeness = 0;
static var TotalBuilding = 0;
static var PowerAvailable = 0;
static var POWERUSED = 0;
static var MATINENCECOST = 0;

function Start () {
	
}

function Update () {//check for new game set events
	//PowerAvailable = Global.POWER_AVAILABLE;
	tickMATINENCE = MATINENCECOST;
	GameEvents();
	MoneyUpdate();
	
	
	//if(Global.WORLD_VIEW){
	//	Cameraman.SwitchCamera('MainCamera');
	//}
		
}

function OnGUI(){

		var size = 300;
		var itemNum = 1;
		var yPos = Screen.height;
		var xPos = Screen.width - (size*2);	
		GUI.Box	(Rect(xPos,yPos -(size*itemNum),size,size ), IMGstocks,boxStyle);
		GUI.Box	(Rect(xPos + size,yPos -(size*itemNum),size,size ),  'h');

}

function GameEvents()//checks for fired
{
	
}
function MoneyUpdate()
{
	
		//Global.MONEY += Global.POWER_USED;
		//Global.MONEY -= tickMATINENCE;
		
	
}
function WaterUpdate(){
}

function addWaterLake(amount : int){
	Global.LAKEWATER += amount;
}

function takeWaterLake(amount : int){
	Global.LAKEWATER -= amount;
}

function addWaterReservoir(amount : int){
	Global.RESERVOIRWATER += amount;
}

function takeWaterReservoir(amount : int){
	Global.RESERVOIRWATER -= amount;
}

function PowerUpdate(){

}


//function to be called after finishing minigame (valve)
function valveActivated(){
	takeWaterLake(20);
	addWaterReservoir(20);
	addPower(20);
}
//function to be called after finishing minigame (pump)
function pumpActivated(){
	addWaterLake(20);
	takeWaterReservoir(20);
	takePower(20);
}



function addPower(amount : int)//jaime for buildings adding power
{
	Global.POWER += amount;
	//Global.POWER_AVAILABLE += number;
}
function takePower(amount : int){
	Global.POWER -= amount;
}
//static var takePower = function(energyneeded : int)//for building requesting power
//{
	
//};
