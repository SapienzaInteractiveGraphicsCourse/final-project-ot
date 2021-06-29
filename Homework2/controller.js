var DELTA_MOVEMENT = 1;
var MAX_COORD = 10;

class ObjectPosition {
    
    constructor(x, y, max) {
        if (x > max) this.x = max;
        else this.x = x;
        if (y > max) this.y = max;
        else this.y = y;
        
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

}


class KeyboardController {
    
    constructor(){

        document.addEventListener('keydown', keyDownHandler, false);
        document.addEventListener('keyup', keyUpHandler, false);

        var rightPressed = false;
        var leftPressed = false;
        var upPressed = false;
        var downPressed = false;


        var KeyboardHelper = { left: 37, up: 38, right: 39, down: 40 };


        function keyDownHandler(event) {

            if(event.keyCode == KeyboardHelper.right) {
                rightPressed = true;
                objectPosition.increase_x();
                console.log("x: " + objectPosition.x + " y: " + objectPosition.y);
            }
            else if(event.keyCode == KeyboardHelper.left) {
                leftPressed = true;
                objectPosition.decrease_x();
                console.log("x: " + objectPosition.x + " y: " + objectPosition.y);
            }
            if(event.keyCode == KeyboardHelper.down) {
                downPressed = true;
                objectPosition.decrease_y();
                console.log("x: " + objectPosition.x + " y: " + objectPosition.y);
            }
            else if(event.keyCode == KeyboardHelper.up) {
                upPressed = true;
                objectPosition.increase_y();
                console.log("x: " + objectPosition.x + " y: " + objectPosition.y);
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
        }
    }


}




let objectPosition = new ObjectPosition(0,0, MAX_COORD);

let keyboardController = new KeyboardController();

