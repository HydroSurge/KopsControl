#pragma strict


var InteractionHighlight:Material;
var NoInteractionHighlight:Material;
var InteractionTimeout = 5;
var InvokeAction:GameAction = GameAction.IncreaseValve;
var InvokeParam:float = 0.1;
var InvokeController:int = 0;

private var _nextInteractionTime:float = 0;
private var _playerIsInRange = false;
private var _lastCanInteract = false;

function CanInteract() {
    return CanInteract(true);
}
function CanInteract(includeTimeout:boolean) {
    var ctrl:ValvePumpController = MainGame.Instance().pumpValveControllers[InvokeController];
    switch(InvokeAction) {
        case GameAction.IncreaseValve: 
            if(ctrl.ValvePercentage >= 1) {
                return false;
            }
            break;
        case GameAction.IncreasePump: 
            if(ctrl.PumpPercentage >= 1) {
                return false;
            }
           break;
    } 
    
    if(includeTimeout) {
        return Time.time >= _nextInteractionTime;
    }
    return true;
}

function Start () {

}


function Update () {
 	if(MainGame.Instance().State != GameStates.Cavern) return;
 	
    var canInteract = CanInteract();
    if(canInteract) {
        renderer.material = InteractionHighlight;
        renderer.enabled = _playerIsInRange;        
    }
    else {
        renderer.material = NoInteractionHighlight;
        renderer.enabled = true;
    }
    
    // can interact changed -> update info
    if(canInteract != _lastCanInteract) {
        UpdateInfoPopup();
    }
        
     if(_playerIsInRange && Input.GetButtonDown("Jump")) {
        Debug.Log(_playerIsInRange);
        if(!CanInteract()) {
            Debug.Log(Time.time + " - Currently no interaction allowed!");
        }
        
        else {
            MainGame.Instance().StartRandomMiniGame(InvokeAction, InvokeParam, InvokeController, function() {
             _nextInteractionTime = Time.time + InteractionTimeout;
             UpdateInfoPopup();
            });
        }
    }
    
    _lastCanInteract = canInteract;
}



function OnTriggerEnter(c:Collider) {
    if(c.gameObject.tag == "Player") {
        _playerIsInRange = true;
        
        UpdateInfoPopup();

        ActivationInfo.Instance().isVisible = true;
    }
}

