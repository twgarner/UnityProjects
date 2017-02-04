#pragma strict

var stationLight : Light[];
var padGlass : GameObject;
var onMaterial : Material;
var onColor : Color;

var isActivated : boolean = false;

var GUI : InGameGUI;

function Start () {
	GUI = GameObject.FindGameObjectWithTag("GUI").GetComponent("InGameGUI");
}

function Update () {

}

function Activate() {
	
	if(!isActivated) {
		Debug.Log(gameObject.name + " has been activated!");
		isActivated = true;
		audio.Play();
		padGlass.renderer.material = onMaterial;
		stationLight[0].color = onColor;
		stationLight[1].color = onColor;
		
		GUI.LZActivated();
	}
	
}