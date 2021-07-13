import { View } from "./View.js";
import { degrees_to_radians } from "./Utility.js";
import * as THREE from '../resources/three.js-r129/build/three.module.js';



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
        this.mesh = null;
        this.draw();


    }

    draw(){
        
        if(this.drawable){

            // default implementation
            const obj_material = new THREE.MeshBasicMaterial( {color: 0xffaf00} );
            // const obj_material = new THREE.MeshBasicMaterial( {color: 0xaaaf00} );
            const food_geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
            const sphere = new THREE.Mesh( food_geometry, obj_material );
            this.mesh = sphere;
    
        }else this.mesh = null;
    }

    motion_animation(){

        if(this.movable){

        }
    }

    destruction_animation(){

        if(this.erasable){

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
        
        

    }


    draw(){
        if(this.drawable){
            var obstacle_material = new THREE.MeshNormalMaterial();
            obstacle_material.transparent = true;
            obstacle_material.opacity = 0.8;

            var obstacle_geometry = new THREE.BoxGeometry(1, 1 ,1); 
            this.mesh =  new THREE.Mesh( obstacle_geometry, obstacle_material );

        } else{
            // avoid to draw each fixed obstacle part
            // they will be drawn by environment as a single big block
            this.mesh = null;
               
        }

    }

    motion_animation(x, y, z){

        if(this.movable){

            createjs.Tween.get(this.mesh.position).to(
                {
                    x : x,
                    y : y,
                    z : z
                }, 
                1000,
                createjs.Ease.linear()
            );

        }
    }

    destruction_animation(env){

        if(this.erasable){

            // createjs.Tween.get(this.mesh.material).to(
            //     {
            //         opacity : 0
            //     }, 
            //     1000,
            //     createjs.Ease.linear()
            // ).call(
            //     function(){
            //         // this.mesh.removeFromParent(); 
            //         // env.mesh.remove(this.mesh);
            //     }
            // );

        }

        

    }
          
}


// Player object 
export class Player extends Entity{

    constructor(x, y, z, drawable, movable, erasable){
        super(x, y, z, drawable, movable, erasable); // call the super class constructor and pass in the name parameter
    
    }

    draw(){

        if(this.drawable) this.mesh = null;

    }


    motion_animation(){

        if(this.movable){

        }
    }

    destruction_animation(){

        if(this.erasable){
            
        }

    }

    
}

// Food object
export class Food extends Entity{

    constructor(x, y, z, drawable, movable, erasable){
        super(x, y, z, drawable, movable, erasable); // call the super class constructor and pass in the name parameter
    
    }


    draw(){

        if(this.drawable){
            const obj_material = new THREE.MeshBasicMaterial( {color: 0xCE1212} );
            const food_geometry = new THREE.SphereGeometry( 0.25, 8, 8 );
            const sphere = new THREE.Mesh( food_geometry, obj_material );
            this.mesh = sphere;
    
        }else this.mesh = null;
    }


    motion_animation(){

        if(this.movable){

        }
    }

    destruction_animation(){

        if(this.erasable){
            
        }

    }

    
}



// Bonus object
export class Bonus extends Entity{

    constructor(x, y, z, drawable, movable, erasable){
        super(x, y, z, drawable, movable, erasable); // call the super class constructor and pass in the name parameter
    
        // this.mesh = this.view();
    }


    draw(){
        if(this.drawable){

            const geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
            const material = new THREE.MeshBasicMaterial( { color: 0xE69900 } );
            const torus = new THREE.Mesh( geometry, material );
            torus.rotation.set(0, degrees_to_radians(90), 0);
        
            this.mesh = torus;
        }else this.mesh = null;
    }


    motion_animation(){

        if(this.movable){

        }
    }

    destruction_animation(){

        if(this.erasable){
            
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
    
        if( type == THREE.DodecahedronGeometry ) 
            geometry = new THREE.DodecahedronGeometry(radius);
        else if (type == THREE.TetrahedronGeometry)
            geometry = new THREE.TetrahedronGeometry(radius);
        else if (type == THREE.SphereGeometry)
            geometry = new THREE.SphereGeometry(radius, 8, 8);
           
        const material = new THREE.MeshBasicMaterial( { color: 0x999999, transparent: true} );
        const particle_mesh = new THREE.Mesh( geometry, material );
        this.mesh = particle_mesh;
    }
}
