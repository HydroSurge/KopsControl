#pragma strict
var timePresure:float= 0;
var minValue:float = 0;
var maxValue:float = 100;
var minBalanceValue:float = 0;
var maxBalanceValue:float =0;
var currentValue:float = 0;
var updateCurrentValue:float = 0;
var currentTime:float =0;
var nextTimeMove:float = 0;
var failedMiniGame = false;
var presureIsBalanced = false;
var countTimePassed:float = 0;
var startTimePresureBalanced:float = 0;
var totalTimePassedPresureBalanced:float = 0;
var neededTimeToPass:float = 0;
var passedMiniGame = false;
var bottom_limit:GameObject;
var top_limit:GameObject;
var pump_tube:GameObject;
var pump_top:GameObject;
var indicator:GameObject;
var offset:GameObject;
var pumpMoveUp = false;
var pumpMovementCount:float = 0;
var offSetHeight:float = 0;
var changeCurrentValue:float = 0;
var changeIndicatorValue:float = 0;
var pauseGame = false;

function StartNewGame() 
{
    totalTimePassedPresureBalanced = 0;
    changeIndicatorValue = 0.1;
    currentTime = Time.time;
    timePresure = 0.005;
    nextTimeMove = currentTime + timePresure;
    changeCurrentValue = 0.1;
    bottom_limit = GameObject.Find("limit_bott");
    top_limit = GameObject.Find("limit_top");
    indicator = GameObject.Find("Indicator");
    offset = GameObject.Find("Offset");
    pump_tube = GameObject.Find("pump_tube");
    pump_top = GameObject.Find("TopOfPump");
    currentValue = (((top_limit.transform.position.y - bottom_limit.transform.position.y)/100)*35)
                    + bottom_limit.transform.position.y;
    offset.transform.position.y = (((top_limit.transform.position.y - bottom_limit.transform.position.y)/100)*50)
                    + bottom_limit.transform.position.y;
    offSetHeight = offset.transform.lossyScale.y;
        indicator.renderer.material.color = Color.red;
        
    failedMiniGame = false;
    passedMiniGame = false;
}

function AnimatePumpMovement()
{
	if(pumpMoveUp)
	{
		if(pumpMovementCount<3)
		{
			pump_top.transform.position.y += 0.1;
			pump_tube.transform.position.y += 0.1;
			pumpMovementCount += 0.1;
		}
		else
		{
			pumpMoveUp = false;
			pumpMovementCount = 0;
		}
	}
	else
	{
		if(pumpMovementCount>-3)
		{
			pump_top.transform.position.y -= 0.1;
			pump_tube.transform.position.y -= 0.1;
			pumpMovementCount -= 0.1;
		}
		else
		{
			pumpMoveUp = true;
			pumpMovementCount = 0;
		}
	}
}

function Update () {
    if(MainGame.Instance().State != GameStates.MiniGame2) return;
	//add value to currentvalue when user press space bar

	if(!failedMiniGame && !passedMiniGame)
	{
	if(Input.GetKey("up") || Input.GetKey("right")
	|| Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.D)
	&& currentValue<top_limit.transform.position.y){currentValue += changeCurrentValue;}
	else if (Input.GetKey("down") || Input.GetKey("left")
	|| Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.A)
	&& currentValue>bottom_limit.transform.position.y){currentValue -= changeCurrentValue;}
	pumpMiniGameLogic(MainGame.Instance().CurrentLevel);
		if(presureIsBalanced)
		{
		AnimatePumpMovement();
		}
	}
	
	
	if(Input.GetKey(KeyCode.R) && failedMiniGame)
	{
	//reset values
		failedMiniGame = false;
		passedMiniGame = false;
		currentValue = (((top_limit.transform.position.y - bottom_limit.transform.position.y)/100)*35)
				+ bottom_limit.transform.position.y;
	}
	else if (Input.GetKey(KeyCode.Escape) && failedMiniGame)
	{
	//return back to main game
			//reset values
		failedMiniGame = false;
		passedMiniGame = false;
		currentValue = (((top_limit.transform.position.y - bottom_limit.transform.position.y)/100)*35) + bottom_limit.transform.position.y;
        MainGame.Instance().minigameFinished(false);
	}
	
	if (passedMiniGame && !failedMiniGame)
	{
		//reset values
		failedMiniGame = false;
		passedMiniGame = false;
		currentValue = (((top_limit.transform.position.y - bottom_limit.transform.position.y)/100)*35) + bottom_limit.transform.position.y;
        MainGame.Instance().minigameFinished(true);
	}
	
}

