"use strict"
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
import {Entity} from "./Entity.js";
import {Controller} from "./Controller.js";
import {Config} from "./Config.js";
import {Utilities} from "./Utilities.js";

/*
 * An instance of this class contains all the animations (movement, rotations, and generic animations) that should be started together.
 */
class SynchronousAnimations {
    #movement;
    #spawn = null;
    #rotations = [];
    #animations = [];
    #direction;

    constructor(movement = null, direction = null) {
        this.#movement = movement;
        this.#direction = direction;
    }

    /* Add snake translation */
    addMovement(tween, direction) {
        this.#movement = tween;
        this.#direction = direction;
    }

    /* Add snake node spawn */
    addSpawn(id, tween) {
        this.#spawn = {id: id, tween: tween};
    }

    /* Add snake node rotation */
    addRotation(id, tween) {
        this.#rotations.push({id: id, tween: tween});
    }

    /* Add snake node animation */
    addAnimation(id, tween) {
        this.#animations.push({id: id, tween: tween});
    }

    /* Start all the events: translation, rotations, animations */
    start() {
        this.#movement.start();

        let spawn_id = -1;
        if (this.#spawn !== null){
            spawn_id = this.#spawn.id;
            this.#spawn.tween.start();
        }
        this.#rotations.forEach((rotation) => {
            // Skip all the rotations of a spawning node
            if (rotation !== null && rotation.id !== spawn_id)
                rotation.tween.start();
        })

        this.#animations.forEach((animation) => {
            if (animation !== null)
                animation.tween.start();
        })
    }

    /* Merge two synchronous events into a single one */
    merge(events) {
        if (events.spawn !== null)
            this.#spawn = events.spawn;
        events.rotations.forEach((event) => {
            this.#rotations.push(event);
        })
    }

    // Getters
    get movement() {
        return this.#movement;
    }
    get rotations() {
        return this.#rotations;
    }
    get direction() {
        return this.#direction;
    }
    get spawn() {
        return this.#spawn;
    }
    // Setters
    set direction(dir) {
        this.#direction = dir;
    }
}

/*
 *  It handles the animations queue. Each entry of the queue is an instance of SynchronousAnimations.
 */
class AnimationHandler {
    static eventQueue = []
    static currentEvents = null;

    /*
    * Add a translation to the next event in the queue.
    * If the queue is empty create a new SynchronousAnimations
    * Input: The tween animation and the direction of the movement.
    * Output: -
    */
    static addMovement(tween, direction) {
        let evnt = AnimationHandler.getNextEvent()
        if (evnt === null) {
            evnt = new SynchronousAnimations(tween, direction);
            AnimationHandler.eventQueue.push(evnt);
        } else {
            evnt.addMovement(tween, direction);
        }
    }


    /*
    * Adds multiple SynchronousAnimations to the queue starting from the beginning.
    * If the i-th position of the queue is occupied the old and new SynchronousAnimations are merged.
    * Input: list[SynchronousAnimations]
    * Output: -
    */
    static addEvents(events) {
        for (let i = 0; i < events.length; i++) {
            if (i < AnimationHandler.eventQueue.length) {
                // Merging events
                AnimationHandler.eventQueue[i].merge(events[i]);
            } else {
                // There is no scheduled event, adding to the end of the queue
                AnimationHandler.eventQueue.push(events[i]);
            }
        }
    }

    /* AddEvents wrapper */
    static addRotation(events) {
        AnimationHandler.addEvents(events);
    }

    /* Start the next event in the queue and pop it out. */
    static startNextEvent() {
        if (AnimationHandler.eventQueue.length === 0) return null;
        AnimationHandler.currentEvents = AnimationHandler.eventQueue[0];
        AnimationHandler.eventQueue[0].start()
        AnimationHandler.eventQueue.shift()
    }

    static getNextEvent() {
        if (AnimationHandler.eventQueue.length === 0) return null;
        return AnimationHandler.eventQueue[0];
    }

    static getLastEvent() {
        if (AnimationHandler.eventQueue.length === 0) return null;
        return AnimationHandler.eventQueue[AnimationHandler.eventQueue.length-1];
    }

    static getCurrentMovement() {
        if (AnimationHandler.currentEvents === null) return null;
        return AnimationHandler.currentEvents.movement;
    }

    static getNextMovement() {
        if (AnimationHandler.eventQueue.length === 0) return null;
        return AnimationHandler.eventQueue[0].movement;
    }

    static getCurrentDirection() {
        if (AnimationHandler.currentEvents === null) return null;
        return AnimationHandler.currentEvents.direction;
    }

