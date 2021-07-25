export class CoordinateManager {
    get available_coordinates() {
        return this._available_coordinates;
    }

    get unavailable_coordinates() {
        return this._unavailable_coordinates;
    }

    
    _available_coordinates;
    _unavailable_coordinates;

    constructor(w, h, d){
        
        this.w = w;
        this.h = h;
        this.d = d;

        this._available_coordinates = {};
        for(let i = 0; i < w; i++){
            for(let j = 0; j < h; j++){
                for(let k = 0; k < d; k++){
                    const index = (w * h) * i + h * j + k;
                    this._available_coordinates[index] = [i, j, k];
                }
            }
        }

        this._unavailable_coordinates = {};

    }

    is_available(x, y, z){
        return this.#get_available_coordinates(x, y, z) != null;
    }

    is_unavailable(x, y, z){
        return this.#get_unavailable_coordinates(x, y, z) != null;
    }

    // return true if the coordinates are inside the environment
    // return false otherwise 
    check_coords_consistency(x, y, z){

        const w = this.w;
        const h = this.h;
        const d = this.d;

        return x >= 0 && x < w && y >= 0 && y < h && z >= 0 && z < d;
    }


    // return true if the coordinates are inside the environment
    // return false otherwise 
    check_index_consistency(index){

        const max = this.w * this.h * this.d;

        return index >= 0 && index < max;
    }

    remove_available_index(index){
        const source = this._available_coordinates[index];
        this._unavailable_coordinates[index] = Object.assign({}, source);
        delete this._available_coordinates[index];
    }

    remove_available_coordinate(x, y, z){

        if(!this.check_coords_consistency(x, y, z)) return;

        const index = (this.w * this.h * x) + (this.h * y) + z;
        this.remove_available_index(index);

    }

    
    add_available_index(index){

        if(!this.check_index_consistency(index)) return;

        const source = this._unavailable_coordinates[index];
        this._available_coordinates[index] = Object.assign({}, source);
        delete this._unavailable_coordinates[index];

    }

    add_available_coordinate(x, y, z){

        if(!this.check_coords_consistency(x, y, z)) return;

        const index = (this.w * this.h * x) + (this.h * y) + z;
        this.add_available_index(index);
        
    }

    // return a copy
    #get_available_index(index){

        if(!this.check_index_consistency(index)) return null;

        const source = this._available_coordinates[index];
        return Object.assign({}, source);
    }

    // return a copy
    #get_unavailable_index(index){

        if(!this.check_index_consistency(index)) return null;

        const source = this._unavailable_coordinates[index];
        return Object.assign({}, source);
    }


    #get_available_coordinates(x, y, z){
        
        if(!this.check_coords_consistency(x, y, z)) return null;

        const index = (this.w * this.h * x) + (this.h * y) + z;
        return this.#get_available_index(index);
    }


    #get_unavailable_coordinates(x, y, z){
        
        if(!this.check_coords_consistency(x, y, z)) return null;

        const index = (this.w * this.h * x) + (this.h * y) + z;
        return this.#get_unavailable_index(index);
    }

    // return a copy
    get_random_available(){
        const keys = Object.keys(this._available_coordinates);
        const total_coords = keys.length;
        const rnd_keys_index = Math.floor(Math.random() * total_coords);
        const random_key = keys[rnd_keys_index];

        return this.#get_available_index(random_key);
        
    }


    // return a copy
    get_random_unavailable(){
        const keys = Object.keys(this._unavailable_coordinates);
        const total_coords = keys.length;
        const rnd_keys_index = Math.floor(Math.random() * total_coords);
        const random_key = keys[rnd_keys_index];

        return this.#get_unavailable_index(random_key);
        
    }

}
