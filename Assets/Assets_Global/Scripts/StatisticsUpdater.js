#pragma strict
#pragma downcast

class IndicatorScreen {
    var title:TextMesh;
    var water:TextMesh;
    var power:TextMesh;
}   

class StatisticsScreen {
    var title:TextMesh;
    var percentage:TextMesh;
    var water:TextMesh;
    var power:TextMesh;
}

var indicator1:IndicatorScreen;
var indicator2:IndicatorScreen;
var indicator3:IndicatorScreen;


var valve1:StatisticsScreen;
var valve2:StatisticsScreen;
var valve3:StatisticsScreen;
var pump1:StatisticsScreen;
var pump2:StatisticsScreen;
var pump3:StatisticsScreen;

private var _ctrl1:ValvePumpController;
private var _ctrl2:ValvePumpController;
private var _ctrl3:ValvePumpController;

var pumpValve1 :ValvePumpController;
var pumpValve2 :ValvePumpController;
var pumpValve3 :ValvePumpController;



function Start () {
}

function Update () {
    // TODO: per row summary
    UpdateIndicator(indicator1, "Indicator 1", MainGame.Instance().pumpValveControllers[0]);
    UpdateIndicator(indicator2, "Indicator 2", MainGame.Instance().pumpValveControllers[1]);
    UpdateIndicator(indicator3, "Indicator 3", MainGame.Instance().pumpValveControllers[2]);
    
    UpdateValve(valve1, "Valve 1", MainGame.Instance().pumpValveControllers[0]);
    UpdateValve(valve2, "Valve 2", MainGame.Instance().pumpValveControllers[1]);
    UpdateValve(valve3, "Valve 3", MainGame.Instance().pumpValveControllers[2]);
	
    UpdatePump(pump1, "Pump 1", MainGame.Instance().pumpValveControllers[0]);
    UpdatePump(pump2, "Pump 2", MainGame.Instance().pumpValveControllers[1]);
    UpdatePump(pump3, "Pump 3", MainGame.Instance().pumpValveControllers[2]);
	
}

function UpdateIndicator(screen:IndicatorScreen, title:String, ctrl:ValvePumpController) {
	screen.title.text	=  	title;
	screen.power.text 	=  	String.Format("{0:0.0 MwH}",ctrl.CalculateCurrentPowerGeneration() - ctrl.CalculateCurrentPowerDemand());
	screen.water.text 	=	String.Format("{0:0.0 m³}",ctrl.CalculateCurrentWaterPump() - ctrl.CalculateCurrentWaterNeed());
}

function UpdateValve(screen:StatisticsScreen, title:String, ctrl:ValvePumpController) {
	screen.title.text	=  	title;
	screen.percentage.text	=  	String.Format("{0:0.0%}",ctrl.ValvePercentage);
	screen.power.text 	=  	String.Format("{0:0.0 MwH}",ctrl.CalculateCurrentPowerGeneration());
	screen.water.text 	=	String.Format("{0:0.0 m³}",ctrl.CalculateCurrentWaterPump());
}
function UpdatePump(screen:StatisticsScreen, title:String,ctrl:ValvePumpController) {
	screen.title.text	=  	title;
	screen.percentage.text	=  	String.Format("{0:0.0%}", ctrl.PumpPercentage);
	screen.power.text 	=  	String.Format("{0:0.0 MwH}",ctrl.CalculateCurrentPowerDemand());
	screen.water.text 	=	String.Format("{0:0.0 m³}",ctrl.CalculateCurrentWaterNeed());
}