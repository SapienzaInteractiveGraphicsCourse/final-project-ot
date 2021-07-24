import {equal, mult, subtract, vec3, rotate, vec4, add} from "../Common/MVnew.js";
import {Utilities} from "./Utilities.js";
import {Food, ObstaclePart} from "./Entity.js";
import {SnakeNode} from "./Snake.js";
import {Config} from "./Config.js";


export class Controller{
    static instance = null;

    engine;
    started;

    snake_position;
    #up_direction;
    #right_direction;

    /*------- SINGLETON Handle ------*/
    static init(engine) {
        if (Controller.instance != null) {
            console.log("ERROR: Controller already initialized");
            return null;
        }
        Controller.instance = new Controller(engine);
    }

    static get_instance() {
        if (Controller.instance != null)
            return Controller.instance;
        console.log("ERROR: Controller not initialized");
    }

    static reset(engine) {
        if (Controller.instance == null) {
            console.log("ERROR: Controller is not initialized");
            return;
        }
        Controller.instance = new Controller(engine);
    }

    static destroy(){
        if (Controller.instance == null) {
            console.log("ERROR: Controller is not initialized");
            return;
        }

        Controller.instance = null;
    }

    constructor(engine) {

        this.engine = engine;
        let snake = engine.environment_manager.snake;

        this.snake_position = [snake.x, snake.y, snake.z];

        this.#up_direction = {
            axis: Config.DIRECTIONS.AXES.Y,
            sign: Config.DIRECTIONS.SIGN.POSITIVE
        };
        this.#right_direction = {
            axis: Config.DIRECTIONS.AXES.X,
            sign: Config.DIRECTIONS.SIGN.POSITIVE
        };
        this.world_directions_updated = false;

        this.#init_keyboard();
    }

    start() {
        this.started = true;
        this.right();
        this.move_snake();
    }


    /*------- Getters && Setters------*/
    get up_direction() {
        return {...this.#up_direction}
    }
    get right_direction() {
        return {...this.#right_direction}
    }

    set up_direction(direction) {
        this.#up_direction = direction;
    }

    set right_direction(direction) {
        this.#right_direction = direction;
    }

    /*-------------------------- Movements ------------------------------*/

    /*----- Movement: schedulers -----*/
    up() {
        const instance_position = this.snake_position;
        const instance_target_position = [...instance_position];
        const instance_direction = this.up_direction;
        instance_target_position[instance_direction.axis] += instance_direction.sign;

        this.schedule_movement(instance_position, instance_target_position, instance_direction);

    }

    down() {
        const instance_position = this.snake_position;
        const instance_target_position = [...instance_position];
        const instance_direction = this.up_direction;
        instance_direction.sign *= -1;
        instance_target_position[instance_direction.axis] += instance_direction.sign;

        this.schedule_movement(instance_position, instance_target_position, instance_direction);

    }

    left() {
        const instance_position = this.snake_position;
        const instance_target_position = [...instance_position];
        const instance_direction = this.right_direction;
        instance_direction.sign *= -1;
        instance_target_position[instance_direction.axis] += instance_direction.sign;

        this.schedule_movement(instance_position, instance_target_position, instance_direction);

    }

    right() {
        const instance_position = this.snake_position;
        const instance_target_position = [...instance_position];
        const instance_direction = this.right_direction;
        instance_target_position[instance_direction.axis] += instance_direction.sign;

        this.schedule_movement(instance_position, instance_target_position, instance_direction);
    }


    schedule_movement(snake_position, snake_target_position, snake_target_direction){

        let manager = this.engine.environment_manager;
        let snake = this.engine.environment_manager.snake;

        if (Utilities.array_equal(snake_position, snake_target_position)) return;

        if (snake.get_next_movement() !== null){
            if(Config.log) console.log("Double hit suppression");
            return;
        }

        const snake_direction = snake.get_current_direction();
        if (snake_direction !== null && snake_direction.axis === snake_target_direction.axis && snake_direction.sign !== snake_target_direction.sign) {
            if(Config.log) console.log("Forbidden direction");
            return;
        }


        const done = manager.move_object_structure(
            snake_position[0], snake_position[1], snake_position[2],
            snake_target_position[0],snake_target_position[1],snake_target_position[2]
        );

        if (done) {
            //const nodes_old_pos = snake.get_nodes_position();
            snake.add_movement(snake_target_position, snake_target_direction);
            const nodes_new_pos = snake.get_nodes_position();

            for (let i = 1; i<nodes_new_pos.length - 1; i++) {
                //const old_pos = nodes_old_pos[i];
                const new_pos = nodes_new_pos[i];

                if (i >= manager.snake_nodes_num) {
                    const node = snake.get_node(i);
                    manager.create_snake_node_structure(node, new_pos);
                    continue;
                }
                const check_done  = manager.move_snake_structure(i, new_pos);
                if (!check_done) console.log("ERROR: snake structure movement [Node,old_pos, new_pos]", snake.get_node(i), new_pos);
                manager.move_object_view();
            }

        } else {
            this.#rotate_view(snake_position, snake_target_position);
            const gameover = this.#collision_handler(snake_target_position);
            if (gameover) this.started = false;
            else this.schedule_movement(snake_position, snake_target_position, snake_target_direction);
        }
    }



    #rotate_view(snake_position, snake_target_position){

        let manager = this.engine.environment_manager;
        let snake = this.engine.environment_manager.snake;

        let x, y, z;
        x = snake_position[0];
        y = snake_position[1];
        z = snake_position[2];

        let target_x, target_y, target_z;
        target_x = snake_target_position[0];
        target_y = snake_target_position[1];
        target_z = snake_target_position[2];

        if(!manager.check_consistency(target_x, target_y, target_z)) {
            const rotated_delta = this.#change_face(snake_position, snake_target_position);
            target_x = Math.round(x + rotated_delta[0]);
            target_y = Math.round(y + rotated_delta[1]);
            target_z = Math.round(z + rotated_delta[2]);
            let snake_target_direction = Utilities.vector_to_direction(rotated_delta);
            this.schedule_movement(
                [x, y, z],
                [target_x, target_y, target_z],
                snake_target_direction
            );

        }

    }

    #change_face(old_pos, new_pos) {
        old_pos = vec3(old_pos[0], old_pos[1], old_pos[2]);
        new_pos = vec3(new_pos[0], new_pos[1], new_pos[2]);

        // Calculating the direction axis
        let delta_vector = subtract(new_pos, old_pos);
        const current_up_direction = this.up_direction;
        const current_right_direction = this.right_direction;

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
        this.up_direction = Utilities.vector_to_direction(up_vector);
        this.right_direction = Utilities.vector_to_direction(right_vector);
        this.world_directions_updated = true;

        return delta_vector;
    }

    #collision_handler(snake_target_position) {
        let manager = this.engine.environment_manager;
        let snake = this.engine.environment_manager.snake;

        let end_game = false;
        let x, y, z;
        x = snake_target_position[0];
        y = snake_target_position[1];
        z = snake_target_position[2];
        let cell_content = manager.get_entity(x, y, z);
        if(cell_content == null) return end_game;

        end_game = this.engine.collision(cell_content);


        // switch (cell_content.constructor.name) {
        //     case 'ObstaclePart':
        //         if(Config.log) console.log("ObstaclePart hit");
        //         this.engine.obstacle_hit(cell_content);
        //
        //         end_game = true;
        //         break;
        //     case 'SnakeNodeEntity':
        //         if(Config.log) console.log("SnakeNode hit");
        //         this.engine.snake_hit(cell_content);
        //
        //         end_game = true;
        //         break;
        //
        //     case 'Food':
        //         if(Config.log) console.log("Food hit");
        //         this.engine.food_hit(cell_content);
        //         end_game = false;
        //         break;
        //
        //     case 'LuckyBonus':
        //     case 'ScoreBonus':
        //     case 'FastBonus':
        //     case 'InvincibilityBonus':
        //     case 'InvisibilityBonus':
        //     case 'Bonus':
        //         if(Config.log) console.log("Bonus hit");
        //         this.engine.bonus_hit(cell_content);
        //         end_game = false;
        //         break;
        //
        // }

        return end_game;

    }


    /*-------- Movement: runner -----*/

    move_snake() {
        if(!this.started) return;

        let manager = this.engine.environment_manager;
        let snake = this.engine.environment_manager.snake;

        const next_movement = snake.get_next_movement();
        if (next_movement === null) {
            const instance_position = [snake.x, snake.y, snake.z];
            // const instance_position = snake.snake_position;
            const instance_target_position = [...instance_position];
            const instance_direction = snake.get_current_direction();
            instance_target_position[instance_direction.axis] += instance_direction.sign;

            this.schedule_movement(instance_position, instance_target_position, instance_direction);
        }

        this.engine.update_engine();

        snake.move();
    }




    /* ----- Others ------*/
    #init_keyboard() {
        const controller = this;
        document.addEventListener('keydown', keyDownHandler, false);

        const KeyboardHelper = {left: 65, up: 87, right: 68, down: 83, space: 32};

        function keyDownHandler(event) {
            if (!controller.started) return;
            controller.update_snake_position();
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
        }
    }

    update_snake_position() {
        let manager = this.engine.environment_manager;
        let snake = this.engine.environment_manager.snake;

        this.snake_position = [snake.x, snake.y, snake.z];
    }
}
