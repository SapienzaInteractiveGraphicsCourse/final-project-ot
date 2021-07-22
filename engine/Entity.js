import {View} from "./View.js";
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
import {Config} from "./Config.js";
import {Utilities} from "./Utilities.js";
import {EntityMeshManager} from "./ModelLoader.js";



// [TODO] 
// - viewable
// - drawable
// - movable
// - destructible

// Gneric object in the environment
export class Entity extends View {

    // x = matrix rows {0, ..., width - 1}
    // y = matrix columns {0, ..., height - 1}
    // z = matrix columns {0, ..., depth - 1}
    x; y; z;

    pos;
    rot;

    constructor(x, y, z, drawable, movable, erasable){
        super();

        // common 
        this.id = 0;
        this.name = "";
        
        // info position
        this.x = x;
        this.y = y;
        this.z = z;

        this.drawable = drawable;
        this.erasable = erasable;
        this.movable = movable;

        // view
        this.pos = {
            x: this.x - Config.world_width/2 + Config.cell_cube_dim/2,
            y: this.y - Config.world_height/2 + Config.cell_cube_dim/2,
            z: this.z - Config.world_depth/2 + Config.cell_cube_dim/2
        }

        this.rot = {
            x: 0,
            y: 0,
            z: 0
        }

        this.mesh = null;
    }

    // update entity position
    #update_entity_view_position(){
        this.pos = {
            x: this.x - Config.world_width/2 + Config.cell_cube_dim/2,
            y: this.y - Config.world_height/2 + Config.cell_cube_dim/2,
            z: this.z - Config.world_depth/2 + Config.cell_cube_dim/2
        }
    }

    update_entity_structure_position(x, y, z){
        this.x = x;
        this.y = y;
        this.z = z;
        this.#update_entity_view_position();

    }

    draw(){
        
        if(this.drawable){

            // default implementation
            const obj_material = new THREE.MeshBasicMaterial( {color: 0xffaf00} );
            // const obj_material = new THREE.MeshBasicMaterial( {color: 0xaaaf00} );
            const food_geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
            const sphere = new THREE.Mesh( food_geometry, obj_material );

            sphere.position.set(this.pos.x, this.pos.y, this.pos.z);
            sphere.rotation.set(this.rot.x, this.rot.y, this.rot.z);
            this.mesh = sphere;

        }else this.mesh = null;
    }

    animate(){
        if(this.movable){

            const tween = new TWEEN.Tween(this.mesh.position).to(this.pos, 1000);
            tween.start();


        }
    }


}

export class CubeCell extends Entity{

    constructor(x, y, z, drawable, movable, erasable, entity){
        super(x, y, z, drawable, movable, erasable); // call the super class constructor and pass in the name parameter
     
        this.content = entity;
    }

}

export class Obstacle {

    constructor(id, name, parts){
        this.id = id;
        this.name = name;
        this.parts = parts;
    }
}

// ObstaclePart object
export class ObstaclePart extends Entity{
    
    constructor(x, y, z, drawable, movable, erasable){
        super(x, y, z, drawable, movable, erasable); // call the super class constructor and pass in the name parameter

        this.mesh = null;
        this.draw();

    }


    draw(){
        if(this.drawable){

            const box = EntityMeshManager.get_instance().get_obstacle_part_mesh();
            box.position.set(this.pos.x, this.pos.y, this.pos.z);
            box.rotation.set(this.rot.x, this.rot.y, this.rot.z);

            this.mesh = box;


        } else{
            // avoid to draw each fixed obstacle part
            // they will be drawn by environment as a single big block
            this.mesh = null;
               
        }

    }


}

// Snake node data structure object
export class SnakeNodeEntity extends Entity{

    constructor(x, y, z, drawable, movable, erasable){
        super(x, y, z, drawable, movable, erasable); // call the super class constructor and pass in the name parameter
        this.mesh = null;
        this.draw();
    }

    draw(){
        // this draw is only for debug purposes
        if(this.drawable) {
            const nodeGeometry = new THREE.SphereGeometry(1.1, 20, 20 );
            const nodeMaterial = new THREE.MeshPhongMaterial({color: 0xCE1212});
            nodeMaterial.transparent = true;
            nodeMaterial.opacity = 0.7;
            this.mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
            this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
        } else this.mesh = null;
    }

}

// Food object
export class Food extends Entity{

    constructor(x, y, z, drawable, movable, erasable){
        super(x, y, z, drawable, movable, erasable); // call the super class constructor and pass in the name parameter
        this.mesh = null;
        this.draw();
        this.animate();
    }


