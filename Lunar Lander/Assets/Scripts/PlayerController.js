#pragma strict

var bottomThruster : ParticleEmitter;
var topThruster : ParticleEmitter;
var leftThruster : ParticleEmitter;
var rightThruster : ParticleEmitter;
var fuelBurnSpeed : float;
var hasFuel : boolean;
var fuelRem : float;
var exploded : int = 0;
var shipExplosions : GameObject[];
var GUI : InGameGUI;

function Start () {
	GUI = GameObject.FindGameObjectWithTag("GUI").GetComponent("InGameGUI");
}

function Update () {
	if(hasFuel){
		//moves player to the right
		if(Input.GetAxis("Horizontal") > 0) {
			rightThruster.emit = false;
			leftThruster.emit = true;
			rigidbody.AddForce(10,0,0);
		}
		
		//moves player to the left
		if(Input.GetAxis("Horizontal") < 0) {
			leftThruster.emit = false;
			rightThruster.emit = true;
			rigidbody.AddForce(-10,0,0);
		}
		
		//horizontal keys not pressed
		if(Input.GetAxis("Horizontal") == 0) {
			leftThruster.emit = false;
			rightThruster.emit = false;
		}
		
		//moves player up
		if(Input.GetAxis("Vertical") > 0) {
			topThruster.emit = false;
			bottomThruster.emit = true;
			rigidbody.AddForce(0,10,0);
		}
		
		//moves player down
		if(Input.GetAxis("Vertical") < 0) {
			bottomThruster.emit = false;
			topThruster.emit = true;
			rigidbody.AddForce(0,-10,0);
		}
		
		//vertical keys not pressed
		if(Input.GetAxis("Vertical") == 0) {
			bottomThruster.emit = false;
			topThruster.emit = false;
		}
		
		if(Input.GetAxis("Vertical")!= 0 || Input.GetAxis("Horizontal")!= 0) {
			if(!audio.isPlaying) {
				audio.Play();
			}
			//check if fuel is being used, if so, burn some fuel per second
			fuelRem -= (fuelBurnSpeed * Time.deltaTime);
			if(fuelRem <= 0){
				fuelRem = 0;
				hasFuel = false;
				audio.Stop();
				bottomThruster.emit = false;
				topThruster.emit = false;
				leftThruster.emit = false;
				rightThruster.emit = false;
			}
			
			GUI.UpdateFuelMeter(fuelRem);
			
		}
		else if(audio.isPlaying) {
			audio.Stop();
		}
	}
}

function OnCollisionEnter(hitInfo : Collision){

	if(hitInfo.relativeVelocity.magnitude > 1.45){
		Explode();	
	}
	else if(hitInfo.gameObject.tag == "Landing Pad"){
		
		var landingPad : LandingPad;
		landingPad = hitInfo.gameObject.GetComponent("LandingPad");
		landingPad.Activate();
	}

}

function Explode() {
	exploded++;
	var randomNumber : int;
	randomNumber = Random.Range(0, shipExplosions.length);
	
	Instantiate(shipExplosions[randomNumber], transform.position, transform.rotation);
	Application.ExternalCall("kongregate.stats.submit","Exploded",exploded);

	GUI.LoseCaller();
	Destroy(gameObject);

}