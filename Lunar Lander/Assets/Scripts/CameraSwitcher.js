#pragma strict

var mainCamera : GameObject;
var smoothFollow : SmoothFollow;
var smoothLookAt : SmoothLookAt;

function Start () {

	smoothFollow = mainCamera.GetComponent("SmoothFollow");
	smoothLookAt = mainCamera.GetComponent("SmoothLookAt");
	
	smoothFollow.enabled = false;
	smoothLookAt.enabled = false;
	
	Time.timeScale = 0;
	
}

function Update () {
	if(Input.GetKeyDown("space")) {
		Time.timeScale = 1;
		smoothFollow.enabled = true;
		smoothLookAt.enabled = true;
	}
}