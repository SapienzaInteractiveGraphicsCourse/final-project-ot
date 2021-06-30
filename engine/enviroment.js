class Environment{

    constructor(dim){
        this.dim = dim;

        let mat_1 = new Matrix(dim, dim);
        let mat_2 = new Matrix(dim, dim);
        let mat_3 = new Matrix(dim, dim);
        let mat_4 = new Matrix(dim, dim);
        let mat_5 = new Matrix(dim, dim);
        let mat_6 = new Matrix(dim, dim);

        // left, right, up, down

        mat_1.collate(mat_5, mat_2, mat_3, mat_4);
        mat_6.collate(mat_2, mat_5, mat_3, mat_4);

        mat_2.collate(mat_1, mat_6, mat_3, mat_4);
        mat_5.collate(mat_6, mat_1, mat_3, mat_4);

        mat_3.collate(mat_5, mat_2, mat_6, mat_1);
        mat_4.collate(mat_5, mat_2, mat_6, mat_1);

        this.environment = [mat_1, mat_2, mat_3, mat_4, mat_5, mat_6];
        
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
        var obstacles = [];
        for(var i = 0; i < this.level; i++){

            for(var f = 0; f < 6; f++){
                    
                var rnd_x = Math.floor((Math.random() * dim));
                var rnd_y = Math.floor((Math.random() * dim));
                
                let obs = new Obstacle(id, "rock", f, rnd_x, rnd_y);
                id++;
                env.environment[f].matrix[rnd_x][rnd_y] = obs;
                obstacles.push(obs);
                
            }
        }

        this.obstacles = obstacles;
        
        // generate food
        var foods = [];
        for(var f = 0; f < 6; f++){
                    
            var rnd_x = Math.floor((Math.random() * dim));
            var rnd_y = Math.floor((Math.random() * dim));

            if (env.environment[f].matrix[rnd_x][rnd_y] instanceof Cell){
                let food = new Food(id, "food", f, rnd_x, rnd_y);
                id++;
                env.environment[f].matrix[rnd_x][rnd_y] = food;
                foods.push(food);
            }else{
                f = f - 1;
            }
              
        }

        this.foods = foods;
        

        // generate bonus
        var bonus = [];
        if(Math.random() > 0.5){
            var rnd_f = Math.floor(Math.random() * 6);
            var rnd_x = Math.floor((Math.random() * dim));
            var rnd_y = Math.floor((Math.random() * dim));
            if (env.environment[rnd_f].matrix[rnd_x][rnd_y] instanceof Cell){
                let bns = new Bonus(id, "bonus", rnd_f, rnd_x, rnd_y);
                id++;
                env.environment[rnd_f].matrix[rnd_x][rnd_y] = bns;
                bonus.push(bns);
            }
                
        }

        this.bonus = bonus;

        // console.log('Obstacle: ' + this.obstacles);
        // console.log('Foods: ' + this.foods);
        // console.log('Bonus: ' + this.bonus);

         

    }
}

let env = new Environment(5);

let game = new GameGenerator(1);
game.generate(env);

console.log(env);
