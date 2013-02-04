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
}