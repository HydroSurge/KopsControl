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
static var count = 250;
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
		GUI.Box	(Rect(xPos+450,yPos -(size*itemNum)+170,size,size ), IMGres,boxStyle);
		GUI.Box	(Rect(xPos+350,yPos -(size*2),size,size ), IMGdam,boxStyle);
		GUI.Box	(Rect(xPos+350,yPos -(size*2)+count,size,size ), IMGwave,boxStyle);
		GUI.Box	(Rect(xPos+250,yPos-550,90,30),  Global.LAKEPRESENT+'%');
		GUI.Box	(Rect(xPos+350,yPos-100,90,30),  Global.RESPRESENT+'%');

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
	if(count>0){
		count-=5;
		Global.LAKEPRESENT+=1;
		Global.RESPRESENT-=1;
	}
}

function takeWaterLake(amount : int){
	Global.LAKEWATER -= amount;
	if(count<500){
		count+=5;
		Global.LAKEPRESENT-=1;
		Global.RESPRESENT+=1;
	}
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
