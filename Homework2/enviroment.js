
class Environment{

    constructor(dim){
        this.dim = dim;

        let m0 = new Matrix(dim, dim);
        let m1 = new Matrix(dim, dim);
        let m2 = new Matrix(dim, dim);
        let m3 = new Matrix(dim, dim);
        let m4 = new Matrix(dim, dim);
        let m5 = new Matrix(dim, dim);

        // left, right, up, down

        m0.collate(m4, m1, m2, m3);
        m5.collate(m1, m4, m2, m3);

        m1.collate(m0, m5, m2, m3);
        m4.collate(m5, m0, m2, m3);

        m2.collate(m4, m1, m5, m0);
        m3.collate(m4, m1, m5, m0);

        this.environment = [m0, m1, m2, m3, m4, m5];
        
    }

}


class Matrix{
    
    constructor(width, height){
        this.width = width;
        this.height = height;
        
        var mat = []
        for(var i = 0; i < width; i++){
            var row = []
            for(var j = 0; j < height; j++){
                let c = new Cell(i*width + j);
                row.push(c);
            }
            mat.push(row);
        }

        this.matrix = mat;
        
    }

    collate(left, right, up, down){
        
        this.left = left;
        this.right = right;
        this.up = up;
        this.down = down;
    }

}

class Cell{
    constructor(name){
        this.name = name
    }
}


// Gneric object in the environment
class Entity {
    
    // f = cube faces {0, 1, 2, 3, 4, 5}
    // x = matrix rows {0, ..., dim - 1}
    // y = matrix columns {0, ..., dim - 1}
    constructor(id, name, f, x, y){
        this.id = id;
        this.name = name;
        this.face = f;
        this.x = x;
        this.y = y;

    }
}

// Obstacle object
class Obstacle extends Entity{
    
    constructor(id, name, f, x, y) {
        super(id, name, f, x, y); // call the super class constructor and pass in the name parameter
    }
    
}

// Player object 
class Player extends Entity{
    
    constructor(id, name, f, x, y) {
        super(id, name, f, x, y); // call the super class constructor and pass in the name parameter
    }
    
}

// Food object
class Food extends Entity{
    
    constructor(id, name, f, x, y) {
        super(id, name, f, x, y); // call the super class constructor and pass in the name parameter
    }
    
}


// Bonus object
class Bonus extends Entity{

    constructor(id, name, f, x, y) {
        super(id, name, f, x, y); // call the super class constructor and pass in the name parameter
    }
    
    
}


class GameGenerator {

    constructor(level){
        this.level = level
    }

    // randomly generates entity on the environment
    generate(env){
        
        var dim = env.dim;
        
        var id = 0;

        // generate obstacle
        var env_objects = [];
        for(var i = 0; i < this.level; i++){

            for(var f = 0; f < 6; f++){
                    
                var rnd_x = Math.floor((Math.random() * dim));
                var rnd_y = Math.floor((Math.random() * dim));
                
                let obs = new Obstacle(id, "rock", f, rnd_x, rnd_y);
                id++;
                env.environment[f].matrix[rnd_x][rnd_y] = obs;
                env_objects.push(obs);
                
            }
        }

        
        // generate food
        for(var f = 0; f < 6; f++){
                    
            var rnd_x = Math.floor((Math.random() * dim));
            var rnd_y = Math.floor((Math.random() * dim));

            if (env.environment[f].matrix[rnd_x][rnd_y] instanceof Cell){
                let food = new Food(id, "food", f, rnd_x, rnd_y);
                id++;
                env.environment[f].matrix[rnd_x][rnd_y] = food;
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
            if (env.environment[rnd_f].matrix[rnd_x][rnd_y] instanceof Cell){
                let bns = new Bonus(id, "bonus", rnd_f, rnd_x, rnd_y);
                id++;
                env.environment[rnd_f].matrix[rnd_x][rnd_y] = bns;
                env_objects.push(bns);
            }
                
        }

        this.env_objects = env_objects;

        // console.log('Obstacle: ' + this.obstacles);
        // console.log('Foods: ' + this.foods);
        // console.log('Bonus: ' + this.bonus);

         

    }
}

var env_dim = 10;
var game_level = 2;

let env = new Environment(env_dim);

let game = new GameGenerator(game_level);
game.generate(env);

console.log(env);






const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );






