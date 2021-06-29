var OFFSET = 1;
var MAX_COORD = 2;

class ObjectPosition {
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    // update coords
    increase_x(){
        if(this.x + OFFSET > MAX_COORD) this.x = MAX_COORD
        else this.x += OFFSET
    }

    decrease_x(){
        if(this.x - OFFSET < -MAX_COORD) this.x = -MAX_COORD
        else this.x -= OFFSET
    }

    increase_y(){
        if(this.y + OFFSET > MAX_COORD) this.y = MAX_COORD
        else this.y += OFFSET
    }

    decrease_y(){
        if(this.y - OFFSET < -MAX_COORD) this.y = -MAX_COORD
        else this.y -= OFFSET
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




let objectPosition = new ObjectPosition(0,0);

let keyboardController = new KeyboardController();

