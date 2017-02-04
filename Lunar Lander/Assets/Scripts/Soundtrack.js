#pragma strict

DontDestroyOnLoad(gameObject);

var myLifetime : int = 0;
var tracks : AudioClip[];
var currentTrack : int;

function Awake() {
	var allDJ = GameObject.FindGameObjectsWithTag("Soundtrack");
	if(allDJ.Length > 1) {
		for(theDJ in allDJ) {
			if(theDJ.GetComponent(Soundtrack).myLifetime > myLifetime) {
				Destroy(gameObject);
			}
		}
	}
}

function Start () {
	myLifetime++;
	
	audio.clip = tracks[0];
	audio.Play();
}

function Update () {
	if(!audio.isPlaying) {
		if(currentTrack == (tracks.Length - 1)) {
			audio.clip = tracks[0];
			currentTrack = 0;
			audio.Play();
		}
		else {
			currentTrack++;
			audio.clip = tracks[currentTrack];
			audio.Play();
		}
	}
	gameObject.transform.position = GameObject.FindGameObjectWithTag("MainCamera").transform.position;
}