    draw(){

        if(this.drawable){
            // const obj_material = new THREE.MeshBasicMaterial( {color: 0xCE1212} );
            // const food_geometry = new THREE.SphereGeometry( 0.25, 8, 8 );
            // const sphere = new THREE.Mesh( food_geometry, obj_material );
            const sphere = EntityMeshManager.get_instance().get_food_mesh();
            sphere.position.set(this.pos.x, this.pos.y, this.pos.z);
            sphere.rotation.set(this.rot.x, this.rot.y, this.pos.z);

            this.mesh = sphere;

        }else this.mesh = null;
    }

    animate(){
        if(this.drawable){

            // const target_up = {
            //     // x: pos.x + Config.cell_cube_dim/10,
            //     // y: pos.y + Config.cell_cube_dim/10,
            //     z: this.pos.z + Config.cell_cube_dim/10
            // }
            //
            // const target_down = {
            //     // x: pos.x - Config.cell_cube_dim/10,
            //     // y: pos.y - Config.cell_cube_dim/10,
            //     z: this.pos.z - Config.cell_cube_dim/10
            // }
            //
            // const tweenUp = new TWEEN.Tween(this.mesh.position).to( target_up, 1000);
            // const tweenDown = new TWEEN.Tween(this.mesh.position).to( target_down, 1000);
            // tweenUp.chain(tweenDown);
            // tweenDown.chain(tweenUp);
            // tweenUp.start();


            const target_coords = {
                x: Utilities.degrees_to_radians(90),
                y: Utilities.degrees_to_radians(90),
                z: Utilities.degrees_to_radians(90)
            };

            const target_up = {
                x: this.pos.x + Config.cell_cube_dim/10,
                // y: this.pos.y + Config.cell_cube_dim/10,
                // z: this.pos.z + Config.cell_cube_dim/10
            }

            const target_down = {
                x: this.pos.x - Config.cell_cube_dim/10,
                // y: this.pos.y - Config.cell_cube_dim/10,
                // z: this.pos.z - Config.cell_cube_dim/10
            }

            // const tweenRot = new TWEEN.Tween(this.mesh.rotation).to(target_coords, 1000).repeat(Infinity);
            const tweenUp = new TWEEN.Tween(this.mesh.position).to( target_up, 1000);
            const tweenDown = new TWEEN.Tween(this.mesh.position).to( target_down, 1000);

            // const loop1 = new TWEEN.Tween().end();
            // loop1.chain(tweenRot, tweenUp);
            //
            // const loop2 = new TWEEN.Tween().end();
            // loop2.chain(tweenRot, tweenDown);

            tweenUp.chain(tweenDown);
            tweenDown.chain(tweenUp);

            tweenUp.start();
            // tweenRot.start();

        }
    }

}


// Generic bonus object
export class Bonus extends Entity{

    constructor(x, y, z, drawable, movable, erasable){
        super(x, y, z, drawable, movable, erasable); // call the super class constructor and pass in the name parameter

        this.mesh = null;
        // this.draw();
        // this.animate();
    }


    draw(){
        if(this.drawable){

            const geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
            const material = new THREE.MeshBasicMaterial( { color: 0xE69900 } );
            const torus = new THREE.Mesh( geometry, material );
            torus.position.set(this.pos.x, this.pos.y, this.pos.z);
            torus.rotation.set(this.rot.x, this.rot.y, this.pos.z);

            this.mesh = torus;

        }else this.mesh = null;
    }

    animate(){

        if (this.drawable){

            let target_coords;
            let rotation_axis = Utilities.axis_from_world_coord(this.x, this.y, this.z);
            switch (rotation_axis){
                case Config.x_axis:
                    target_coords  = { x: Utilities.degrees_to_radians(360), y: 0, z: 0 };
                    break;
                case Config.y_axis:
                    target_coords  = { x: 0, y: Utilities.degrees_to_radians(360), z: 0 };
                    break;
                case Config.z_axis:
                    target_coords  = { x: 0, y: 0, z: Utilities.degrees_to_radians(360) };
                    break;
            }

            // console.log("target_coords ", target_coords);

            // const target_coords = {
            //     x: Utilities.degrees_to_radians(360),
            //     y: Utilities.degrees_to_radians(360),
            //     z: Utilities.degrees_to_radians(360)
            // };

            // console.log("rotation ", target_coords);
            const tween_start = new TWEEN.Tween(this.mesh.rotation).to(target_coords, 2500).repeat(Infinity);
            tween_start.start();

        }

    }


}

// the snake is lucky (a lot of bonus and food are spawned)
export class LuckyBonus extends Bonus{

    constructor(x, y, z, drawable, movable, erasable){
        super(x, y, z, drawable, movable, erasable); // call the super class constructor and pass in the name parameter

        this.mesh = null;
        this.draw();
        this.animate();
    }

