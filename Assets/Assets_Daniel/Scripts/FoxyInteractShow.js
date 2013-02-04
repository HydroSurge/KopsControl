#pragma strict

function Start () {

}

function Update () {
    
}

function OnTriggerEnter(other:Collider) {
    if(other.gameObject.tag == "Player") 
    {
        Debug.Log("Player Enter!");
        renderer.enabled = true;
    }
}

function OnTriggerExit(other:Collider) {
    if(other.gameObject.tag == "Player") 
        renderer.enabled = false;
}