var DELTA_MOVEMENT = 1;
var MAX_COORD = 10;

import {Configuration} from "./Configuration.js";
import {EventHandler} from "./../content/Snake.js";

class ReferenceSystem{
    
    constructor(max_x, max_y, max_z){
        this.max_x = max_x;
        this.max_y = max_y;
        this.max_z = max_z;
        this.max_f = 6;

        // matrix position
        // 0 = left - 1 = right - 2 = up - 3 = down
        // | 0 |   [4, 1, 2, 3]
        // | 1 |   [0, 5, 2, 3]
        // | 2 |   [4, 1, 5, 0]
        // | 3 |   [4, 1, 5, 0]
        // | 4 |   [5, 0, 2, 3]
        // | 5 |   [1, 4, 2, 3]

        var matrix_reference = [];
        matrix_reference.push([4, 1, 2, 3]); 
        matrix_reference.push([0, 5, 2, 3]); 
        matrix_reference.push([4, 1, 5, 0]); 
        matrix_reference.push([1, 4, 5, 0]); 
        matrix_reference.push([5, 0, 2, 3]); 
        matrix_reference.push([1, 4, 2, 3]); 
        
        this.mrs = matrix_reference;

    }
}

class ObjectPosition {
    
    constructor(x, y, z, f, rs){
        this.x = x; 
        this.y = y;
        this.z = z;
        this.f = f;

        this.rs = rs; // reference system

    }

    check_consistency(){

        // face index
        // sx = 0
        // dx = 1
        // up = 2
        // down = 3
        var face = this.f;


        if(this.x > this.rs.max_x){
          // from this face to right face 
          this.x = 0;
          this.f = this.rs.mrs[face][1];
          
        } else if (this.x < 0){
          // from this face to left face
          this.x = this.rs.max_x;
          this.f = this.rs.mrs[face][0];
        }

        if(this.y > this.rs.max_y){
          // from this face to down face  
          this.y = 0;
          this.f = this.rs.mrs[face][3];


        } else if (this.y < 0){
          // from this face to up face
          this.y = this.rs.max_y;
          this.f = this.rs.mrs[face][2];
        }

        if(this.z > this.rs.max_z) this.z = this.rs.max_z;
        else if(this.z < 0) this.z = 0;
    }


    decrease(x, y, z){
        this.x -= x;
        this.y -= y;
        this.z -= z;

        this.check_consistency();
    }

    increase(x, y, z){
        this.x += x;
        this.y += y;
        this.z += z;

        this.check_consistency();

    }

    
}

export class Controller{

    constructor(object){
        this.object = object
    }


    left(){
        this.object.goLeft();
        // EventHandler.startNextEvent();
    }

    right(){
        this.object.goRight();
        // EventHandler.startNextEvent();
    }

    up(){
        this.object.goUp();
        // EventHandler.startNextEvent();
    }

    down(){
        this.object.goDown();
        // EventHandler.startNextEvent();
    }

}


class Controller2D extends Controller{

    constructor(object){
        super(object);
    }

    left(){
        super.left();
    }

    right(){
        super.right();
    }

    up(){
        super.up();
    }

    down(){
        super.down();
    }
}



class Controller3D extends Controller{

    constructor(object){
        super(object);
    }

    left(){
        super.left();
    }

    right(){
        super.right();
    }

    up(){
        super.up();
    }

    down(){
        super.down();
    }
}


export class KeyboardHandler {
    
    constructor(controller){

        this.controller = controller;

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
                console.log("Right: ", rightPressed);

                controller.right();
            
                // objectPosition.increase(DELTA_MOVEMENT, 0, 0);
                // console.log("face: " + objectPosition.f + " x: " + objectPosition.x + " y: " + objectPosition.y, "z: " + objectPosition.z);
            }
            else if(event.keyCode == KeyboardHelper.left) {
                leftPressed = true;
                console.log("Left: ", leftPressed);

                controller.left();
                
                // objectPosition.decrease(DELTA_MOVEMENT, 0, 0);
                // console.log("face: " + objectPosition.f + " x: " + objectPosition.x + " y: " + objectPosition.y, "z: " + objectPosition.z);
            }
            if(event.keyCode == KeyboardHelper.down) {
                downPressed = true;
                console.log("Down: ", downPressed);

                controller.down();
                // objectPosition.decrease(0, DELTA_MOVEMENT, 0);
                // console.log("face: " + objectPosition.f + " x: " + objectPosition.x + " y: " + objectPosition.y, "z: " + objectPosition.z);
            }
            else if(event.keyCode == KeyboardHelper.up) {
                upPressed = true;
                console.log("Up: ", upPressed);

                controller.up();
                // objectPosition.increase(0, DELTA_MOVEMENT, 0);
                // console.log("face: " + objectPosition.f + " x: " + objectPosition.x + " y: " + objectPosition.y, "z: " + objectPosition.z);
            }
            else if(event.keyCode == KeyboardHelper.space){
                spacePressed = true;
                console.log("Space: ", spacePressed);

                // objectPosition.increase(0, 0, DELTA_MOVEMENT);
                // console.log("face: " + objectPosition.f + " x: " + objectPosition.x + " y: " + objectPosition.y, "z: " + objectPosition.z);
            }
        }

        function keyUpHandler(event) {

            if(event.keyCode == KeyboardHelper.right) {
                rightPressed = false;
                console.log("Right: ", rightPressed);
            }
            else if(event.keyCode == KeyboardHelper.left) {
                leftPressed = false;
                console.log("Left: ", leftPressed);
            }
            if(event.keyCode == KeyboardHelper.down) {
                downPressed = false;
                console.log("Down: ", downPressed);
            }
            else if(event.keyCode == KeyboardHelper.up) {
                upPressed = false;
                console.log("Up: ", upPressed);
            }

            else if(event.keyCode == KeyboardHelper.space) {
                spacePressed = false;
                console.log("Space: ", spacePressed);
                // objectPosition.decrease(0, 0, DELTA_MOVEMENT);

            }
        }
    }


}

// let reference = new ReferenceSystem(10, 10, 2);


// let objectPosition = new ObjectPosition(0, 0, 0, 0, reference);

// let keyboardController = new KeyboardHandler();

