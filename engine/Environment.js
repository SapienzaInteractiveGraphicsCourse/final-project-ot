// import { Group } from "../resources/three.js-r129/build/three.module.js";
import { Scene, SkeletonHelper } from "../resources/three.js-r129/build/three.module.js";
import * as Entity from "./Entity.js";
import { ModelLoader } from "./ModelLoader.js";
import { degrees_to_radians } from "./Utility.js";
import { View }  from "./View.js";

// Environment structure


export class Environment extends View{

    constructor(dim){
        super();

        this.dim = dim;

        let m0 = new Matrix(2, dim, dim);
        let m1 = new Matrix(2, dim, dim);
        let m2 = new Matrix(2, dim, dim);
        let m3 = new Matrix(2, dim, dim);
        let m4 = new Matrix(2, dim, dim);
        let m5 = new Matrix(2, dim, dim);

        // left, right, up, down

        m0.collate(m4, m1, m2, m3);
        m5.collate(m1, m4, m2, m3);

        m1.collate(m0, m5, m2, m3);
        m4.collate(m5, m0, m2, m3);

        m2.collate(m4, m1, m5, m0);
        m3.collate(m4, m1, m5, m0);

        this.environment = [m0, m1, m2, m3, m4, m5];
        
    }

    view(){


        var depth_offset = 2;
        var env_dim = this.dim + depth_offset;
        var offset = 0;

        var m0 = this.environment[0];
        var m1 = this.environment[1];
        var m2 = this.environment[2];
        var m3 = this.environment[3];
        var m4 = this.environment[4];
        var m5 = this.environment[5];
        
        const f0 = m0.view();
        f0.position.set(offset, offset, offset);
        f0.rotation.set(degrees_to_radians(180), 0, 0);

        const f1 = m1.view();
        f1.position.set(offset + env_dim/2, offset, offset + env_dim/2);
        f1.rotation.set(0, degrees_to_radians(90), 0);

        const f2 = m2.view();
        f2.position.set(offset, offset + env_dim/2, offset + env_dim/2);
        f2.rotation.set(degrees_to_radians(90), degrees_to_radians(180), 0);

        const f3 = m3.view();
        f3.position.set(offset, offset - env_dim/2, offset + env_dim/2);
        f3.rotation.set(degrees_to_radians(90), 0, 0);

        const f4 = m4.view();
        f4.position.set(offset - env_dim/2, offset, offset + env_dim/2);
        f4.rotation.set(0, degrees_to_radians(270), 0);

        const f5 = m5.view();
        f5.position.set(offset, offset, offset + env_dim);

        return [f0, f1, f2, f3, f4, f5]  // list of mesh, one for each cube face


       }


}




class Matrix extends View{
    
    constructor(depth, width, height){
        super();
        
        this.depth = depth;
        this.width = width;
        this.height = height;
        
        var mat = []
    
        for(var d = 0; d < depth; d++){
            var level = [];
            for(var i = 0; i < width; i++){
                var row = []
                for(var j = 0; j < height; j++){
                    let c = new Cell(i*width + j);
                    row.push(c);
                }
                level.push(row);
            }
            mat.push(level);
        }

        this.matrix = mat;
        
    }

    collate(left, right, up, down){
        
        this.left = left;
        this.right = right;
        this.up = up;
        this.down = down;
    }

    view(){


        var w = this.width;
        var h = this.height;
        var d = this.depth;

        const face_material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        face_material.transparent = true;
        face_material.opacity = 0.1;
        face_material.wireframe = true;
        // face_material.wireframeLinecap = "butt"; // "butt", "round" and "square".
        // face_material.wireframeLinejoin =  "miter"; // "round", "bevel" and "miter". Default is 'round'.


        // const face_geom = new THREE.PlaneGeometry(w, h);
        const face_geom = new THREE.BoxGeometry(w, h, d, w, h, d);
        const face_mesh = new THREE.Mesh( face_geom, face_material );
        return face_mesh;

    }

}


class Cell{
    constructor(name){
        this.name = name
    }
}


// class MatrixView{
//     constructor()
// }


// class CellView{
//     constructor()
// }



// Level generator
export class RandomEnvironmentGenerator extends View {

    constructor(game_level, environment){
        super();
        
        this.game_level = game_level
        this.environment = environment;

    }

    // randomly generates entity on the environment
    generate(){


        var dim = this.environment.dim;
        
        var id = 0;

        // generate obstacle
        var env_objects = [];
        for(var i = 0; i < this.game_level; i++){

            for(var f = 0; f < 6; f++){
                    
                var rnd_x = Math.floor((Math.random() * dim));
                var rnd_y = Math.floor((Math.random() * dim));
                var rnd_z = Math.floor((Math.random() * 2));
                
                
                let obs = new Entity.ObstaclePart(id, "rock", f, rnd_x, rnd_y, rnd_z);
                id++;
                this.environment.environment[f].matrix[rnd_z][rnd_x][rnd_y] = obs;
                env_objects.push(obs);
                
            }
        }

        // generate food
        for(var f = 0; f < 6; f++){
                    
            var rnd_x = Math.floor((Math.random() * dim));
            var rnd_y = Math.floor((Math.random() * dim));
            var rnd_z = Math.floor((Math.random() * 2));
                

            if (this.environment.environment[f].matrix[rnd_z][rnd_x][rnd_y] instanceof Cell){
                let food = new Entity.Food(id, "food", f, rnd_x, rnd_y, rnd_z);
                id++;
                this.environment.environment[f].matrix[rnd_z][rnd_x][rnd_y] = food;
                env_objects.push(food);
            }else{
                f = f - 1;
            }
              
        }

        
        // generate bonus
        if(Math.random() > 0.5){
            var rnd_f = Math.floor(Math.random() * 6);
            var rnd_x = Math.floor((Math.random() * dim));
            var rnd_y = Math.floor((Math.random() * dim));
            var rnd_z = Math.floor((Math.random() * 2));
                
            if (this.environment.environment[rnd_f].matrix[rnd_z][rnd_x][rnd_y] instanceof Cell){
                let bns = new Entity.Bonus(id, "bonus", rnd_f, rnd_x, rnd_y, rnd_z);
                id++;
                this.environment.environment[rnd_f].matrix[rnd_z][rnd_x][rnd_y] = bns;
                env_objects.push(bns);
            }
                
        }

        this.env_objects = env_objects;


    }

    // draw the generated environment
    view(){

        var env_dim = this.environment.dim;
        var faces_mesh = this.environment.view();

        var generated_objects = this.env_objects;

        for(var i = 0; i < generated_objects.length; i++){

            var object = generated_objects[i]; // get generated object

            console.log(object);

            var mesh = object.view(); // get object view

            // mesh.position.set(object.x - env_dim/2 + 0.5, object.y - env_dim/2 + 0.5, 0.5); // set position of object on matrix
            mesh.position.set(object.x - env_dim/2 + 0.5, object.y - env_dim/2 + 0.5, object.z - 1 + 0.5); // set position

            faces_mesh[object.face].add(mesh); // put object in the face

        }

        return faces_mesh
    }


}
