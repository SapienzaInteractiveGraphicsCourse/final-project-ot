import {equal, mult, subtract, vec3, rotate, vec4} from "../Common/MVnew.js";


export class Controller{
    static instance = null;
    game;
    snake;

    /*------- SINGLETON Handle ------*/
    static init(game) {
        if (Controller.instance != null) {
            console.log("ERROR: Controller already initialized");
            return null;
        }
        Controller.instance = new Controller(game);
    }

    static get_instance() {
        if (Controller.instance != null)
            return Controller.instance;
        console.log("ERROR: Controller not initialized");
    }

    constructor(game) {
        this.game = game;
        this.snake = game.snake;
        this.#init_keyboard();
    }

    /*----- Movement schedulers -----*/
    up() {
        const pos = [this.snake.x, this.snake.y, this.snake.z];
        const new_pos = [...pos];
        const direction = this.game.up_direction;
        new_pos[direction.axis] += direction.sign;

        this.#schedule_movement(pos,new_pos, direction);
    }

    down() {
        const pos = [this.snake.x, this.snake.y, this.snake.z];
        const new_pos = [...pos];
        const direction = this.game.up_direction;
        direction.sign *= -1;
        new_pos[direction.axis] += direction.sign;

        this.#schedule_movement(pos,new_pos, direction);
    }


    left() {
        const pos = [this.snake.x, this.snake.y, this.snake.z];
        const new_pos = [...pos];
        const direction = this.game.right_direction;
        direction.sign *= -1;
        new_pos[direction.axis] += direction.sign;
        this.#schedule_movement(pos,new_pos, direction);

    }

    right() {
        const pos = [this.snake.x, this.snake.y, this.snake.z];
        const new_pos = [...pos];
        const direction = this.game.right_direction;
        new_pos[direction.axis] += direction.sign;
        this.#schedule_movement(pos,new_pos, direction);
    }


    #schedule_movement(old_pos, new_pos, direction) {
        const done = this.game.move_object_structure(old_pos[0],old_pos[1],old_pos[2],new_pos[0],new_pos[1],new_pos[2]);
        if (done)
            this.snake.add_movement(this.game.world_to_render(new_pos), direction);
        else {
            this.#change_face(old_pos,new_pos);
            //TODO auto-continue
        }


    }


    #change_face(old_pos, new_pos) {
        old_pos = vec4(old_pos);
        new_pos = vec4(new_pos);

        // Calculating the direction axis
        let delta_vector = subtract(new_pos, old_pos);
        delta_vector = vec3(delta_vector[0],delta_vector[1],delta_vector[2]);

        const current_up_direction = this.game.up_direction;
        const current_right_direction = this.game.right_direction;
        let up_vector = vec3();
        let right_vector = vec3();
        let rotation_vector;
        let rotation_angle;

        // Unitary norm vector indicating up and right w.r.t the viewer
        up_vector[current_up_direction.axis] = current_up_direction.sign;
        right_vector[current_right_direction.axis] = current_right_direction.sign;

        // Calculating the rotation axis
        if (equal(delta_vector,right_vector) || equal(mult(-1,delta_vector),right_vector)) {
            rotation_vector = up_vector;
            equal(delta_vector,right_vector) ? rotation_angle = -90 : rotation_angle = 90;
        } else {
            rotation_vector = right_vector;
            equal(delta_vector,up_vector) ? rotation_angle = 90 : rotation_angle = -90;
        }

        // Computing the rotation around the rotation axis
        const rotation_matrix = rotate(rotation_angle,rotation_vector);
        up_vector = mult(rotation_matrix, vec4(up_vector[0], up_vector[1], up_vector[2], 0));
        right_vector = mult(rotation_matrix,vec4(right_vector[0], right_vector[1], right_vector[2], 0));

        this.game.set_up_direction(up_vector);
        this.game.set_right_direction(right_vector);
    }



    /*-------- Movement runner -----*/
    move_snake() {
        const next_movement = this.snake.get_next_movement();
        if (next_movement === null) {
            const pos = [this.snake.x, this.snake.y, this.snake.z];
            const new_pos = [...pos];
            const direction = this.snake.get_current_direction();
            new_pos[direction.axis] += direction.sign;

            this.#schedule_movement(pos,new_pos, direction);
        }
        this.snake.move();
    }


    #init_keyboard() {
        const controller = this;
        document.addEventListener('keydown', keyDownHandler, false);
        //document.addEventListener('keyup', keyUpHandler, false);

        var KeyboardHelper = { left: 65, up: 87, right: 68, down: 83, space: 32};

        function keyDownHandler(event) {

            if(event.keyCode === KeyboardHelper.right) {
                controller.right();

            }
            else if(event.keyCode === KeyboardHelper.left) {
                controller.left();
            }
            if(event.keyCode === KeyboardHelper.down) {
                controller.down();
            }
            else if(event.keyCode === KeyboardHelper.up) {
                controller.up();
            }
            else if(event.keyCode === KeyboardHelper.space){
                controller.move_snake();
            }
        }
    }





}

