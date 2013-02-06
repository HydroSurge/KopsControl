#pragma strict

var isVisible:boolean = true;

var title:String;
var description:String;
var line1:String;
var line2:String;
var line3:String;
var line4:String;
var footer1:String;
var footer2:String;

var titleStyle:GUIStyle;
var descriptionStyle:GUIStyle;
var contentStyle:GUIStyle;
var footerStyle:GUIStyle;

var width:float = 480;
var height:float = 270;
 
function Start () {
}

function OnGUI () {
    if(MainGame.Instance().State != GameStates.Cavern || !isVisible) return;

    // Background
    var boxRect = Rect( (Screen.width - width) / 2, Screen.height - height - 80, width, height);
    GUI.Box(boxRect, "");
    
    // Title
    GUI.Label(Rect(boxRect.x + 10, boxRect.y + 10, width - 20, 35), title, titleStyle); 
    
    // Description
    GUI.Label(Rect(boxRect.x + 10, boxRect.y + 45, width - 20, 25), description, descriptionStyle); 
    
    var cY = 95;
    FancyLabel.Create(Rect(boxRect.x + 10, boxRect.y + cY + (0*25), width - 20, 25), line1, 
        contentStyle, TextAlignment.Left); 
    FancyLabel.Create(Rect(boxRect.x + 10, boxRect.y + cY + (1*25), width - 20, 25), line2, 
        contentStyle, TextAlignment.Left); 
    FancyLabel.Create(Rect(boxRect.x + 10, boxRect.y + cY + (2*25), width - 20, 25), line3, 
        contentStyle, TextAlignment.Left); 
    FancyLabel.Create(Rect(boxRect.x + 10, boxRect.y + cY + (3*25), width - 20, 25), line4, 
        contentStyle, TextAlignment.Left); 
    FancyLabel.Create(Rect(boxRect.x + 10, boxRect.y + cY + (4*25), width - 20, 25), footer1, 
        footerStyle, TextAlignment.Center); 
    FancyLabel.Create(Rect(boxRect.x + 10, boxRect.y + cY + (5*25), width - 20, 25), footer2, 
        footerStyle, TextAlignment.Center); 
}

function UpdateInfo(t:String, d:String, l1:String, l2:String, l3:String, f1:String, f2:String) {
    title = t;
    description = d;
    line1 = l1;
    line2 = l2;
    line3 = l3;      
    footer1 = f1;    
    footer2 = f2;    
}

static function Instance() {
    var mainCameras = GameObject.FindGameObjectsWithTag("MainCamera");
    if(mainCameras == null || mainCameras.length == 0) {
        return null;
    }

    var info:ActivationInfo = mainCameras[0].GetComponent(ActivationInfo);
    return info;
}

