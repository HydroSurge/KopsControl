#pragma strict
import System.Collections.Generic;

var texture: Texture;
var boxStyle: GUIStyle;
var x = 0;
var y = 0;	
var w = 200;
var h = 200;
var currentTime: float = 0;
var nextMove: float = 0;
var list:List.<Lightning>;
var numbers:List.<int>;


function Start () {
currentTime = Time.time;
nextMove = Time.time+0.5;
list.Add(new Lightning());
}

function OnGUI(){

	if(MainGame.Instance().SHOW){
		for(var i:Lightning in list)
		{
		GUI.Box(Rect(i.x,i.y,w,h),texture, boxStyle);
		}
	}
	
	
	//if(GUI.Button (Rect(10,10,110,70), "show"))
	//{
	//	createLightning(0.4);
	//}
}

function Update () {
	if(currentTime<nextMove)
	{
		currentTime=Time.time;
	}
	var index = 0 ;
	numbers = new List.<int>();
	for(var i: Lightning in list)
	{
		
		i.x +=2;
		if(i.up)
		{
		i.y += 1;
			if(i.y > 30)
			{
			i.up = false;		
			}
		}
		else
		{
			if(i.y<0)
			{
				i.up = true; 
			}
		i.y -=1;
		}
		if(i.x > 900){ numbers.Add(index);}
		index++;
	}
	
	if(numbers!=null)
	{
	for(var n: int in numbers)
	{
		list.RemoveAt(n);
	}
	}
}

function createLightning(speed:float)
{
		nextMove = currentTime+speed;
		var item = new Lightning();
		list.Add(item);
}
