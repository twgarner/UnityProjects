#pragma strict

var endPos : Vector3;

var myGUI : GUISkin;
var smoothFollow : SmoothFollow;
var smoothLookAt : SmoothLookAt;
var myCamera : Camera;
var inGameGUI : InGameGUI;
var ship : PlayerController;
var change : boolean = false;

var arrow : GameObject;

var timer : GUIText;
var minutes : int;
var seconds : int;

private var timeText : String;
private var initialTime : float;
private var restSeconds : int;
private var privateMin : int;
private var privateSec : int;

function Awake() {
	initialTime = Time.time;
}

function Start() {
	myCamera = GameObject.FindGameObjectWithTag("MainCamera").GetComponent("Camera");
	smoothFollow = myCamera.GetComponent("SmoothFollow");
	smoothLookAt = myCamera.GetComponent("SmoothLookAt");
	inGameGUI = GameObject.FindGameObjectWithTag("GUI").GetComponent("InGameGUI");
	ship = GameObject.FindGameObjectWithTag("Player").GetComponent("PlayerController");
	timer = GameObject.FindGameObjectWithTag("SP Timer").GetComponent("GUIText");
	endPos = GameObject.FindGameObjectWithTag("Player").transform.position;
	arrow = GameObject.FindGameObjectWithTag("Arrow");
	ShowPads();
}

function Update() {

}

function OnGUI() {
	GUI.skin = myGUI;
	if(change == false){
		GUI.Label(new Rect((Screen.width/2) - 150, (Screen.height/2) - 25, 300, 50), "Plan Your Route!");
	}
	else if(change == true){
		CountdownTimer();
	}
}

function CountdownTimer() {
	var guiTime : float;
	guiTime = Time.time - initialTime;
	restSeconds = seconds - guiTime;
	privateSec = (restSeconds%60);
	privateMin = (restSeconds/60);
	
	if(privateSec >= 0)
		timer.text = privateSec.ToString();
	if(privateSec <= 0)
		timer.enabled = false;
}

function ShowPads() {
	
	inGameGUI.enabled = false;
	smoothFollow.enabled = false;
	smoothLookAt.enabled = false;
	ship.enabled = false;	
	
	yield(WaitForSeconds(5));

	myCamera.transform.position.x = endPos.x;
	myCamera.transform.position.y = endPos.y;
	myCamera.transform.position.z = endPos.z - 15;
	
	change = true;
	Destroy(arrow);
	yield(WaitForSeconds(3));
	smoothFollow.enabled = true;
	smoothLookAt.enabled = true;
	inGameGUI.seconds += 9;
	inGameGUI.enabled = true;
	ship.enabled = true;
	
}