    static getNextDirection() {
        if (AnimationHandler.eventQueue.length === 0) return null;
        return AnimationHandler.eventQueue[0].direction;
    }
}



export class SnakeNode{
    id;
    x;
    y;
    z;
    container;
    mesh;
    direction;
    spawned;
    constructor(id, x,y,z, direction, geometry, material) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.direction = direction;

        this.container = new THREE.Object3D();
        this.mesh = new THREE.Mesh(geometry, material);
        this.container.add(this.mesh);
        this.spawned = false;
    }

    get_position() {
        const vector = [this.x, this.y, this.z];
        return [...vector];
    }

    get_direction() {
        return {...this.direction};
    }

    update_position(coordinates) {
        this.x = coordinates[0];
        this.y = coordinates[1];
        this.z = coordinates[2];
    }

    update_direction(direction) {
        this.direction = direction;
    }

}


export class Snake extends Entity{
    #nodeColor = 0x23af11;

    // Distance between each node
    #nodeDistance;
    #nodeDimension;

    // Every node (except the head) has the same geometry and material
    #nodeGeometry;
    #nodeMaterial;

    speed;

    head;
    nodes = [];
    nodesPositions = [];

    constructor(x=0,y=0,z=0, drawable, movable, erasable) {
        super(x, y, z, drawable, movable, erasable);

        /*---- Configuration -----*/
        this.speed = Config.snake_speed;
        this.#nodeDistance = Config.snake_nodes_distance;
        this.#nodeDimension = Config.static_nodes_dimension * this.#nodeDistance;


        /*----- Position -----*/
        this.x = x;
        this.y = y;
        this.z = z;


        /*----- Nodes -----*/
        const dim = this.#nodeDimension;
        this.#nodeGeometry = new THREE.BoxGeometry(dim,dim,dim);
        this.#nodeMaterial = new THREE.MeshPhongMaterial({color: this.#nodeColor});


        /*---- Movement -----*/
        this.mesh = null;
        this.draw();

    }

    /* Draw the head */
    draw() {
        if (this.drawable) {
            const dim = this.#nodeDimension;
            const geometry = new THREE.BoxGeometry(dim,dim,dim);
            const material = new THREE.MeshPhongMaterial({color: 0x44aa88});

            // The position and orientation will be updated at the first movement
            this.head = new SnakeNode(0,this.x,this.y,this.z,null, geometry, material);
            this.head.spawned = true;
            this.nodes[0] = this.head;
            this.mesh = this.head.container;

            const render_pos = Utilities.world_to_render(this.x, this.y, this.z);
            this.head.container.position.set(render_pos[0], render_pos[1], render_pos[2]);

            Utilities.makeAxisGridDebug(this.head.container, 'Snake Head Position');
            Utilities.makeAxisGridDebug(this.head.mesh, 'Snake Head');
        }
    }

    add_node() {
        const eventsList = [];

        // Previous nodes animation
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            if (!node.spawned) continue;

            const node_mesh = node.mesh;
            const small = new THREE.Vector3(1,1,1);
            const big = new THREE.Vector3(1.5,1.5,1.5);

            const upscale = new TWEEN.Tween(node_mesh.scale).to(big, this.speed / 2);
            const downscale = new TWEEN.Tween(node_mesh.scale).to(small, this.speed / 2);
            upscale.chain(downscale);

            const events = new SynchronousAnimations();
            events.addAnimation(node.id, upscale);
            eventsList.push(events);
        }

        /*----- Creating a new invisible node -----*/

        const node_id = this.nodes.length;

        // Setting the position behind the last node
        const tail = this.nodes[this.nodes.length -1];
        const pos = tail.get_position();
        pos[tail.direction.axis] -= tail.direction.sign;
        const node = new SnakeNode(node_id,pos[0],pos[1],pos[2],tail.direction,this.#nodeGeometry,this.#nodeMaterial);

        // Setting scale to 0 and adding it to the hierarchical model and the nodes list.
        node.mesh.scale.set(0,0,0);
        tail.container.add(node.container);
        this.nodes.push(node);


        /*----- Scheduling repositioning and resizing -----*/
        const nodes = this.nodes;
        const tween = new TWEEN.Tween(node.mesh.scale).to({x: 1, y: 1, z: 1}, this.speed / 2);
        tween.onStart((twn) => {
            let tail;
            for (let i = nodes.length - 1; i>=0; i--){
                // The tail is the last SPAWNED node
                if (nodes[i].spawned) {
                    tail = nodes[i];
                    break;
                }
            }

            // Updating position and orientation
            const pos = tail.get_position();
            pos[tail.direction.axis] -= tail.direction.sign;
            node.update_position(pos);
            node.update_direction(tail.direction);


            // Moving the node behind the tail
            node.container.position.set(0,0,0);
            switch (tail.direction.axis) {
                case Config.DIRECTIONS.AXES.X:
                    node.container.position.x = -tail.direction.sign * this.#nodeDistance;
                    break;
                case Config.DIRECTIONS.AXES.Y:
                    node.container.position.y = -tail.direction.sign * this.#nodeDistance;
                    break;
                case Config.DIRECTIONS.AXES.Z:
                    node.container.position.z = -tail.direction.sign * this.#nodeDistance;
                    break;
            }

            node.spawned = true;
       });

        const events = new SynchronousAnimations();
        events.addSpawn(node.id, tween);
        eventsList.push(events);
        AnimationHandler.addEvents(eventsList);

        Utilities.makeAxisGridDebug(node.container,"Snake Node Position#" + this.nodes.length);
        Utilities.makeAxisGridDebug(node.mesh,"Snake Node#" + this.nodes.length);
    }



