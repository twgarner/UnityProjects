#pragma strict

DontDestroyOnLoad(gameObject);

var myLifetime : int = 0;

function Awake() {
	var allGI = GameObject.FindGameObjectsWithTag("Game Info");
	if(allGI.Length > 1) {
		for(theGI in allGI) {
			if(theGI.GetComponent(GameInfo).myLifetime > myLifetime) {
				Destroy(gameObject);
			}
		}
	}
}

function Start () {
	myLifetime++;
	
}

function Update () {

}