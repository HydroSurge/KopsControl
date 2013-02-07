#pragma strict
@script RequireComponent(AudioSource)
var walkSound:AudioSource;
var walkBackSound:AudioSource;
var ambientSound:AudioSource;

function Start () {
walkSound.loop = true;
walkSound.Stop();
walkSound.volume = 0.3;
walkSound.playOnAwake = false;
walkBackSound.loop = true;
walkBackSound.Stop();
walkBackSound.playOnAwake = false;
walkBackSound.volume = 0.2;
ambientSound.loop = true;
ambientSound.playOnAwake = true;
}



function Update () {
	if(Input.GetAxis("Vertical") > 0 && !walkSound.isPlaying)
	{
	walkSound.Play();
	}
	else if (Input.GetAxis("Vertical") <= 0 && walkSound.isPlaying)
	{
	walkSound.Stop();
	}
	
	if(Input.GetAxis("Vertical") < 0 && !walkBackSound.isPlaying)
	{
	walkBackSound.Play();
	}
	else if (Input.GetAxis("Vertical") >= 0 && walkBackSound.isPlaying)
	{
	walkBackSound.Stop();
	}
}