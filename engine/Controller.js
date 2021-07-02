var DELTA_MOVEMENT = 1;
var MAX_COORD = 10;

import {Configuration} from "./Configuration.js";

class ObjectPosition {
    
    constructor(x, y, z, max) {
        if (x > max) this.x = max;
        else this.x = x;
        if (y > max) this.y = max;
        else this.y = y;
        if (z > 1) this.z = 1;
        else this.z = z;
        
        this.max = max;
    }

    // update coords
    increase_x(){
        if(this.x + DELTA_MOVEMENT > this.max) this.x = this.max;
        else this.x += DELTA_MOVEMENT;
    }

    decrease_x(){
        if(this.x - DELTA_MOVEMENT < 0) this.x = 0;
        else this.x -= DELTA_MOVEMENT;
    }

    increase_y(){
        if(this.y + DELTA_MOVEMENT > this.max) this.y = this.max;
        else this.y += DELTA_MOVEMENT;
    }

    decrease_y(){
        if(this.y - DELTA_MOVEMENT < 0) this.y = 0;
        else this.y -= DELTA_MOVEMENT;
    }


    increase_z(){
        if(this.z + DELTA_MOVEMENT > 1) this.z = 1;
        else this.z += DELTA_MOVEMENT;
    }

    decrease_z(){
        if(this.z - DELTA_MOVEMENT < 0) this.z = 0;
        else this.z -= DELTA_MOVEMENT;
    }

}


class KeyboardController {
    
    constructor(){

        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('keyup', keyUpHandler, false);

        var rightPressed = false;
        var leftPressed = false;
        var upPressed = false;
        var downPressed = false;
        var spacePressed = false;


        var KeyboardHelper = { left: 37, up: 38, right: 39, down: 40, space: 32};


        function keyDownHandler(event) {

            if(event.keyCode == KeyboardHelper.right) {
                rightPressed = true;
                objectPosition.increase_x();
                console.log("x: " + objectPosition.x + " y: " + objectPosition.y, "z: " + objectPosition.z);
            }
            else if(event.keyCode == KeyboardHelper.left) {
                leftPressed = true;
                objectPosition.decrease_x();
                console.log("x: " + objectPosition.x + " y: " + objectPosition.y, "z: " + objectPosition.z);
            }
            if(event.keyCode == KeyboardHelper.down) {
                downPressed = true;
                objectPosition.decrease_y();
                console.log("x: " + objectPosition.x + " y: " + objectPosition.y, "z: " + objectPosition.z);
            }
            else if(event.keyCode == KeyboardHelper.up) {
                upPressed = true;
                objectPosition.increase_y();
                console.log("x: " + objectPosition.x + " y: " + objectPosition.y, "z: " + objectPosition.z);
            }
            else if(event.keyCode == KeyboardHelper.space){
                spacePressed = true;
                objectPosition.increase_z();
                console.log("x: " + objectPosition.x + " y: " + objectPosition.y, "z: " + objectPosition.z);
            }
        }

        function keyUpHandler(event) {

            if(event.keyCode == KeyboardHelper.right) {
                rightPressed = false;
                console.log(rightPressed);
            }
            else if(event.keyCode == KeyboardHelper.left) {
                leftPressed = false;
                console.log(leftPressed);
            }
            if(event.keyCode == KeyboardHelper.down) {
                downPressed = false;
                console.log(downPressed);
            }
            else if(event.keyCode == KeyboardHelper.up) {
                upPressed = false;
                console.log(upPressed);
            }

            else if(event.keyCode == KeyboardHelper.space) {
                upPressed = false;
                objectPosition.decrease_z();
                console.log(upPressed);
            }
        }
    }


}



let objectPosition = new ObjectPosition(0, 0, 0, MAX_COORD);

let keyboardController = new KeyboardController();