    /*----- Animation Handler ------*/

    /* Start the next animations block */
    move() {
        const nextEvent = AnimationHandler.getNextEvent();
        if (nextEvent !== null) {
            AnimationHandler.startNextEvent();
        }
        else {
            console.log("ERROR: Null Snake movement");
        }
    }

    /*
    * Schedule a new translation.
    * Input: new coordinates list[x,y,z], new direction{axis,sign}
    * Output: -
    */
    add_movement(coordinates, direction) {
        // If the new direction and the current one are different -> perform a rotation
        if (this.head.direction !== null && (this.head.direction.axis !== direction.axis || this.head.direction.sign !== direction.sign))
            this.rotate(this.head.direction, direction);

        // Updating the head position
        this.head.update_position(coordinates);
        this.head.update_direction(direction);
        this.update_nodes_position();

        // Converting and setting the coordinates
        const render_coordinates = Utilities.world_to_render(coordinates);
        const target = {x: render_coordinates[0], y: render_coordinates[1], z: render_coordinates[2]};
        const tween = new TWEEN.Tween(this.head.container.position).to(target,this.speed);

        // Ask to the controller a new movement after the end
        tween.onComplete((twn) => {Controller.get_instance().move_snake();});

        AnimationHandler.addMovement(tween, direction);

    }

    /* Perform a rotation for each node */
    rotate(old_direction, new_direction) {

        function int_to_string_signed(int) {
            return int <= 0 ? "" + int : "+" + int;
        }

        const eventsList = [];
        for (let i = 1; i < this.nodes.length; i++) {
            const node = this.nodes[i];

            const node_relative_pos = node.container.position;
            const delta_pos = [0,0,0];

            delta_pos[old_direction.axis] += old_direction.sign * this.#nodeDistance;
            delta_pos[new_direction.axis] -= new_direction.sign * this.#nodeDistance;

            const x = int_to_string_signed(delta_pos[0]);
            const y = int_to_string_signed(delta_pos[1]);
            const z = int_to_string_signed(delta_pos[2]);

            const rotation = new TWEEN.Tween(node_relative_pos).to({x: x, y: y, z: z}, this.speed).onStart((twn) => {
                node.update_direction(new_direction);
            });

            const events = new SynchronousAnimations();
            events.addRotation(node.id,rotation);
            eventsList.push(events);
        }
        AnimationHandler.addRotation(eventsList);
    }

    //TODO Destroy


    update_nodes_position() {
        //TODO remove
        //console.log("head pos-dir", this.head.get_position(),this.head.get_direction());

        for (let i = 1; i < this.nodes.length; i++){
            const node = this.nodes[i];
            let pos = new THREE.Vector3();
            node.mesh.getWorldPosition(pos);
            pos = Utilities.render_to_world(pos.x, pos.y, pos.z);
            node.update_position(pos);
            //console.log("node pos-dir",i,node.spawned, node.get_position(),node.get_direction());
        }
    }


    /*----- Utils -----*/
    get_nodes_position(only_spawned = true) {
        const pos = []
        for (let i = 0; i<this.nodes.length; i++) {
            const node = this.nodes[i];
            if (only_spawned && !node.spawned) continue;
            pos.push(this.nodes[i].get_position());
        }
        return pos;
    }
    get_current_direction() {
        return this.head.direction;
    }
    get_node(index) {
        return this.nodes[index];
    }
    get_current_movement() {
        return AnimationHandler.getNextMovement();
    }
    get_next_movement() {
        return AnimationHandler.getNextMovement();
    }
    get_next_direction() {
        return AnimationHandler.getNextDirection();
    }


}