function degrees_to_radians(degrees)
{
  var pi = Math.PI;
  return degrees * (pi/180);
}

function abs_coords_to_rel_coords(coord, max){
    return coord - max/2;
}


offset = env_dim/2;
// offset = 0;

// enviroment
const face_material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
face_material.wireframe = true;

const face_geom = new THREE.PlaneGeometry(env_dim, env_dim);


const group = new THREE.Group();


const face_1 = new THREE.Mesh( face_geom, face_material );
face_1.position.set(offset, offset, offset);
face_1.rotation.set(degrees_to_radians(180), 0, 0);


const face_2 = new THREE.Mesh( face_geom, face_material );
face_2.position.set(offset + env_dim/2, offset, offset + env_dim/2);
face_2.rotation.set(0, degrees_to_radians(90), 0);

const face_3 = new THREE.Mesh( face_geom, face_material );
face_3.position.set(offset, offset + env_dim/2, offset + env_dim/2);
face_3.rotation.set(degrees_to_radians(90), degrees_to_radians(180), 0);

const face_4 = new THREE.Mesh( face_geom, face_material );
face_4.position.set(offset, offset - env_dim/2, offset + env_dim/2);
face_4.rotation.set(degrees_to_radians(90), 0, 0);

const face_5 = new THREE.Mesh( face_geom, face_material );
face_5.position.set(offset - env_dim/2, offset, offset + env_dim/2);
face_5.rotation.set(0, degrees_to_radians(270), 0);

const face_6 = new THREE.Mesh( face_geom, face_material );
face_6.position.set(offset, offset, offset + env_dim);



group.add(face_1);
group.add(face_2);
group.add(face_3);
group.add(face_4);
group.add(face_5);
group.add(face_6);


// objects
const obj_material = new THREE.MeshBasicMaterial( {color: 0xaaaf00, side: THREE.DoubleSide} );

// const food_geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
// const sphere = new THREE.Mesh( food_geometry, obj_material );
const food_geometry = new THREE.SphereGeometry( 0.5, 32, 32 );
            
for(var i = 0; i < game.env_objects.length; i++){
    obj = game.env_objects[i];
    console.log(obj);


    const sphere = new THREE.Mesh( food_geometry, obj_material );
    sphere.position.set(obj.x - env_dim/2, obj.y - env_dim/2, 0.5);

    switch (obj.face) {
        case 0:
            
            face_1.add(sphere);
            break;
        case 1:

            face_2.add(sphere);
            // sphere.position.set(offset, offset, offset - 0.5);
            break;
        case 2:

            face_3.add(sphere);
            break;
        case 3:

            face_4.add(sphere);
            break;
        case 4:

            face_5.add(sphere);
            break;
        case 5:

            face_6.add(sphere);
            break;
        
        default:
            break;
    }

            
}





// scene.add( sphere );



// const environment_geometry = new THREE.BoxGeometry(env_dim, env_dim, env_dim);
// const cube = new THREE.Mesh( environment_geometry, environment_material );
// // cube.position.set(-env_dim/2, -env_dim/2, -env_dim/2);
// // scene.add( cube );


// food_radius = 0.5;
// foods_position = env_dim + food_radius; 

// const food_material = new THREE.MeshBasicMaterial( { color: 0xaa4f23} );

// const food_geometry = new THREE.SphereGeometry( food_radius, 32, 32 );
// const sphere = new THREE.Mesh( food_geometry, food_material );
// // scene.add( sphere );


// group.position.set(env_dim/2, env_dim/2, env_dim/2);
// group.add( cube );
// group.add( sphere );
// scene.add( group );

// sphere.position.set(foods_position, 0, 0);

scene.add(group);


camera.position.z = 50;

const animate = function () {
    requestAnimationFrame( animate );

    group.rotation.x += 0.01;
    group.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();
        


