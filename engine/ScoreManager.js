import {Config} from "./Config.js";
import * as THREE from "../resources/three.js-r129/build/three.module.js";
import {ModelLoader} from "./ModelLoader.js";
import {Utilities} from "./Utilities.js";
import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";

export class ScoreManager{

    get score() {
        return this._score;
    }

    _score;

    constructor() {
        this._score = Config.initial_score;

        this.read_score_configuration();

         this.local_score_mesh = null;
         this.total_score_mesh = null;
    }

    read_score_configuration(){
        this.multiplicator = Config.multiplicator;
        this.food_score = Config.food_score;
        this.bonus_score = Config.bonus_score;
        this.obstacle_score = Config.obstacle_score;
        this.snakenode_score = Config.snakenode_score;
    }

    update_score(hitted_object){


        let score = 0;
        switch (hitted_object.constructor.name) {
            case 'Food':
                score = this.food_score;
                break;

            case 'LuckyBonus':
            case 'ScoreBonus':
            case 'FastBonus':
            case 'InvincibilityBonus':
            case 'InvisibilityBonus':
            case 'Bonus':
                score = this.bonus_score;
                break;

            case 'ObstaclePart':
                score = this.obstacle_score;
                break;

            case 'SnakeNode':
                score = this.snakenode_score;
                break;
            default:
                console.log("Update score: not implemented exception", type.name);
                break;
        }

        this._score = this._score + this.multiplicator * score;

        // update mesh
        this.update_local_score_mesh( [hitted_object.x, hitted_object.y, hitted_object.z], score );
        this.update_total_score_mesh();



    }


    update_total_score_mesh() {

        const total_score_string = String(this.score); // print in front of the player

        // if (object_score === 0) return;

        /*------- Score bonus ------*/
        let geometry = new THREE.TextGeometry(total_score_string, {
            font: ModelLoader.get_instance().models[Config.current_texture_pack.textures.score.name],
            // size: Config.cell_cube_dim / 3,
            size : Config.cell_cube_dim * 2,
            height: 0.1
        });

        let material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF, transparent: true, opacity: 0.1 } );

        let score_mesh = new THREE.Mesh(geometry, material);
        score_mesh.position.set(0, 2, -10);

        this.total_score_mesh = score_mesh;



    }


    update_local_score_mesh(position, object_score){

        // if (object_score === 0) return;

        const object_score_string = String(object_score); // print on object location

        /*------- Score bonus ------*/
        let geometry = new THREE.TextGeometry(object_score_string, {
            font: ModelLoader.get_instance().models[Config.current_texture_pack.textures.score.name],
            // size: Config.cell_cube_dim / 3,
            size : Config.cell_cube_dim/3,
            height: 0.1
        });

        let material = new THREE.MeshBasicMaterial( { color: 0xFFC500, transparent: true, opacity: 1.0 } );

        let score_mesh = new THREE.Mesh(geometry, material);
        score_mesh.position.set(0, 1, 0);

        let container = new THREE.Object3D();

        container.add(score_mesh);

        let center_axis = Utilities.axis_from_world_coord(position[0], position[1], position[2]);
        center_axis = Utilities.direction_to_vector(center_axis);
        center_axis = new THREE.Vector3().fromArray(center_axis);

        let quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,-1,0), center_axis);
        container.setRotationFromQuaternion(quaternion);

        const render_pos = Utilities.world_to_render(position);
        container.position.set(render_pos[0], render_pos[1], render_pos[2]);

        this.local_score_mesh = container;


    }

    animate(){

        let content = this.local_score_mesh.children[0];

        let position = content.position;
        const delta = Config.cell_cube_dim/4;
        let target_position = { x: 0, y: position.y + delta, z: 0 }

        const tween_move = new TWEEN.Tween(position).to(target_position, 400);

        let scale = content.scale;
        let target_scale = { x: scale.x + delta * 2, y: scale.y + delta * 2, z: scale.z + delta * 2}

        const tween_scale = new TWEEN.Tween(scale).to(target_scale, 400);

        const tween_erase = new TWEEN.Tween( content.material ).to({ opacity: 0 }, 350).start();

        tween_erase.start();
        tween_move.start();
        tween_scale.start();
    }

}

