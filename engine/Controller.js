import {equal, mult, subtract, vec3, rotate, vec4, add} from "../Common/MVnew.js";
import {Utilities} from "./Utilities.js";
import {Bonus, Food, ObstaclePart} from "./Entity.js";
import {SnakeNode} from "../content/Snake.js";


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


    /*-------------------------- Movements ------------------------------*/

    /*----- Movement: schedulers -----*/
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
            this.snake.add_movement(new_pos, direction);
        else {
            this.#collision_handler(old_pos, new_pos, direction);
        }
    }



    /*----------- Movement: Collision ---------*/

    #collision_handler(old_pos, new_pos, direction) {

        // End of plane: rotating
        if(!this.game.check_consistency(new_pos[0], new_pos[1], new_pos[2])) {
            const rotated_delta = this.#change_face(old_pos,new_pos);
            new_pos[0] = Math.round(old_pos[0] + rotated_delta[0]);
            new_pos[1] = Math.round(old_pos[1] + rotated_delta[1]);
            new_pos[2] = Math.round(old_pos[2] + rotated_delta[2]);
            direction = Utilities.vector_to_direction(rotated_delta);
            this.#schedule_movement(old_pos,new_pos, direction);
            return;
        }

        const front_content = this.game.environment.get_content(new_pos);

        // Element ahead: obstacle or snake
        if (front_content instanceof ObstaclePart || front_content instanceof SnakeNode) {
            // TODO END GAME
            alert("HAI PIERSO");
        }

        // Element ahead: food
        if (front_content instanceof Food) {
            // TODO EAT
            this.game.destroy_object_structure(new_pos[0], new_pos[1], new_pos[2]);
            this.game.destroy_object_view();
            this.snake.add_node();
            this.#schedule_movement(old_pos,new_pos, direction);
        }

        // Element ahead: Bonus
        if (front_content instanceof Bonus) {
            // TODO Bonus handle
        }
    }



    #change_face(old_pos, new_pos) {
        old_pos = vec3(old_pos[0], old_pos[1], old_pos[2]);
        new_pos = vec3(new_pos[0], new_pos[1], new_pos[2]);

        // Calculating the direction axis
        let delta_vector = subtract(new_pos, old_pos);
        const current_up_direction = this.game.up_direction;
        const current_right_direction = this.game.right_direction;

        // Unitary norm vector indicating up and right w.r.t the viewer
        let up_vector = Utilities.direction_to_vector(current_up_direction);
        let right_vector = Utilities.direction_to_vector(current_right_direction);


        // Calculating the rotation axis
        let rotation_vector;
        let rotation_angle;
        if (equal(delta_vector,right_vector) || equal(mult(-1,delta_vector),right_vector)) {
            rotation_vector = up_vector;
            equal(delta_vector,right_vector) ? rotation_angle = -90 : rotation_angle = 90;
        } else {
            rotation_vector = right_vector;
            equal(delta_vector,up_vector) ? rotation_angle = 90 : rotation_angle = -90;
        }

        // Computing the rotation matrix around the rotation axis
        const rotation_matrix = rotate(rotation_angle,rotation_vector);

        // Computing the new rotated vectors
        up_vector = mult(rotation_matrix, vec4(up_vector[0], up_vector[1], up_vector[2], 0));
        right_vector = mult(rotation_matrix,vec4(right_vector[0], right_vector[1], right_vector[2], 0));
        delta_vector = mult(rotation_matrix, vec4(delta_vector[0], delta_vector[1], delta_vector[2], 0));

        // Updating data structure
        this.game.up_direction = Utilities.vector_to_direction(up_vector);
        this.game.right_direction = Utilities.vector_to_direction(right_vector);
        this.game.world_directions_updated = true;

        return delta_vector;
    }



    /*-------- Movement: runner -----*/

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




    /* ----- Others ------*/
    #init_keyboard() {
        const controller = this;
        document.addEventListener('keydown', keyDownHandler, false);

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
