class Environment{

    constructor(width, height, depth){
        
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.env = []

        for(var d = 0; d < depth; d++){
            var mat = [];
            for(var i = 0; i < width; i++){
                var row = [];
                for(var j = 0; j < height; j++){
                    let c = new Cell(i*width + j);
                    row.push(c);
                }
            mat.push(row);            
            }
        this.env.push(mat);
        }
    }

}

class Cell{
    constructor(name){
        this.name = name
    }
}


// Gneric object in the environment
class Entity {
    constructor(id, name){
        this.id = id;
        this.name = name;
    }
}

// Obstacle object
class Obstacle extends Entity{
    
}

// Player object 
class Player extends Entity{
    
}

// Gift object
class Gift extends Entity{
    
}

class GameGenerator {

    constructor(level){
        this.level = level
    }

    // randomly generates entity on the environment
    generate(env){
        
        var w = env.width;
        var h = env.height;
        var d = env.depth;


        for(var i = 0; i < this.level; i++){
            var random_d = Math.floor((Math.random() * d));
            var random_w = Math.floor((Math.random() * w)); 
            var random_h = Math.floor((Math.random() * h));

            let obs = new Obstacle(1, "rock");
            env.env[random_d][random_w][random_h] = obs;
        }
 

        console.log(random_w + " " + random_h);

    }
}

let env = new Environment(3, 3, 10);
console.log(env);

let game = new GameGenerator(10);
game.generate(env);

console.log(env);
