#pragma strict

var indicatorContainer:Component;
var solvedLevelMaterial:Material;
var currentLevelMaterial:Material;
var unsolvedLevelMaterial:Material;
var currentLevelScript:String;

private var _lastLevel = -1;
private var _children:MeshRenderer[];

function Start () {
    _children = indicatorContainer.GetComponentsInChildren.<MeshRenderer>();
}

function Update () {
   	var level = MainGame.Instance().Level;
    if(level != _lastLevel) {

        for(var i = 0; i < _children.length; i++) {
            var l:MeshRenderer = _children[i];
            var p:GameObject = l.gameObject;

            var scripts:MonoBehaviour[] = p.GetComponents.<MonoBehaviour>();
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