function pumpMiniGameLogic(difficulty:int)
{
	//standard values for difficulty - level 1
	minBalanceValue = offset.transform.position.y  - (offSetHeight);
	maxBalanceValue = offset.transform.position.y + (offSetHeight);
	neededTimeToPass=4;
	indicator.transform.position.y = currentValue;
	changeCurrentValue = 0.1;
	//change the needed values depending on the level/difficulty
	//case corresponds to level
	switch(difficulty)
	{
		case 2:changeCurrentValue+=0.02;changeIndicatorValue=0.1;break;
		case 3:changeCurrentValue+=0.04;changeIndicatorValue=0.105;break;
		case 4:changeCurrentValue+=0.06;changeIndicatorValue=0.11;break;
		case 5:changeCurrentValue+=0.08;changeIndicatorValue=0.115;break;
		case 6:changeCurrentValue+=0.1;changeIndicatorValue=0.12;break;
		case 7:changeCurrentValue+=0.12;changeIndicatorValue=0.12;break;
		case 8:changeCurrentValue+=0.14;changeIndicatorValue=0.12;break;
		case 9:changeCurrentValue+=0.16;changeIndicatorValue=0.12;break;
		case 10:changeCurrentValue+=0.18;changeIndicatorValue=0.12;break;

	}
	
	//timer for updating current value
	if(currentTime>nextTimeMove)
	{
	Debug.Log("Next move");
		nextTimeMove = currentTime + timePresure;
		if(offset.transform.position.y<=currentValue)
		{
			if(currentValue<=top_limit.transform.position.y)
			{
				currentValue +=changeIndicatorValue;
			}
		}
		else if (offset.transform.position.y>currentValue)
		{
			if(currentValue>=bottom_limit.transform.position.y)
			{
				currentValue -=changeIndicatorValue;
			}
		}
	}	
	else
	{
		currentTime = Time.time;
	}
	
	//check if player has balanced presure
	if(minBalanceValue <= currentValue && maxBalanceValue >= currentValue){
	presureIsBalanced = true;
	indicator.renderer.material.color = Color.green;
	}
	else {presureIsBalanced = false;
	indicator.renderer.material.color = Color.red;
	}
	
	//if presure is balanced, start timer
	if(presureIsBalanced &&  startTimePresureBalanced == 0.0)
	{
		startTimePresureBalanced = Time.time;
	}
	//if presure is balanced and timer is running, update time running
	else if (presureIsBalanced && startTimePresureBalanced > 0)
	{
		totalTimePassedPresureBalanced = (Time.time - startTimePresureBalanced);
	}
	//if presure is not balanced, reset timer values
	else if (!presureIsBalanced){startTimePresureBalanced = 0.0; totalTimePassedPresureBalanced=0.0;}
	
	//check if player has completed minigame
	if(!failedMiniGame)
	{
	passedMiniGame =(totalTimePassedPresureBalanced >= neededTimeToPass)?true:false;
	}
	
	//if the current value gets to zero, failed to complete minigame
	if(!failedMiniGame && !passedMiniGame)
	{
	failedMiniGame = (currentValue<=bottom_limit.transform.position.y ||
					  currentValue>=top_limit.transform.position.y)?true:false;
	}
}

function OnGUI()
{
    if(MainGame.Instance().State != GameStates.MiniGame2) return;

	GUI.skin.box.alignment = TextAnchor.MiddleCenter;
	GUI.skin.box.fontSize = 14;
	
	//draw box for explanation
	GUI.Box(Rect(10,10,175,100),"INSTRUCTIONS\nPress [A] or [W] to go UP\nand [S] or [D] to go DOWN");
	GUI.skin.box.fontSize = 20;
	GUI.color = Color.white;
	//show time left if indicator is balanced
	if(presureIsBalanced && !passedMiniGame && !failedMiniGame)
	{
	var seconds:int = 0;
	seconds = (neededTimeToPass-totalTimePassedPresureBalanced);
	
	GUI.backgroundColor = Color.black;
	GUI.contentColor = Color.white;
	GUI.color = Color.white;
		GUI.Box(Rect(((Screen.width/100)*67),50,250,75),
		"The presure is balanced!\nSeconds left to complete: \n" + seconds);		
		if(seconds==0)
		{passedMiniGame=true;}				
	}
	//show box to retry if failed to pass
	if(failedMiniGame && !passedMiniGame)
	{
		GUI.Box(Rect(((Screen.width/100)*60),50,350,75),
		"Failed to keep the presure balanced!\nPress [R] to retry or [Esc] to exit");
	}

}