    draw(){
        if(this.drawable){

            // const geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
            // const material = new THREE.MeshBasicMaterial( { color: 0x48A229 } );
            // const torus = new THREE.Mesh( geometry, material );
            const torus = EntityMeshManager.get_instance().get_lucky_bonus_mesh();
            torus.position.set(this.pos.x, this.pos.y, this.pos.z);
            torus.rotation.set(this.rot.x, this.rot.y, this.pos.z);

            this.mesh = torus;

        }else this.mesh = null;
    }
    animate() {
        super.animate();
    }
}

// the snake gains more
export class ScoreBonus extends Bonus{
    constructor(x, y, z, drawable, movable, erasable){
        super(x, y, z, drawable, movable, erasable); // call the super class constructor and pass in the name parameter

        this.mesh = null;
        this.draw();
        this.animate();
    }

    draw(){
        if(this.drawable){

            // const geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
            // const material = new THREE.MeshBasicMaterial( { color: 0xFFC500 } );
            // const torus = new THREE.Mesh( geometry, material );
            const torus = EntityMeshManager.get_instance().get_score_bonus_mesh();
            torus.position.set(this.pos.x, this.pos.y, this.pos.z);
            torus.rotation.set(this.rot.x, this.rot.y, this.pos.z);

            this.mesh = torus;

        }else this.mesh = null;
    }
}

// the snake is fast
export class FastBonus extends Bonus{

    constructor(x, y, z){
        super(x, y, z, true, true, true); // call the super class constructor and pass in the name parameter

        this.mesh = null;
        this.draw();
        this.animate();
    }

    draw(){
        if(this.drawable){

            // const geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
            // const material = new THREE.MeshBasicMaterial( { color: 0xFFFF92 } );
            // const torus = new THREE.Mesh( geometry, material );
            const torus = EntityMeshManager.get_instance().get_fast_bonus_mesh();
            torus.position.set(this.pos.x, this.pos.y, this.pos.z);
            torus.rotation.set(this.rot.x, this.rot.y, this.pos.z);

            this.mesh = torus;

        }else this.mesh = null;
    }
}

// the snake is invincible and destroys all type of obstacle
export class InvincibilityBonus extends Bonus{

    constructor(x, y, z){
        super(x, y, z, true, true, true); // call the super class constructor and pass in the name parameter

        this.mesh = null;
        this.draw();
        this.animate();
    }

    draw(){
        if(this.drawable){

            // const geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
            // const material = new THREE.MeshBasicMaterial( { color: 0x3A5FD6 } );
            // const torus = new THREE.Mesh( geometry, material );

            const torus = EntityMeshManager.get_instance().get_invincibility_bonus_mesh();
            torus.scale.set(Config.cell_cube_dim/3, Config.cell_cube_dim/3, Config.cell_cube_dim/3);
            torus.position.set(this.pos.x, this.pos.y, this.pos.z);
            torus.rotation.set(this.rot.x, this.rot.y, this.pos.z);

            this.mesh = torus;

        }else this.mesh = null;
    }
}

// the snake is invisible and cannot be cached by obstacles
export class InvisibilityBonus extends Bonus{

    constructor(x, y, z){
        super(x, y, z, true, true, true); // call the super class constructor and pass in the name parameter

        this.mesh = null;
        this.draw();
        this.animate();
    }

    draw(){
        if(this.drawable){

            // const geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
            // const material = new THREE.MeshBasicMaterial( { color: 0xBAC2DC } );
            // const torus = new THREE.Mesh( geometry, material );

            const torus = EntityMeshManager.get_instance().get_invisibility_bonus_mesh();
            torus.scale.set(Config.cell_cube_dim/5, Config.cell_cube_dim/5, Config.cell_cube_dim/5);
            torus.position.set(this.pos.x, this.pos.y, this.pos.z);
            torus.rotation.set(this.rot.x, this.rot.y, this.pos.z);

            this.mesh = torus;

        }else this.mesh = null;
    }
}


export class Particle{
    constructor(x, y, z, radius = 0.1, type = THREE.DodecahedronGeometry, life = 1000, x_dir, y_dir, z_dir){
        
        this.x = x;
        this.y = y;
        this.z = z;

        this.life = life;

        this.x_dir = x_dir;
        this.y_dir = y_dir;
        this.z_dir = z_dir;
        

        // const geometry = new THREE.TorusGeometry( 0.1, 0.025, 10, 16);
        var geometry;
    
        if( type === THREE.DodecahedronGeometry )
            geometry = new THREE.DodecahedronGeometry(radius);
        else if (type === THREE.TetrahedronGeometry)
            geometry = new THREE.TetrahedronGeometry(radius);
        else if (type === THREE.SphereGeometry)
            geometry = new THREE.SphereGeometry(radius, 8, 8);
           
        const material = new THREE.MeshBasicMaterial( { color: 0x999999, transparent: true} );
        const particle_mesh = new THREE.Mesh( geometry, material );
        this.mesh = particle_mesh;
    }
}

export class EntityPosition{
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
