#pragma strict

var indicatorBackground:Texture;
var solvedLevel:Texture;
var unsolvedLevel:Texture;
var currentLevel:Texture;
// TODO: get level from globals
var level:int = 5;


function Start () {

}

function Update () {
    DebugLevelSet();
}

function OnGUI() {
    if(Event.current.type == EventType.Repaint) {
        var y = Screen.height - 210;
        var x = Screen.width - 70;
        // background
        Graphics.DrawTexture(Rect(x,y, 60, 200), 
                            indicatorBackground, 
                            0,0,0,0);

        // indicators
        y += 11;
        x += 11;
        for(var i = 9; i >= 0; i--) {
            var tex:Texture;
            if(i < level) {
                tex = solvedLevel;
            }
            else if(level == i) {
                tex = currentLevel;
            }
            else {
                tex = unsolvedLevel;
            }

            Graphics.DrawTexture(Rect(x,y,38,15), tex, 0,0,0,0);

            y+= 18; // offset+spacing to bottom
        }
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