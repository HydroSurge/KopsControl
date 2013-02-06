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
        MainGame.Instance().Level =  0;
    }
    else if(Input.GetKeyDown(KeyCode.F2)) {
        MainGame.Instance().Level =  1;
    }
    else if(Input.GetKeyDown(KeyCode.F3)) {
        MainGame.Instance().Level =  2;
    }
    else if(Input.GetKeyDown(KeyCode.F4)) {
        MainGame.Instance().Level =  3;
    }
    else if(Input.GetKeyDown(KeyCode.F5)) {
        MainGame.Instance().Level =  4;
    }
    else if(Input.GetKeyDown(KeyCode.F6)) {
        MainGame.Instance().Level =  5;
    }
    else if(Input.GetKeyDown(KeyCode.F7)) {
        MainGame.Instance().Level =  6;
    }
    else if(Input.GetKeyDown(KeyCode.F8)) {
        MainGame.Instance().Level =  7;
    }
    else if(Input.GetKeyDown(KeyCode.F9)) {
        MainGame.Instance().Level =  8;
    }
    else if(Input.GetKeyDown(KeyCode.F10)) {
        MainGame.Instance().Level =  9;
    }
    else if(Input.GetKeyDown(KeyCode.F11)) {
        MainGame.Instance().Level =  10;
    }
}