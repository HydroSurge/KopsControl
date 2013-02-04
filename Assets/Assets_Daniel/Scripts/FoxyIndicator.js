#pragma strict

var indicatorContainer:Component;
var solvedLevelMaterial:Material;
var currentLevelMaterial:Material;
var unsolvedLevelMaterial:Material;
var currentLevelScript:String;
// TODO: get level from globals
var level = 0; 

private var _lastLevel = 0;
private var _children:MeshRenderer[];

function Start () {
    _children = indicatorContainer.GetComponentsInChildren.<MeshRenderer>();
}

function Update () {
    DebugLevelSet();

    if(level != _lastLevel) {

        for(var i = 0; i < _children.length; i++) {
            var l:MeshRenderer = _children[i];
            var p:GameObject = l.gameObject;

            var scripts = p.GetComponents(MonoBehaviour);
            for(var s:MonoBehaviour in scripts) {
                Destroy(s);
            }
           
            if(i < level) {
                l.material = unsolvedLevelMaterial;
            }
            else if(level == i) {
                p.AddComponent(currentLevelScript);
                l.material = currentLevelMaterial;
            }
            else {
                l.material = solvedLevelMaterial;
            }
        }

        _lastLevel = level;
    }
}

function DebugLevelSet() {
    if(Input.GetKeyDown(KeyCode.F1)) {
        level = 0;
    }
    else if(Input.GetKeyDown(KeyCode.F2)) {
        level = 1;
    }
    else if(Input.GetKeyDown(KeyCode.F3)) {
        level = 2;
    }
    else if(Input.GetKeyDown(KeyCode.F4)) {
        level = 3;
    }
    else if(Input.GetKeyDown(KeyCode.F5)) {
        level = 4;
    }
    else if(Input.GetKeyDown(KeyCode.F6)) {
        level = 5;
    }
    else if(Input.GetKeyDown(KeyCode.F7)) {
        level = 6;
    }
    else if(Input.GetKeyDown(KeyCode.F8)) {
        level = 7;
    }
    else if(Input.GetKeyDown(KeyCode.F9)) {
        level = 8;
    }
    else if(Input.GetKeyDown(KeyCode.F10)) {
        level = 9;
    }
    else if(Input.GetKeyDown(KeyCode.F11)) {
        level = 10;
    }
}