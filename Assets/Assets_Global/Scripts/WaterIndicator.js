#pragma strict

var background:Texture;
var waterBackground:Texture;
var waterWave:Texture;
var separator:Texture;

var dam:Texture;
var reservoir:Texture;

var labelStyle:GUIStyle;

function Start () {

}

function OnGUI() {
    if(MainGame.Instance().State != GameStates.Cavern) return;
    
    if(Event.current.type == EventType.Repaint)
    {
        var overallRect = Rect(Screen.width - 20, 60, 38, Screen.height - 120);
        
        //
        // Dam
        var damRect = Rect(overallRect.x + 1, overallRect.y + 10, 38, 225);
        Graphics.DrawTexture(Rect(damRect.x, damRect.y, damRect.width, 250), background, 0, 0, 20, 20);
        
        var damRectH = damRect.height * MainGame.Instance().LAKEPRESENT;
        var fillDamRect = Rect(damRect.x, damRect.y + damRect.height - damRectH, damRect.width, damRectH);
        FillWater(fillDamRect); 
        
        GUI.Box	(Rect(fillDamRect.x - 90, fillDamRect.y, 80, 20),  String.Format("{0:0%}",MainGame.Instance().LAKEPRESENT));
        StyledBox(Rect(Screen.width - 125, 5, 120, 60), "Upper Reservoir", dam);
        
        //
        // Reservoir
        var resRect = Rect(overallRect.x + 1, overallRect.y + overallRect.height - 35 - 225, 38, 225);
        Graphics.DrawTexture(Rect(resRect.x, resRect.y, resRect.width, 250), background, 0, 0, 20, 20);
            
        var resRectH = resRect.height * MainGame.Instance().RESPRESENT;
        var fillResRect = Rect(resRect.x, resRect.y + resRect.height - resRectH, resRect.width, resRectH);
        FillWater(fillResRect);        
        
        GUI.Box	(Rect(fillResRect.x - 90, fillResRect.y, 80, 20),  String.Format("{0:0%}",MainGame.Instance().RESPRESENT));
        StyledBox(Rect(Screen.width - 125, Screen.height - 65,120,60), "Lower Reservoir", reservoir);
    }
}

function StyledBox(rect:Rect, text:String, image:Texture) {
    GUI.Box	(rect,  "");
    GUI.Box	(rect,  GUIContent(text, image), labelStyle);
}

function FillWater(rect:Rect) {
    // fill water
    var posY = rect.y + 7;
    var endPos = rect.y + rect.height;
    var h = 0;
    var i = 0;  // counter for miscalculations
    do {
        // the rest or a full texture height
        h = Mathf.Min(endPos - posY , waterBackground.height);
        GUI.DrawTexture(Rect(rect.x, posY, rect.width, h), waterBackground, ScaleMode.ScaleAndCrop);
        posY += h;    
    } while(posY < endPos && i++ < 10);
    
    // draw wave
    GUI.DrawTexture(Rect(rect.x,rect.y, 19, 7), waterWave);
}

function Update () {

}