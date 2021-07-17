import {ObstaclePart, Bonus, Food, Entity, CubeCell, Obstacle, Particle, SnakeEntity} from "./Entity.js";
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import { TWEEN } from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
import { CoordinateGenerator } from "./CoordinateGenerator.js";
import {Snake} from "../content/Snake.js";
import {Config} from "./Config.js";


// Level generator
export class RandomEnvironmentGenerator{
    #up_direction
    #right_direction

    constructor(game_level, environment){
        
        this.game_level = game_level
        this.environment = environment;
        this.mesh = null;
        this.snake = null;

        this.#up_direction = {
            axis: Config.DIRECTIONS.AXES.Y,
            sign: Config.DIRECTIONS.SIGN.POSITIVE
        };
        this.#right_direction = {
            axis: Config.DIRECTIONS.AXES.X,
            sign: Config.DIRECTIONS.SIGN.POSITIVE
        };
        this.world_directions_updated = false;


        this.obstacle_num = 0;
        this.food_num = 0;
        this.bonus_num = 0;

        this.coord_generator = new CoordinateGenerator(environment.width, environment.height, environment.depth);

        // 
        this.object_to_draw = [];
        this.object_to_move = [];
        this.object_to_destroy = [];

        this.generate_environment();
        this.generate_snake();

    }



    // The following methods update the data structures

    // creates an object of type (type) in the environment at coordinates (x, y, z)
    create_object_structure(x, y, z, type, drawable, movable, erasable){
        if(!this.check_consistency(x, y, z)) return;
        if(this.environment.environment[x][y][z].content != null) return;
        
        let object = new type(x, y, z, drawable, movable, erasable);
        this.environment.environment[x][y][z].content = object;
        
        if(object instanceof ObstaclePart) this.obstacle_num++;
        else if(object instanceof Food) this.food_num++;
        else if(object instanceof Bonus) this.bonus_num++;
        
        this.object_to_draw.push(object); // add object to queue

        this.coord_generator.remove_available_coordinate(x, y, z); // update generator

        console.log("Created object: [ ", type.name, " ] at [ ", x," ", y," ", z, " ]");

        return object;
    }

    // destroys the object in the environment at coordinates (x, y, z)
    destroy_object_structure(x, y, z){
        if(!this.check_consistency(x, y, z)) return;
        const object = this.environment.environment[x][y][z].content;
        if( object == null ) return;
        if( object.mesh == null ) return;
        if( !object.erasable ) return;
        
        if(object instanceof ObstaclePart) this.obstacle_num--;
        else if(object instanceof Food) this.food_num--;
        else if(object instanceof Bonus) this.bonus_num--;

        this.object_to_destroy.push(object); // add object to queue

        this.coord_generator.add_available_coordinate(x, y, z); // update generator

        this.environment.environment[x][y][z].content = null;

        console.log("Destrojed object [ ", object.constructor.name," ] at [ ", x," ", y," ", z, " ]");


    }


    // moves the object in the environment at coordinates [fromx, fromy, fromz] to the location at coordinates [tox, toy, toz]
    move_object_structure(from_x, from_y, from_z, to_x, to_y, to_z){
        if(!this.check_consistency(from_x, from_y, from_z)) return false;
        if(!this.check_consistency(to_x, to_y, to_z)) return false;

        const to_cell = this.environment.environment[to_x][to_y][to_z];
        if( to_cell.content != null) return false; // not empty cell

        const from_cell = this.environment.environment[from_x][from_y][from_z];
        if( from_cell.content == null) return false; // empty cell
        if( !from_cell.content.movable) return false; // object in cell not movable
        

        from_cell.content.x = to_x;
        from_cell.content.y = to_y;
        from_cell.content.z = to_z;
        
        to_cell.content = from_cell.content;
        from_cell.content = null;

        if (!to_cell.content instanceof Snake)
            this.object_to_move.push(to_cell.content);

        // update generator
        this.coord_generator.remove_available_coordinate(to_x, to_y, to_z);
        this.coord_generator.add_available_coordinate(from_x, from_y, from_z);
        
        console.log("Moved object [ ", to_cell.content.constructor.name," ] from [ ", from_x," ", from_y," ", from_z, " ] to [ ", to_x," ", to_y," ", to_z, " ]");

        return true;

    }

    // end


    // the following methods update the graphic interface

    // draw an object in the object_to_draw queue
    create_object_view(){

        for(let i = 0; i < this.object_to_draw.length; i++){

            const object = this.object_to_draw[i];
            if( !object.drawable ) continue;
            this.environment.mesh.add(object.mesh);


        }

        this.object_to_draw = [];

    }

    // destroy an object in the object_to_destroy queue
    destroy_object_view(){

        const environment_mesh = this.environment.mesh;


        let w = this.environment.width;
        const h = this.environment.height;
        const d = this.environment.depth;

        // explosion particles
        const particles = [];
        let explosion = [];

        let j, i;
        console.log("Removed ", this.object_to_destroy.length, " object.");
        for(i = 0; i < this.object_to_destroy.length; i++){

            const object = this.object_to_destroy[i];

            explosion = this.create_object_explosion_animation(object.x, object.y, object.z);
            particles.push(explosion);


            this.environment.mesh.remove(object.mesh); // remove obstacles

            for(j = 0; j < explosion.length; j++){
                this.environment.mesh.add(explosion[j].mesh); // add particles

                // const animation = 
                const explosion_animation = new TWEEN.Tween(explosion[j].mesh.position)
                .to( { 
                    x : explosion[j].x_dir, 
                    y: explosion[j].y_dir, 
                    z: explosion[j].z_dir }, 
                    500 
                );
                const fade_animation = new TWEEN.Tween(explosion[j].mesh.material).to( { opacity: 0}, explosion[j].life );
                const dummy_animation = new TWEEN.Tween().delay(1000)
                .onComplete( 
                    function(obj){
                        for(let y = 0; y < particles.length; y++){
                            for(let w = 0; w < particles[y].length; w++){
                                    environment_mesh.remove(particles[y][w].mesh);       
                            }
                        }
                });


                explosion_animation.chain(fade_animation, dummy_animation);
                
                explosion_animation.start();



            }

        }


        this.object_to_destroy = [];
    }   

    // geneare a particles animation for a destroyed object
    create_object_explosion_animation(x, y, z){


        const w = this.environment.width;
        const h = this.environment.height;
        const d = this.environment.depth;


        const particles = [];

        // generate a number between 50 and 150
        const particles_num = Math.floor((Math.random() * 100));
        // var particles_num = 5;
        const cell_offset = 0.5;

        for(let i = 0; i < particles_num; i++){

            const x_pos = (Math.random() * cell_offset * 2) - cell_offset;
            const y_pos = (Math.random() * cell_offset * 2) - cell_offset;
            const z_pos = (Math.random() * cell_offset * 2) - cell_offset;

            let delta_movement = 0.25;
            let x_dir = (Math.random() * delta_movement * 2) - delta_movement;
            if(x_dir > 0) x_dir = "+" + String(x_dir);
            else x_dir = String(x_dir);

            let y_dir = (Math.random() * delta_movement * 2) - delta_movement;
            if(y_dir > 0) y_dir = "+" + String(y_dir);
            else y_dir = String(y_dir);

            let z_dir = (Math.random() * delta_movement * 2) - delta_movement;
            if(z_dir > 0) z_dir = "+" + String(z_dir);
            else z_dir = String(z_dir);

            const radius = Math.random() * 0.1;

            const life = Math.floor((Math.random() * 500) + 1);

            // var particle = new Particle(x + x_pos , y + y_pos, z + z_pos, radius, THREE.DodecahedronGeometry, life, x_dir, y_dir, z_dir);
            const particle = new Particle(x + x_pos, y + y_pos, z + z_pos, radius, THREE.TetrahedronGeometry, life, x_dir, y_dir, z_dir);
            // var particle = new Particle(x + x_pos , y + y_pos, z + z_pos, radius, THREE.SphereGeometry, life, x_dir, y_dir, z_dir);
            particle.mesh.position.set(
                particle.x - w/2 + cell_offset, 
                particle.y - h/2 + cell_offset, 
                particle.z - d/2 + cell_offset
            );

            particles.push(particle);
        
        }


        return particles;

    }
    
    // move an object in the object_to_move queue
    move_object_view(){

        const width = this.environment.width;
        const height = this.environment.height;
        const depth = this.environment.depth;

        console.log("Moved ", this.object_to_move.length, " object.");
        for(let i = 0; i < this.object_to_move.length; i++){

            const object = this.object_to_move[i];

            // ANIMATION

            const tween = new TWEEN.Tween(object.mesh.position).to(
                {
                    x: object.x - width/2 + 0.5, 
                    y: object.y - height/2 + 0.5, 
                    z: object.z - depth/2 + 0.5 
                }, 
                1000
            );
            

            // tween.easing(TWEEN.Easing.Quadratic.In);
            tween.start();
                                 
        }


        this.object_to_move = [];

    }

    // end



    // 

    // return true if the coordinates are inside the environment
    // return false otherwise 
    check_consistency(x, y, z){
        const w = this.environment.width;
        const h = this.environment.height;
        const d = this.environment.depth;

        if( x >= 0 && x < w && y >= 0 && y < h && z >= 0 && z < d) return true;
        else return false;
    }

    random_movement(delta, random = false){
        if(random) delta = Math.floor(Math.random() * delta);
        
        // 6 direction 
        // forward, backward, up, down, left, right 
        const rnd_direction = Math.floor((Math.random() * 6)); // from 0 to 3
        let x, y, z;
        switch (rnd_direction) {
                
            case 0:   
                x = delta;
                y = 0;
                z = 0;
                break;
            
            case 1:  
                x = 0;
                y = delta;
                z = 0; 
                break;
            
            case 2:  
                x = 0;
                y = 0;
                z = delta; 
                break;
            
            case 3: 
                x = - delta;
                y = 0;
                z = 0;   
                break;

            case 4:  
                x = 0;
                y = - delta;
                z = 0; 
                break;
            
            case 5: 
                x = 0;
                y = 0;
                z = - delta;   
                break;
            
        }

        return {x:x, y:y, z:z};
            
    }

    // randomly generates entity on the environment
    // - core obstacle are generated
    // - random obstacle are generated
    // - food is generated (always)
    // - bonus is generated (randomly)
    generate_environment(){

        const space = this.environment.face_depth;

        const width = this.environment.width;
        const height = this.environment.height;
        const depth = this.environment.depth;

        let rnd_value, rnd_x, rnd_y, rnd_z;

        // generate core obstacles
        for(let i = space; i < width - space; i++){
            for(let j = space; j < height - space; j++){
                for(let k = space; k < depth - space; k++){
                    
                    this.create_object_structure(i, j, k, ObstaclePart, false, false, false);
                   
                }
            }   
        }


        // generate random obstacle
        const obs_num = Math.floor(Math.random() * this.game_level);
        for(var i = 0; i < obs_num; i++){

            // get random coord from generator
            rnd_value = this.coord_generator.get_random_available();
            
            rnd_x = rnd_value[0];
            rnd_y = rnd_value[1];
            rnd_z = rnd_value[2];

            this.create_object_structure(rnd_x, rnd_y, rnd_z, ObstaclePart, true, true, true);
        }

        // get random coord from generator
            
        rnd_value = this.coord_generator.get_random_available();

        rnd_x = rnd_value[0];
        rnd_y = rnd_value[1];
        rnd_z = rnd_value[2];

        this.create_object_structure(rnd_x, rnd_y, rnd_z, Food, true, false, true);
        
        // generate bonus
        if (Math.random() > 0.5){

            rnd_value = this.coord_generator.get_random_available();

            rnd_x = rnd_value[0];
            rnd_y = rnd_value[1];
            rnd_z = rnd_value[2];

            this.create_object_structure(rnd_x, rnd_y, rnd_z, Bonus, true, false, false);
        }

        this.create_object_view();
        
    }


    generate_snake() {

        const world_coordinates = this.coord_generator.get_random_available();
        let x = this.environment.width / 2;//world_coordinates[0];
        let y = this.environment.height / 2 ;
        let z = this.environment.depth -1; //world_coordinates[2];

        this.snake = this.create_object_structure(x, y, z, Snake, true, true, false);

        this.create_object_view();
    }


   
    // Moves {number} object in the envirnoment
    // if { random } the number of object is in the range { 0 , number}
    move_objects(number, random){
        
        if(random) number = Math.floor(Math.random() * number);

        let from_x, from_y, from_z;
        let to_x, to_y, to_z;
        for(let i = 0; i < number; i++){

            const coord = this.coord_generator.get_random_unavailable();
            if(coord == null) continue;
            const relative_movement = this.random_movement(1, false);

            from_x = coord[0];
            from_y = coord[1];
            from_z = coord[2];

            to_x = from_x + relative_movement.x;
            to_y = from_y + relative_movement.y;
            to_z = from_z + relative_movement.z;

            this.move_object_structure(from_x, from_y, from_z, to_x, to_y, to_z);

        }
        
        this.move_object_view();

    }

    // Destroys {number} object in the envirnoment
    // if { random } the number of object is in the range { 0 , number}
   
    destroy_objects(number, random){
        if(random) number = Math.floor(Math.random() * number);

        for(let i = 0; i < number; i++){

            const coord = this.coord_generator.get_random_unavailable();
            if(coord == null) continue;
            this.destroy_object_structure(coord[0], coord[1], coord[2]);
            
        }

        this.destroy_object_view();

    }

    

    // Spawn {number} ObstaclePart object in the environment
    spawn_obstacles(number, drawable, movable, erasable){
        this.spawn_objects(number, ObstaclePart, drawable, movable, erasable);
    }


    // Spawn {number} Food object  in the environment
    spawn_foods(number, drawable, movable, erasable){
        this.spawn_objects(number, Food, drawable, movable, erasable);
    }


    // Spawn {number} Bonus object in the environment
    spawn_bonus(number, drawable, movable, erasable){
        this.spawn_objects(number, Bonus, drawable, movable, erasable);
    }

    // Spawn {number} object of type {type} in the environment
    spawn_objects(number, type, drawable, movable, erasable, random){
        if(random) number = Math.floor(Math.random() * number);

        for(let i = 0; i < number; i++){
            let coord = this.coord_generator.get_random_available();
            if(coord == null) continue;
            this.create_object_structure(coord[0], coord[1], coord[2], type, drawable, movable, erasable);
            
        }

        this.create_object_view();
            
        
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
}
