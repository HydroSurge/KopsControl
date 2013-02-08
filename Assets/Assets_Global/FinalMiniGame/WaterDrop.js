#pragma strict

static var WATERDROP_TAG = "Final_WaterDrop";
static var WATERDROP_DESTROY_TAG = "Final_WaterDropDestroy";
static var WATERDROP_TURBINE_DESTROY_TAG = "Final_Turbine";

function Start () {

}

function Update () {

}
function OnTriggerEnter(collision : Collision) {
    for (var contact : ContactPoint in collision.contacts) {
	    if(collision.gameObject != null && 
        (
        collision.gameObject.tag == WATERDROP_DESTROY_TAG ||
        collision.gameObject.tag == WATERDROP_TURBINE_DESTROY_TAG 
        )
        ){  
            Debug.Log("DESTROY: " + collision.gameObject.tag);
	        Destroy(gameObject);
            break;
	    }
    }
}