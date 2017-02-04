#pragma strict

var mySkin : GUISkin;

private var myString : String = "Player Ship - Gabriel Williams (CG Cookie).\n" + "\n" +
									"Background Music - Wake, Steppin (Free Music Archive).\n" + "\n" +
										"Made with Unity Free";

function OnGUI() {
	GUI.skin = mySkin;
	if(GUI.Button(Rect(80,80,150,30),"To Main Menu")){
		Application.LoadLevel(0);
	}
	GUI.Box(new Rect((Screen.width/2) - 250,(Screen.height/2)-125,500,250),"Credits");
	GUI.Label(Rect((Screen.width / 2)-200, (Screen.height / 2)-50, 400, 200), myString);
}