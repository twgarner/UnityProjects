#pragma strict

var myStyle : GUIStyle;
var mySkin : GUISkin;

private var myString : String = "Controls - Arrow keys to fly the ship. 'Esc' to pause game. \n"  + "\n" +
									"- Land on the white pads in the level to activate the pad. You must activate each pad to advance! \n" + "\n"+
									"- Don't land too hard or you will explode! \n" + "\n" +
									"- The arrow at the beginning of each level will show you where your ship is located. \n" + "\n" +
									"- Manage your fuel meter(top left) and your time remaining (top right) carefully. Don't let them run out! \n" + "\n" +
									"- Feel free to rate, comment, make suggestions, or report any errors or bugs. \n" +"\n" +
									"- Most mportantly: HAVE FUN!";

function OnGUI() {
	GUI.skin = mySkin;
	if(GUI.Button(Rect(80,80,150,30),"To Main Menu")){
		Application.LoadLevel(0);
	}
	GUI.Box(new Rect((Screen.width/2) - 250,(Screen.height/2)-125,500,325),"Help");
	GUI.Label(Rect((Screen.width / 2)-240, (Screen.height / 2)- 80, 480, 220), myString, myStyle);
}