function UpdateInfoPopup() {
    var title:String = "";
    var desc:String = "";
    var percentage:String = "";
    var energy:String = "";
    var water:String = "";
    
    var newPercentage:float;
    var currentEnergy:float;
    var newEnergy:float;
    var currentWater:float;
    var newWater:float;
    var footer1:String;
    var footer2:String;
    
    // TODO: maybe the calculations here should be done in ValvePumpController
    var ctrl:ValvePumpController = MainGame.Instance().pumpValveControllers[InvokeController];
    switch(InvokeAction) {
        case GameAction.IncreaseValve: 
            title = "Valve";
            desc = "Activate valves to start produce additional energy to the grid"; 
            
            newPercentage = Mathf.Min(1,ctrl.ValvePercentage + InvokeParam);
            currentEnergy = ctrl.CalculateCurrentPowerGeneration();
            newEnergy = newPercentage * ctrl.ValveMaxPower;
            currentWater = ctrl.CalculateCurrentWaterNeed();
            newWater = newEnergy / ctrl.ValveRate;
            
            if(!CanInteract(false)) {
                // Running: $CurrentPercentage$
                // Energy: $CurrentEnergyGeneration$
                // Water:  $CurrentWaterDemand%
                percentage = String.Format("#xRunning: #n#i{0:0.0%}", ctrl.ValvePercentage);
                energy = String.Format("#xEnergy: #n#i{0:0.0} MWh", currentEnergy);
                water = String.Format("#xWater: #n#i{0:0.0} m³", currentWater);
            }
            else {
                // Running: $NewPercentage$ ($CurrentPercentage$ +/- $Difference$)
                // Energy: $NewEnergyGeneration$ ($CurrentEnergyGeneration$ +/- $Difference$)
                // Water: $NewWaterDemand$ ($CurrentWaterDemand$ +/- $Difference$)
                percentage = String.Format("#xRunning: #n#i{0:0.0%} ({1:0.0%}{2}{3:0.0%})", 
                                            newPercentage, 
                                            ctrl.ValvePercentage, 
                                            InvokeParam >=0 ? "+" : "", InvokeParam);
                energy = String.Format("#xEnergy: #n#i{0:0.0}MWh ({1:0.0}MWh{2}{3:0.0}MWh)", newEnergy, currentEnergy, newEnergy-currentEnergy >=0 ? "+" : "", newEnergy-currentEnergy);
                water = String.Format("#xWater: #n#i{0:0.0}m³ ({1:0.0}m³{2}{3:0.0}m³)", newWater, currentWater, newWater-currentWater >=0 ? "+" : "", newWater-currentWater);
            }
            
            break;
        case GameAction.IncreasePump: 
            title = "Pump";
            desc = "Activate pumps to consume energy from the grid";

            newPercentage = Mathf.Min(1,ctrl.PumpPercentage + InvokeParam);
            currentEnergy = ctrl.CalculateCurrentPowerDemand();
            newEnergy = (1-newPercentage) * ctrl.PumpMaxPower;
            currentWater = ctrl.CalculateCurrentWaterNeed();
            newWater = newEnergy / ctrl.PumpRate;
            
            if(!CanInteract(false)) {
                // Running: $CurrentPercentage$
                // Energy: $CurrentEnergyGeneration$
                // Water:  $CurrentWaterDemand%
                percentage = String.Format("#xRunning: #n#i{0:0.0%}", ctrl.PumpPercentage);
                energy = String.Format("#xEnergy: #n#i{0:0.0} MWh", currentEnergy);
                water = String.Format("#xWater: #n#i{0:0.0} m³", currentWater);
            }
            else {
                // Running: $NewPercentage$ ($CurrentPercentage$ +/- $Difference$)
                // Energy: $NewEnergyGeneration$ ($CurrentEnergyGeneration$ +/- $Difference$)
                // Water: $NewWaterDemand$ ($CurrentWaterDemand$ +/- $Difference$)
                percentage = String.Format("#xRunning: #n#i{0:0.0%} ({1}{2}{3:0%})", newPercentage, ctrl.PumpPercentage, InvokeParam >=0 ? "+" : "", InvokeParam);
                energy = String.Format("#xEnergy: #n#i{0:0.0}MWh ({1:0.0}MWh{2}{3:0.0}MWh)", newEnergy, currentEnergy, newEnergy-currentEnergy >=0 ? "+" : "", newEnergy-currentEnergy);
                water = String.Format("#xWater: #n#i{0:0.0}m³ ({1:0.0}m³{2}{3:0.0}m³)", newWater, currentWater, newWater-currentWater >=0 ? "+" : "", newWater-currentWater);
            }

            break;
        default:
            title = "Unknown";
            desc = "Unknown";
            percentage = "Unknown";
            energy = "Unknown";
            water = "Unknown";
    } 
    
    title += " " + (InvokeController+1);
    
    if(!CanInteract(false)) { // check if objects prevent interaction
        footer1 = "#932727FFThis object can currently not be activated:";
        footer2 = "It is already on maximum percentage.";
    }
    else if(!CanInteract()) { // check timeout prevents interaction
        footer1 = "#932727FFThis object can currently not be activated:";
        footer2 = "You need to wait a bit.";
    }
    else { // we can interact
        footer1 = "Press #932727FF<Space>#! to start the Mini-Game.";
        footer2 = "If you win, #275093FF'" + title + "'#! will be activated.";
    }
    
    ActivationInfo.Instance().UpdateInfo(title, desc, percentage, energy, water, footer1, footer2);
}

function OnTriggerExit(c:Collider) {
    if(c.gameObject.tag == "Player") {
        _playerIsInRange = false;
        ActivationInfo.Instance().isVisible = false;
    }
}