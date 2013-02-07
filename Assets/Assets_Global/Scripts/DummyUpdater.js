#pragma strict

function Start () {

}

function Update () {
    if(Input.GetKeyDown(KeyCode.PageUp)) {
        MainGame.Instance().PowerGeneration += 25;
    }
    else if (Input.GetKeyDown(KeyCode.PageDown)) {
        MainGame.Instance().PowerGeneration -= 25;
    }
    else if(Input.GetKeyDown(KeyCode.Home)) {
        MainGame.Instance().PowerDemand += 25;
    }
    else if (Input.GetKeyDown(KeyCode.End)) {
        MainGame.Instance().PowerDemand -= 25;
    }
    
    if(Input.GetKeyDown(KeyCode.F1)) {
        MainGame.Instance().CurrentLevel =  0;
    }
    else if(Input.GetKeyDown(KeyCode.F2)) {
        MainGame.Instance().CurrentLevel =  1;
    }
    else if(Input.GetKeyDown(KeyCode.F3)) {
        MainGame.Instance().CurrentLevel =  2;
    }
    else if(Input.GetKeyDown(KeyCode.F4)) {
        MainGame.Instance().CurrentLevel =  3;
    }
    else if(Input.GetKeyDown(KeyCode.F5)) {
        MainGame.Instance().CurrentLevel =  4;
    }
    else if(Input.GetKeyDown(KeyCode.F6)) {
        MainGame.Instance().CurrentLevel =  5;
    }
    else if(Input.GetKeyDown(KeyCode.F7)) {
        MainGame.Instance().CurrentLevel =  6;
    }
    else if(Input.GetKeyDown(KeyCode.F8)) {
        MainGame.Instance().CurrentLevel =  7;
    }
    else if(Input.GetKeyDown(KeyCode.F9)) {
        MainGame.Instance().CurrentLevel =  8;
    }
    else if(Input.GetKeyDown(KeyCode.F10)) {
        MainGame.Instance().CurrentLevel =  9;
    }
    else if(Input.GetKeyDown(KeyCode.F11)) {
        MainGame.Instance().CurrentLevel =  10;
    }
}