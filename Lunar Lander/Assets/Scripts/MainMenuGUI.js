#pragma strict

var myGUI : GUISkin;

function OnGUI() {
	
	GUI.skin = myGUI;
	
	GUI.Box(new Rect((Screen.width/2) - 120,(Screen.height/2)-130,240,200),"Main Menu");
	
	if(GUI.Button(Rect((Screen.width/2) - 75,(Screen.height/2) - 60,150,30),"New Game")){
		PlayerPrefs.DeleteAll();
		Application.LoadLevel(1);
		PlayerPrefs.SetInt("Player Level", 1);
		PlayerPrefs.SetInt("Player Score", 0);
	}
	if(PlayerPrefs.HasKey("Player Level")) {
		if(GUI.Button(Rect((Screen.width/2) - 75,(Screen.height/2) - 30,150,30),"Continue Game")){
			//Gets player level and loads into that level
			Application.LoadLevel(PlayerPrefs.GetInt("Player Level"));
		}
	}
	if(GUI.Button(Rect((Screen.width/2) - 75,(Screen.height/2) + 30,150,30),"Credits")){
		Application.LoadLevel("Credits");
	}
	if(GUI.Button(Rect((Screen.width/2) - 75,(Screen.height/2),150,30),"Help")){
		Application.LoadLevel("Help");
	}

}