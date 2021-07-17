import { View } from "./View.js";
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
import {Config} from "./Config.js";
import {Utilities} from "./Utilities.js";



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

        this.rot = { x: 0, y: 0, z: 0 }

        this.mesh = null;
    }

    draw(){
        
        if(this.drawable){

            // default implementation
            const obj_material = new THREE.MeshBasicMaterial( {color: 0xffaf00} );
            // const obj_material = new THREE.MeshBasicMaterial( {color: 0xaaaf00} );
            const food_geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
            const sphere = new THREE.Mesh( food_geometry, obj_material );

            sphere.position.set(this.pos.x, this.pos.y, this.pos.z);
            sphere.rotation.set(this.rot.x, this.rot.y, this.pos.z);
            this.mesh = sphere;

        }else this.mesh = null;
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
            const obstacle_material = new THREE.MeshNormalMaterial();
            obstacle_material.transparent = true;
            obstacle_material.opacity = 0.8;

            const obstacle_geometry = new THREE.BoxGeometry(1, 1 ,1);
            const box =  new THREE.Mesh( obstacle_geometry, obstacle_material );
            box.position.set(this.pos.x, this.pos.y, this.pos.z);
            box.rotation.set(this.rot.x, this.rot.y, this.pos.z);

            this.mesh = box;


        } else{
            // avoid to draw each fixed obstacle part
            // they will be drawn by environment as a single big block
            this.mesh = null;
               
        }

    }


}

// Player object 
export class SnakeEntity extends Entity{

    constructor(x, y, z, drawable, movable, erasable){
        super(x, y, z, drawable, movable, erasable); // call the super class constructor and pass in the name parameter
        this.mesh = null;
        this.draw();
    }

    draw(){

        if(this.drawable) this.mesh = null;

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
            const obj_material = new THREE.MeshBasicMaterial( {color: 0xCE1212} );
            const food_geometry = new THREE.SphereGeometry( 0.25, 8, 8 );
            const sphere = new THREE.Mesh( food_geometry, obj_material );
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


// Bonus object
export class Bonus extends Entity{

    constructor(x, y, z, drawable, movable, erasable){
        super(x, y, z, drawable, movable, erasable); // call the super class constructor and pass in the name parameter

        this.mesh = null;
        this.draw();
        this.animate();
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

            const target_coords = {
                x: Utilities.degrees_to_radians(360),
                y: Utilities.degrees_to_radians(360),
                z: Utilities.degrees_to_radians(360)
            };

            console.log("rotation ", target_coords);
            const tween_start = new TWEEN.Tween(this.mesh.rotation).to(target_coords, 2500).repeat(Infinity);
            tween_start.start();

        }

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