//TODO REMOVE
// export class KeyboardHandler {
//
//     constructor(controller){
//
//         this.controller = controller;
//         console.log(controller);
//         document.addEventListener('keydown', keyDownHandler, false);
//         //document.addEventListener('keyup', keyUpHandler, false);
//
//         var KeyboardHelper = { left: 37, up: 38, right: 39, down: 40, space: 32};
//
//
//         function keyDownHandler(event) {
//
//             if(event.keyCode === KeyboardHelper.right) {
//                 console.log(this)
//                 this.controller.right()
//
//             }
//             else if(event.keyCode === KeyboardHelper.left) {
//
//             }
//             if(event.keyCode === KeyboardHelper.down) {
//
//             }
//             else if(event.keyCode === KeyboardHelper.up) {
//
//             }
//             else if(event.keyCode === KeyboardHelper.space){
//
//             }
//         }
//
//     }
//
//
// }


// var DELTA_MOVEMENT = 1;
// var MAX_COORD = 10;
//
// import {Configuration} from "./Configuration.js";
// import {EventHandler} from "./../content/Snake.js";
//
// class ReferenceSystem{
//
//     constructor(max_x, max_y, max_z){
//         this.max_x = max_x;
//         this.max_y = max_y;
//         this.max_z = max_z;
//         this.max_f = 6;
//
//         // matrix position
//         // 0 = left - 1 = right - 2 = up - 3 = down
//         // | 0 |   [4, 1, 2, 3]
//         // | 1 |   [0, 5, 2, 3]
//         // | 2 |   [4, 1, 5, 0]
//         // | 3 |   [4, 1, 5, 0]
//         // | 4 |   [5, 0, 2, 3]
//         // | 5 |   [1, 4, 2, 3]
//
//         var matrix_reference = [];
//         matrix_reference.push([4, 1, 2, 3]);
//         matrix_reference.push([0, 5, 2, 3]);
//         matrix_reference.push([4, 1, 5, 0]);
//         matrix_reference.push([1, 4, 5, 0]);
//         matrix_reference.push([5, 0, 2, 3]);
//         matrix_reference.push([1, 4, 2, 3]);
//
//         this.mrs = matrix_reference;
//
//     }
// }
//
// class ObjectPosition {
//
//     constructor(x, y, z, f, rs){
//         this.x = x;
//         this.y = y;
//         this.z = z;
//         this.f = f;
//
//         this.rs = rs; // reference system
//
//     }
//
//     check_consistency(){
//
//         // face index
//         // sx = 0
//         // dx = 1
//         // up = 2
//         // down = 3
//         var face = this.f;
//
//
//         if(this.x > this.rs.max_x){
//           // from this face to right face
//           this.x = 0;
//           this.f = this.rs.mrs[face][1];
//
//         } else if (this.x < 0){
//           // from this face to left face
//           this.x = this.rs.max_x;
//           this.f = this.rs.mrs[face][0];
//         }
//
//         if(this.y > this.rs.max_y){
//           // from this face to down face
//           this.y = 0;
//           this.f = this.rs.mrs[face][3];
//
//
//         } else if (this.y < 0){
//           // from this face to up face
//           this.y = this.rs.max_y;
//           this.f = this.rs.mrs[face][2];
//         }
//
//         if(this.z > this.rs.max_z) this.z = this.rs.max_z;
//         else if(this.z < 0) this.z = 0;
//     }
//
//
//     decrease(x, y, z){
//         this.x -= x;
//         this.y -= y;
//         this.z -= z;
//
//         this.check_consistency();
//     }
//
//     increase(x, y, z){
//         this.x += x;
//         this.y += y;
//         this.z += z;
//
//         this.check_consistency();
//
//     }
//
//
// }
//
// export class Controller{
//
//     constructor(object){
//         this.object = object
//     }
//
//
//     left(){
//         this.object.goLeft();
//         // EventHandler.startNextEvent();
//     }
//
//     right(){
//         this.object.goRight();
//         // EventHandler.startNextEvent();
//     }
//
//     up(){
//         this.object.goUp();
//         // EventHandler.startNextEvent();
//     }
//
//     down(){
//         this.object.goDown();
//         // EventHandler.startNextEvent();
//     }
//
// }
//
//
// class Controller2D extends Controller{
//
//     constructor(object){
//         super(object);
//     }
//
//     left(){
//         super.left();
//     }
//
//     right(){
//         super.right();
//     }
//
//     up(){
//         super.up();
//     }
//
//     down(){
//         super.down();
//     }
// }
//
//
//
// class Controller3D extends Controller{
//
//     constructor(object){
//         super(object);
//     }
//
//     left(){
//         super.left();
//     }
//
//     right(){
//         super.right();
//     }
//
//     up(){
//         super.up();
//     }
//
//     down(){
//         super.down();
//     }
// }
//
//

//
// // let reference = new ReferenceSystem(10, 10, 2);
//
//
// // let objectPosition = new ObjectPosition(0, 0, 0, 0, reference);
//
// // let keyboardController = new KeyboardHandler();

