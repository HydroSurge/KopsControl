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


}

function GameEvents()//checks for fired
{
	
}
function MoneyUpdate()
{
	
		//Global.MONEY += Global.POWER_USED;
		//Global.MONEY -= tickMATINENCE;
		
	
}
function WaterUpdate()
{

}
function addWaterLake(){


}
function takeWaterLake(){

}
function addWaterResivor(){


}
function takeWaterResivor(){

}
function PowerUpdate(){

}
static function addPower(number : int)//jaime for buildings adding power
{
	//Global.POWER_AVAILABLE += number;
}
static var takePower = function(energyneeded : int)//for building requesting power
{
	
};
