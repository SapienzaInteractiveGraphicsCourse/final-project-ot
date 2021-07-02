import { View } from "./View.js";
import { degrees_to_radians } from "./Utility.js";

// Gneric object in the environment
export class Entity extends View {

    // f = cube faces {0, 1, 2, 3, 4, 5}
    // x = matrix rows {0, ..., dim - 1}
    // y = matrix columns {0, ..., dim - 1}
    constructor(id, name, f, x, y, z){
        super();
        
        
        // common 
        this.id = id;
        this.name = name;
        
        // info position
        this.face = f;
        this.x = x;
        this.y = y;
        this.z = z


    }

    view(){
        // default implementation
        const obj_material = new THREE.MeshBasicMaterial( {color: 0xaaaf00} );
        const food_geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
        const sphere = new THREE.Mesh( food_geometry, obj_material );
        return sphere;
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
    
    constructor(id, name, f, x, y, z) {
        super(id, name, f, x, y, z); // call the super class constructor and pass in the name parameter
    }


    view(){

        const material = new THREE.MeshNormalMaterial( {color: 0x1AFF00});
        material.transparent = true;
        material.opacity = 0.8;
        

        // const material = new THREE.MeshBasicMaterial( {color: 0x1AFF00});
        // material.wireframe = true;

        var geometry = new THREE.BoxGeometry(1, 1 ,1); 
        var obstacle = new THREE.Mesh( geometry, material );
        return obstacle;




    //     // default
    //     const material = new THREE.MeshBasicMaterial( {color: 0x864F2B});
    //     // material.wireframe = true;
    //     var geometry = new THREE.BoxGeometry(0, 0 ,0); 
    //     var obstacle = new THREE.Mesh( geometry, material );

    //     var rnd_radius, rnd_details = 0, obstacle_section;
    //     var rnd_x, rnd_y, rnd_z = 1;

    //     var rnd_num = Math.floor(Math.random() * 5);

   
    //     for(var i = 0; i < rnd_num; i++){

    //         rnd_radius = Math.random() * 0.25 + 0.1;
            
    //         // rnd_details = Math.floor(Math.random() * 5);  
    //         rnd_x =  (Math.random() * ((0.5 - rnd_radius) * 2 )) - (0.5 - rnd_radius );
    //         rnd_y =  (Math.random() * ((0.5 - rnd_radius) * 2 )) - (0.5 - rnd_radius );
            
    //         geometry = new THREE.DodecahedronGeometry(rnd_radius, rnd_details);
    //         obstacle_section = new THREE.Mesh( geometry, material );
    //         obstacle_section.position.set(rnd_x, rnd_y, -(0.5 - rnd_radius ));
    //         obstacle.add(obstacle_section);

            
    //         rnd_radius = Math.random() * 0.5 + 0.1;
    //         // rnd_details = Math.floor(Math.random() * 5);   
    //         rnd_x =  (Math.random() * ((0.5 - rnd_radius) * 2 )) - (0.5 - rnd_radius );
    //         rnd_y =  (Math.random() * ((0.5 - rnd_radius) * 2 )) - (0.5 - rnd_radius );
                
    //         geometry = new THREE.IcosahedronGeometry(rnd_radius, rnd_details);
    //         obstacle_section = new THREE.Mesh( geometry, material );
    //         obstacle_section.position.set(rnd_x, rnd_y, -(0.5 - rnd_radius ));
    //         obstacle.add(obstacle_section);

            
    //         rnd_radius = Math.random() * 0.5 + 0.1;
    //         // rnd_details = Math.floor(Math.random() * 5);
    //         rnd_x =  (Math.random() * ((0.5 - rnd_radius) * 2 )) - (0.5 - rnd_radius );
    //         rnd_y =  (Math.random() * ((0.5 - rnd_radius) * 2 )) - (0.5 - rnd_radius );
            
    //         geometry = new THREE.OctahedronGeometry(rnd_radius, rnd_details);
    //         obstacle_section = new THREE.Mesh( geometry, material );
    //         obstacle_section.position.set(rnd_x, rnd_y, -(0.5 - rnd_radius ));
    //         obstacle.add(obstacle_section);

    //     }
        
    //     return obstacle;

    }

    
}


// Player object 
export class Player extends Entity{

    constructor(id, name, f, x, y, z) {
        super(id, name, f, x, y, z); // call the super class constructor and pass in the name parameter
    }

    view(){

    }
    
}

// Food object
export class Food extends Entity{

    constructor(id, name, f, x, y, z) {
        super(id, name, f, x, y, z); // call the super class constructor and pass in the name parameter
    }


    view(){

        const obj_material = new THREE.MeshBasicMaterial( {color: 0xCE1212} );
        const food_geometry = new THREE.SphereGeometry( 0.25, 8, 8 );
        const sphere = new THREE.Mesh( food_geometry, obj_material );
        return sphere;
    }
    
}



// Bonus object
export class Bonus extends Entity{

    constructor(id, name, f, x, y, z) {
        super(id, name, f, x, y, z); // call the super class constructor and pass in the name parameter
    }


    view(){

        const geometry = new THREE.TorusGeometry( 0.3, 0.05, 10, 16);
        const material = new THREE.MeshBasicMaterial( { color: 0x4E89AE } );
        const torus = new THREE.Mesh( geometry, material );
        torus.rotation.set(0, degrees_to_radians(90), 0);
        
        return torus
    }
    
}

