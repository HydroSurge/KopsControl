#pragma strict

var moveLeft = false;
var moveRight = false;
var precent=30;
var angle:float=0; 
var KeyPlay=false;
var gameRoot:Transform;

var count=0;

function RestartStart () {
    moveRight = false;
    precent=30;
    angle=0; 
    KeyPlay=false;
    count=0;
}


function Update () {
    if(MainGame.Instance().State != GameStates.FinalMiniGame1) return;
 
 		if(Input.GetKeyDown(KeyCode.S)){
 		
		 		if(KeyPlay){
		 		 KeyPlay=false; 
		 		}
		 		else{
		 		 KeyPlay=true; 
		 		}
 		
 		} 
 		if(KeyPlay){
		 		if(Input.GetKey(KeyCode.A)){
		 		
		 			transform.position.x+=0.7; 
		 		
		 		}
		 		if(Input.GetKey(KeyCode.D)){
		 		
		 		 transform.position.x-=0.7;
		 		
		 		}  
		 		if( transform.position.x<-25){
		 		 transform.position.x=-25;}
		 		 else if ( transform.position.x>25){
		 		  transform.position.x=25;}
 		}
 		if(KeyPlay==false){
				var pos  = Vector2(Input.mousePosition.x, Input.mousePosition.y);
				if(pos.x>(Screen.width/2) ) { 
				 pos.x-=(Screen.width/2);
				 pos.x=pos.x/-27; 
				}
				else{
				 pos.x-=(Screen.width/2);
				 pos.x=pos.x/-27; 
				}
				transform.position.x=gameRoot.position.x + pos.x; 
		} 
		transform.RotateAround(Vector3(1,0,0),angle);
		angle-=0.001;
		if(angle<0){
		angle=0;} 
		else if(angle>0.5){
		  angle=0.5;
		}    
		
		
		if( WaterMiniGame.start==true){  
				if(WaterMiniGame.GameOver==false){ 
					if(WaterMiniGame.GameWin==false){
							if(count>50){
								precent -=2;
								count=0; 
								if(angle<0.25){
								 precent-=2;
								}
							}
							count++;  
							if(precent<=0){
							 WaterMiniGame.GameOver=true; 
							precent = 0;
							}  
							else if(precent>=100){
							 precent=100; 
							 WaterMiniGame.GameWin=true;
							} 
					}
			}
		} 
		if(precent<0){
		
		 precent=0;
		} 
		else if(precent>100){
		
		 precent=100; 
		}
}
function OnTriggerEnter(collision : Collider) {
    if(collision.gameObject.tag == WaterDrop.WATERDROP_TAG) {
        precent+=3;
        angle+=0.05;
        Destroy(collision.gameObject);
    }
}

function OnGUI(){
    if(MainGame.Instance().State != GameStates.FinalMiniGame1) return;

			if(GUI.Button (Rect(10,10,110,70), precent+"%"))
			{
			} 
			if(GUI.Button (Rect(130,10,210,70), "press S to switch controls"))
			{
			} 
			if(KeyPlay){
			
					if(GUI.Button (Rect(10,90,210,70), "use A and D to move"))
					{
			} 
			
			}
}