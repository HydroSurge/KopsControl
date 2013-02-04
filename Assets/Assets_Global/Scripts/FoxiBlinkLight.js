#pragma strict

var blinkRate:float = 0.5; 
var blinkOffset:float = 0.3;
var maxOffset:float = 3;

private var _initialPosition:Vector3;
private var _nextBlink = 0.0;


function Start() {
    _initialPosition = transform.localPosition;
}

function Update () {
    var light:Light = GetComponent(Light);

    if(Time.time > _nextBlink) {
        _nextBlink = Time.time + blinkRate;

       
        transform.Translate(0, 0, blinkOffset, Space.Self);
        if(Mathf.Abs(transform.localPosition.x - _initialPosition.x) >= maxOffset) {
            transform.localPosition = _initialPosition;
        }
    }
}