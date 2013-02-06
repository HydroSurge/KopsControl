#pragma strict


function Update (){

if (Input.GetKey(KeyCode.A)) {
    transform.Rotate(Vector3.down, 80 * Time.deltaTime);
    }
if(Input.GetKey(KeyCode.D)){
    transform.Rotate(Vector3.up, 80 * Time.deltaTime);
    }
  }
    
