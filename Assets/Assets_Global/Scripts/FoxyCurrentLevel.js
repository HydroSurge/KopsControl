#pragma strict

var startColor:Color = Color(0.9,0,0,1);
var endColor:Color = Color(0.9,0.4,0.4,1);
var duration = 0.5;

function Start () {

}

function Update () {
    var lerp : float = Mathf.PingPong (Time.time, duration) / duration;
    renderer.material.color = Color.Lerp(startColor, endColor, lerp);
}