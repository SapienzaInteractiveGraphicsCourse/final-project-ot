export class CoordinateGenerator{
    
    #available_coordinates;
    #unavailable_coordinates;

    constructor(w, h, d){
        
        this.w = w;
        this.h = h;
        this.d = d;

        this.#available_coordinates = {};
        for(var i = 0; i < w; i++){
            for(var j = 0; j < h; j++){
                for(var k = 0; k < d; k++){
                    var index = (w * h) * i + h * j + k; 
                    this.#available_coordinates[index] = [i, j, k];
                }
            }
        }

        this.#unavailable_coordinates = {};

    }

    is_available(x, y, z){
        if(this.#get_available_coordinates(x, y, z) == null) return false;
        else return true;
    }

    is_unavailable(x, y, z){
        if(this.#get_unavailable_coordinates(x, y, z) == null) return false;
        else return true;
    }

    // return true if the coordinates are inside the environment
    // return false otherwise 
    check_coords_consistency(x, y, z){
        
        var w = this.w;
        var h = this.h;
        var d = this.d;

        if( x >= 0 && x < w && y >= 0 && y < h && z >= 0 && z < d) return true;
        else return false;
    }


    // return true if the coordinates are inside the environment
    // return false otherwise 
    check_index_consistency(index){

        var max = this.w * this.h * this.d;
        
        if( index >= 0 && index < max) return true;
        else return false;
    }

    remove_available_index(index){
        var source = this.#available_coordinates[index];
        var entry = Object.assign({}, source);
        this.#unavailable_coordinates[index] = entry;
        delete this.#available_coordinates[index];
    }

    remove_available_coordinate(x, y, z){

        if(!this.check_coords_consistency(x, y, z)) return;
        
        var index = (this.w * this.h * x ) + ( this.h * y ) + z; 
        this.remove_available_index(index);

    }

    
    add_available_index(index){

        if(!this.check_index_consistency(index)) return;

        var source = this.#unavailable_coordinates[index];
        var entry = Object.assign({}, source);
        this.#available_coordinates[index] = entry;
        delete this.#unavailable_coordinates[index];

    }

    add_available_coordinate(x, y, z){

        if(!this.check_coords_consistency(x, y, z)) return;

        var index = (this.w * this.h * x ) + ( this.h * y ) + z; 
        this.add_available_index(index);
        
    }

    // return a copy
    #get_available_index(index){

        if(!this.check_index_consistency(index)) return null;

        var source = this.#available_coordinates[index];
        const out = Object.assign({}, source);
        return out;
    }

    // return a copy
    #get_unavailable_index(index){

        if(!this.check_index_consistency(index)) return null;

        var source = this.#unavailable_coordinates[index];
        const out = Object.assign({}, source);
        return out;
    }


    #get_available_coordinates(x, y, z){
        
        if(!this.check_coords_consistency(x, y, z)) return null;
        
        var index = (this.w * this.h * x ) + ( this.h * y ) + z; 
        return this.#get_available_index(index);
    }


    #get_unavailable_coordinates(x, y, z){
        
        if(!this.check_coords_consistency(x, y, z)) return null;
        
        var index = (this.w * this.h * x ) + ( this.h * y ) + z; 
        return this.#get_unavailable_index(index);
    }

    // return a copy
    get_random_available(){
        var keys = Object.keys(this.#available_coordinates);
        var total_coords = keys.length;
        var rnd_keys_index = Math.floor(Math.random() * total_coords);
        var random_key = keys[rnd_keys_index]

        return this.#get_available_index(random_key);
        
    }


    // return a copy
    get_random_unavailable(){
        var keys = Object.keys(this.#unavailable_coordinates);
        var total_coords = keys.length;
        var rnd_keys_index = Math.floor(Math.random() * total_coords);
        var random_key = keys[rnd_keys_index]

        return this.#get_unavailable_index(random_key);
        
    }

    get_and_remove_available(index){
        const out = this.#get_available_index(index);
        this.remove_available_index(index);
        return out;
    }

    get_and_remove_random_available(){
        const out = this.get_random_available();
        this.remove_available_coordinate(out[0], out[1], out[2]);
        return out;

    }

    #get_available_dict(){
        return this.#available_coordinates;
    }


    #get_not_available_dict(){
        return this.#unavailable_coordinates;
    }

    get_availabe_num(){
        return Object.keys(this.#available_coordinates).length;
    }

    get_unavailabe_num(){
        return Object.keys(this.#unavailable_coordinates).length;
    }

}


// TEST 
// var width = 10, height = 10, depth = 10, space = 2;
// let cg = new CoordinateGenerator(width, height, depth);


// console.log("available len ",Object.keys(cg.get_available_dict()).length);
// console.log("unavailable len ", Object.keys(cg.get_not_available_dict()).length);

// // generate core obstacles
// for(var i = space; i < width - space; i++){
            
//     for(var j = space; j < height - space; j++){
            
//         for(var k = space; k < depth - space; k++){
//             cg.remove_available_coordinate(i, j, k);       
//         }
//     }   
// }


// console.log("available len ",Object.keys(cg.get_available_dict()).length);
// console.log("unavailable len ", Object.keys(cg.get_not_available_dict()).length);

// for(var i = 0; i < 5 ; i ++){

//     console.log(cg.get_and_remove_random_available());

// }

// console.log("available len ",Object.keys(cg.get_available_dict()).length);
// console.log("unavailable len ", Object.keys(cg.get_not_available_dict()).length);


// for(var i = 0; i < 5 ; i ++){

//     console.log("cg.get_random_unavailable()", cg.get_random_unavailable());

// }


