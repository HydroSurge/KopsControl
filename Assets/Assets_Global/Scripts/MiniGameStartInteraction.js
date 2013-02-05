#pragma strict


var InteractionHighlight:Material;
var NoInteractionHighlight:Material;
var InteractionTimeout = 5;
var InvokeAction:GameAction = GameAction.IncreaseValve1;
var InvokeParam:float = 0.1;

private var _nextInteractionTime:float = 0;
private var _playerIsInRange = false;

function CanInteract() {
    return Time.time >= _nextInteractionTime;
}

function Start () {

}


function Update () {
    if(CanInteract()) {
        renderer.material = InteractionHighlight;
        renderer.enabled = _playerIsInRange;
    }
    else {
        renderer.material = NoInteractionHighlight;
        renderer.enabled = true;
    }

     if(_playerIsInRange && Input.GetButtonDown("Jump")) {
        
        if(!CanInteract()) {
            Debug.Log(Time.time + " - Currently no interaction allowed!");
        }
        
        else {
            // TODO: start mini game to send message to game
            MainGame.Instance().InvokeGameAction(InvokeAction, InvokeParam);
            _nextInteractionTime = Time.time + InteractionTimeout;
        }
    }
}

function OnTriggerEnter(c:Collider) {
    if(c.gameObject.tag == "Player") {
        _playerIsInRange = true;
    }
}


function OnTriggerExit(c:Collider) {
    if(c.gameObject.tag == "Player") {
        _playerIsInRange = false;
    }
}