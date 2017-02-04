#pragma strict

var api : KongregateAPI;
var ship : GameObject;
var speedText : GUIText;
var myRigid : Rigidbody;

var guiMode : String;
var numActivated : int;
var totalPads : int;

var winClip : AudioClip;
var loseClip : AudioClip;
var scoreText : GUIText;
var fuelMeter : GUITexture;
var fuelMeterStartWidth : float;
var victoryText : GUIText;
var levelText : GUIText;

var timer : GUIText;
var minutes : int;
var seconds : int;
var score : int;

var curLvl : int;
var totalLvls : int;

var myGUI : GUISkin;
var showPads : GameObject;
var spFunct : ShowAllPads;

private var timeText : String;
private var initialTime : float;
private var restSeconds : int;
private var privateMin : int;
private var privateSec : int;


function Awake() {
	api = GameObject.FindGameObjectWithTag("API").GetComponent("KongregateAPI");
	initialTime = Time.time;
	seconds += (minutes*60);
	Instantiate(showPads);
	spFunct = GameObject.FindGameObjectWithTag("ShowPads").GetComponent("ShowAllPads");
}

function Start () {
	levelText.text = "Level " + Application.loadedLevel;
	fuelMeterStartWidth = fuelMeter.pixelInset.width;
	if(Application.loadedLevel == 1){
		PlayerPrefs.SetInt("Player Score", 0);
		score = 0;
	}
	else {
		score = PlayerPrefs.GetInt("Player Score");
	}
	scoreText.text = ("Pads Left: " + (totalPads - numActivated));
	
	curLvl = Application.loadedLevel;
	if(score < 0){
		score = 0;
	}
	myRigid = ship.rigidbody;
}

function Update () {
	if(Input.GetKeyDown("escape")){
		Time.timeScale = 0;
		guiMode = "Paused";
	}
}

function OnGUI() {

	GUI.skin = myGUI;

	CountdownTimer();

	if(ship != null){
		speedText.text = "Speed: " + Mathf.Round(myRigid.velocity.magnitude * 100f)/100f;
	}
	else {
		speedText.text = "Speed: 0";
	}
	if(guiMode == "Paused"){
		GUI.Box(new Rect((Screen.width/2) - 120,(Screen.height/2)-60,240,120),"Paused");
		if(GUI.Button(Rect((Screen.width/2) - 75,(Screen.height/2) - 15,150,30),"Resume Game")){
			Time.timeScale = 1;
			guiMode = "InGame";
		}
		if(GUI.Button(Rect((Screen.width/2) - 75,(Screen.height/2) + 15,150,30),"Quit Game")){
			Time.timeScale = 1;
			Application.LoadLevel(0);
		}
	}
	
	if(guiMode == "Win"){
		GUI.Box(new Rect((Screen.width/2) - 120,(Screen.height/2)-60,240,120),"Passed!");
		if(GUI.Button(Rect((Screen.width/2) - 75,(Screen.height/2) - 15,150,30),"Next Level")){
			Time.timeScale = 1;
			guiMode = "InGame";
			Application.LoadLevel(Application.loadedLevel + 1);
		}
		if(GUI.Button(Rect((Screen.width/2) - 75,(Screen.height/2) + 15,150,30),"Quit Game")){
			Time.timeScale = 1;
			Application.LoadLevel(0);
		}
	}
	
	if(guiMode == "Lose"){
		GUI.Box(new Rect((Screen.width/2) - 120,(Screen.height/2)-60,240,120),"Try Again!");
		if(GUI.Button(Rect((Screen.width/2) - 75,(Screen.height/2) - 15,150,30),"Retry Level")){
			Time.timeScale = 1;
			guiMode = "InGame";
			Application.LoadLevel(Application.loadedLevel);
			spFunct.ShowPads();
		}
		if(GUI.Button(Rect((Screen.width/2) - 75,(Screen.height/2) + 15,150,30),"Quit Game")){
			Time.timeScale = 1;
			Application.LoadLevel(0);
		}
	}
	
	if(guiMode == "Beat"){
		victoryText.enabled = true;
		GUI.Box(new Rect((Screen.width/2) - 120,(Screen.height/2)-60,240,120),"You Win!");
		if(GUI.Button(Rect((Screen.width/2) - 75,(Screen.height/2) + 15,150,30),"Quit Game")){
			Time.timeScale = 1;
			Application.LoadLevel(0);
		}
	}
}

function CountdownTimer() {
	var guiTime : float;
	guiTime = Time.time - initialTime;
	restSeconds = seconds - guiTime;
	privateSec = (restSeconds%60);
	privateMin = (restSeconds/60);
	
	if(privateSec <= 9) {
		timeText = String.Format("{0}:{0}{1}", privateMin, privateSec);
	}
	
	else if(privateSec >= 10) {
		timeText = String.Format("{0}:{1}", privateMin, privateSec);
	}
	
	timer.text = timeText;
	
	if(privateSec <= 0 && privateMin <= 0) {
		Time.timeScale = 0;
		guiMode = "Lose";
	}
	
}

function UpdateFuelMeter(newFuelAmt : float) {
	fuelMeter.pixelInset.width = (fuelMeterStartWidth * (newFuelAmt * .01));
	fuelMeter.color = Color.Lerp(Color.red, Color.green, (newFuelAmt * .01));
}

function LZActivated() {
	numActivated++;
	if(numActivated == totalPads){
		WinLevel();
	}
	
	scoreText.text = ("Pads Left: " + (totalPads - numActivated));
	var pc : PlayerController;
	pc = GameObject.FindGameObjectWithTag("Player").GetComponent("PlayerController");
	pc.fuelRem += 50;
	score += 50;
	PlayerPrefs.SetInt("Player Score", score);
	PlayerPrefs.Save();
	Application.ExternalCall("kongregate.stats.submit","HighScore",score);

}

function WinLevel() {
	score += (15 * Application.loadedLevel);
	yield(WaitForSeconds(1));
	audio.clip = winClip;
	audio.Play();
	
	Time.timeScale = 0;
	
	PlayerPrefs.SetInt("Player Level", Application.loadedLevel+1);
	PlayerPrefs.SetInt("Player Score", score);
	PlayerPrefs.Save();
	
	guiMode = "Win";
	if(curLvl == totalLvls){
		guiMode = "Beat";
	}
}

function LoseLevel() {
	score -= 30;
	yield(WaitForSeconds(3));
	
	audio.clip = loseClip;
	audio.Play();
	
	Time.timeScale = 0;
	
	PlayerPrefs.SetInt("Player Score", score);
	PlayerPrefs.Save();
	
	guiMode = "Lose";
	Application.ExternalCall("kongregate.stats.submit","HighScore",score);
	
}

function LoseCaller() {
	LoseLevel();
}