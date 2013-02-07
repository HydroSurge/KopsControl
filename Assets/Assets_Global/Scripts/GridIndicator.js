#pragma strict

var red:Texture;
var orange:Texture;
var orangeFactor:float = 0.6;
var green:Texture;
var greenFactor:float = 0.5;

var arrow:Texture;

var sidePaddingRelative:boolean;
var sidePadding:float;

var labelStyle:GUIStyle;

private var _zeroStyle:GUIStyle;
private var _lowerStyle:GUIStyle;
private var _upperStyle:GUIStyle;

function Start () {
    if(sidePadding > 1 || sidePadding < 0) {
        sidePaddingRelative = false;
    }    
    
    _zeroStyle = GUIStyle(labelStyle);
    _zeroStyle.alignment = TextAnchor.MiddleCenter;
    _lowerStyle = GUIStyle(labelStyle);
    _lowerStyle.alignment = TextAnchor.MiddleRight;
    _upperStyle = GUIStyle(labelStyle);
    _upperStyle.alignment = TextAnchor.MiddleLeft;
}

function OnGUI() {
    if(MainGame.Instance().State != GameStates.Cavern) return;

        
    if(Event.current.type == EventType.Repaint)
    {
        var sp = sidePaddingRelative 
                    ? Screen.width * sidePadding 
                    : sidePadding;

        var redRect = Rect(sp,5,Screen.width - sp - sp,59);
        DrawBox(redRect, red, 20);
        
        var orangeRect = Rect((Screen.width - (redRect.width*orangeFactor))/2, redRect.y + 9, redRect.width * orangeFactor, 41);
        DrawBox(orangeRect, orange, 20);

        var greenRect = Rect((Screen.width - (orangeRect.width*greenFactor))/2, orangeRect.y, orangeRect.width * greenFactor, 41);
        DrawBox(greenRect, green, 20);
        
        //
        // Label Drawing
        
        // zero label
        GUI.Label(redRect, String.Format("{0:0.##}KWh", MainGame.Instance().GridBalance), _zeroStyle); // TODO: maybe 0?
        GUI.Label(Rect(redRect.x, redRect.y, orangeRect.x - redRect.x - 5, redRect.height), "-" + MainGame.Instance().gameOverEnergyOffset + "KWh", _lowerStyle);
        GUI.Label(Rect(orangeRect.xMax + 5, redRect.y, redRect.xMax - orangeRect.xMax - 5, redRect.height), "+" + MainGame.Instance().gameOverEnergyOffset + "KWh", _upperStyle);
        
        //
        // Arrow Drawing
        
        
        var zeroX = redRect.x + (redRect.width - arrow.width) / 2; // grid=0        --> zeroX
        var gameOverX = orangeRect.xMax + 10;                      // grid=gameOver --> gameOverX
        
        // we just calculate the offset (linear interpolation) and then we add this offset to the zeroX
        // gameOver --> (gameOverX - zeroX) 
        // grid --> arrowX
        var arrowX = zeroX + ( (MainGame.Instance().GridBalance * (gameOverX - zeroX)) / MainGame.Instance().gameOverEnergyOffset );
        // prevent overflow/underflow
        arrowX = Mathf.Max(redRect.x, Mathf.Min(redRect.xMax - (arrow.width/2), arrowX));
        var arrowRect = Rect(arrowX, redRect.y + 26, 31, 28);
        Graphics.DrawTexture(arrowRect, arrow, 0,0,0,0);
    }
}

function DrawBox(rect:Rect, tex:Texture, pad:float) {
    // Left
    Graphics.DrawTexture(Rect(rect.x, rect.y, pad, rect.height), 
                         tex,
                         TexRect(0, 0, 20,tex.height, tex),
                         0,0,0,0);
    // Right
    Graphics.DrawTexture(Rect(rect.x + rect.width - pad, rect.y, pad, rect.height), 
                         tex,
                         TexRect(tex.width - pad, 0, 20,tex.height, tex),
                         0,0,0,0);
                         
    // Center
    var curX = rect.x + pad;
    var endX = rect.x + rect.width - pad;
    do {
        var w = Mathf.Min(tex.width - 40, endX - curX);
        
        Graphics.DrawTexture(Rect(curX, rect.y, w, rect.height), 
                             tex,
                             TexRect(pad, 0, w, tex.height, tex),
                             0,0,0,0);
        
        curX += w;

      
    } while(curX < endX);
}

function TexRect(x:float, y:float, w:float, h:float, tex:Texture) {
    return Rect(x / tex.width, y / tex.height, w / tex.width, h / tex.height);
}