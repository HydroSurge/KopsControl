#pragma strict
var pressedMaterial : Material;
var idleMaterial : Material;
final var gameSolution1 = new Array (0, 1, 2, 3);
final var gameSolution2 = new Array (0, 3, 2, 1, 0);
final var gameSolution3 = new Array (1, 3, 2, 3, 1, 0);
final var gameSolution4 = new Array (1, 3, 2, 1, 0, 0, 2);
private var gameArray = new Array();
private var game = new Array();
private var userInput = false;
private var currentGame : Game;
var valveWheel : GameObject;
var start = true;

var textStyle:GUIStyle;
var dialogText:String;
var percentageText:String;

function StartNewGame() {
    Debug.Log("Start MiniGame 1");
    Screen.showCursor = true;
	currentGame = gameArray[0];
	
    dialogText = "Follow the sequence of the squares turning red.\nClick any key to start.";
    percentageText = "0%";
}

function OnGUI() {
    if(MainGame.Instance().State != GameStates.MiniGame1) return;
    
    GUI.Label(Rect(10, Screen.height - 150, 150, 25), dialogText, textStyle);
    GUI.Label(Rect(50, 150, 150, 25), percentageText, textStyle);
}

function startGame() {
	userInput = false;
	var solution : int[] = currentGame.getGameSolution();
	for(var i = 0; i < solution.length; i++) {
		Debug.Log(solution[i]);
		switch(solution[i]) {
			case 0 :
			GameObject.Find("Down").renderer.material = pressedMaterial;
			yield WaitForSeconds(1);
			GameObject.Find("Down").renderer.material = idleMaterial;
			break;
			case 1 :
			GameObject.Find("Left").renderer.material = pressedMaterial;
			yield WaitForSeconds(1);
			GameObject.Find("Left").renderer.material = idleMaterial;
			break;
			case 2 :
			GameObject.Find("Up").renderer.material = pressedMaterial;
			yield WaitForSeconds(1);
			GameObject.Find("Up").renderer.material = idleMaterial;
			break;
			case 3 :
			GameObject.Find("Right").renderer.material = pressedMaterial;
			yield WaitForSeconds(1);
			GameObject.Find("Right").renderer.material = idleMaterial;
			break;
		}
	}
	userInput = true;
}

function Start() {
	gameArray.push(new Game(1,gameSolution1));
	gameArray.push(new Game(2,gameSolution2));
	gameArray.push(new Game(3,gameSolution3));
	gameArray.push(new Game(4, gameSolution4));
	dialogText = "Follow the sequence of the squares turning red.\nClick any key to start.";
	percentageText = "0%";    
	currentGame = gameArray[0];
}

function Update() {
    if(MainGame.Instance().State != GameStates.MiniGame1) return;
    
    if(Input.GetKeyDown(KeyCode.Escape)) {
        MainGame.Instance().minigameFinished(false);
    }
    
	if(start) {
		if(Input.anyKey) {
			startGame();
			start = false;
		}
	}
	if(currentGame.isCorrectSolution(game)) {
		if(currentGame.getGameNumber() < gameArray.length) {		
			dialogText = "Correct sequence, now press the spacebar\nto continue to the next level.";
			clearLevel();
			if(Input.GetButtonDown("Jump")) {	
				game = new Array();
				currentGame = gameArray[currentGame.getGameNumber()];
				startGame();
			}			
		}
		else {
			dialogText = "Congratulations, you've started the generator!";
            
            Screen.showCursor = false;
            MainGame.Instance().minigameFinished(true);
			//When the minigame is over
		}
	}
	else if(currentGame.getSolutionLength() == game.length && Input.GetButtonDown("Jump")) {
		game = new Array();
		startGame();
	}
	var hit : RaycastHit;
	if(Physics.Raycast(MainGame.Instance().currentCamera.ScreenPointToRay(Input.mousePosition), hit, 100) && Input.GetKeyDown(KeyCode.Mouse0) && userInput) {
		if(game.length < currentGame.getSolutionLength()) {
			switch(hit.collider.gameObject.name) {
				case "Down" :
					game.push(0);
					GameObject.Find("Down").renderer.material = pressedMaterial;
					clicked(GameObject.Find("Down"));
					break;
				case "Left" :
					game.push(1);
					GameObject.Find("Left").renderer.material = pressedMaterial;
					clicked(GameObject.Find("Left"));
					break;
				case "Up" :
					game.push(2);
					GameObject.Find("Up").renderer.material = pressedMaterial;
					clicked(GameObject.Find("Up"));
					break;
				case "Right" :
					game.push(3);
					GameObject.Find("Right").renderer.material = pressedMaterial;
					clicked(GameObject.Find("Right"));
					break;
			}
		}
		if(game.length >= currentGame.getSolutionLength() && !currentGame.isCorrectSolution(game)){
			dialogText = "Wrong sequence, press the spacebar to try again!";
		}
		else if(currentGame.isCorrectSolution(game)) {
			rotateWheel();
		}
		
	}
}
function rotateWheel() {
	var startRotation = valveWheel.transform.rotation;
	var endRotation = valveWheel.transform.rotation * Quaternion.Euler(Vector3(0,0,90));
	var rate = 1.0/3.0f;
	var t = 0.0;
	while (t < 1.0) {
		t += Time.deltaTime * rate;
		valveWheel.transform.rotation = Quaternion.Slerp(startRotation, endRotation, t);
		yield;
	}
	percentageText = valveWheel.transform.eulerAngles.y/3.6 + "%";
}

function clicked(gameObject : GameObject) {
	gameObject.renderer.material = pressedMaterial;
	yield WaitForSeconds(0.5);
	gameObject.renderer.material = idleMaterial;
}

function clearLevel() {
	GameObject.Find("Down").renderer.material = idleMaterial;
	GameObject.Find("Left").renderer.material = idleMaterial;
	GameObject.Find("Up").renderer.material = idleMaterial;
	GameObject.Find("Right").renderer.material = idleMaterial;
}