#pragma strict

DontDestroyOnLoad(gameObject);

var KONGREGATE_LOADED : boolean = false;
var USER_ID : int = 0;
var USER_NAME : String = "Guest";
var GAME_AUTH_TOKEN : String = "";


function Start () {
	Application.ExternalEval("if(typeof(kongregateUnitySupport) != 'undefined'){" +
  		" kongregateUnitySupport.initAPI('API', 'OnKongregateAPILoaded');" +
  		"};");
}

function OnKongregateAPILoaded(userInfo : String) : void {
	KONGREGATE_LOADED = true;
	var userStats = userInfo.Split("|"[0]);
	USER_ID = int.Parse(userStats[0]);
	USER_NAME = userStats[1];
	GAME_AUTH_TOKEN = userStats[2];
}