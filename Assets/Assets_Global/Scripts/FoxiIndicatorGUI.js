#pragma strict

var indicatorBackground:Texture;
var solvedLevel:Texture;
var unsolvedLevel:Texture;
var currentLevel:Texture;

function Start () {

}

function Update () {
}

function OnGUI() {
	if(MainGame.Instance().State != GameStates.Cavern) return;
	
    if(Event.current.type == EventType.Repaint) {
    	var level = MainGame.Instance().Level;
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
