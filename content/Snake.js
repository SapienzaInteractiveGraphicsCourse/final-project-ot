"use strict"
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {makeAxisGridDebug} from "./utils.js";
import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
import {Entity} from "../engine/Entity.js";
import {Controller} from "../engine/Controller.js";
import {Config} from "../engine/Config.js";
import {Utilities} from "../engine/Utilities.js";
//import {dummyController} from "../index.js";


class SynchronousAnimations {
    #movement
    #rotations = []
    #direction

    constructor(movement = null, direction = null) {
        this.#movement = movement;
        this.#direction = direction;
    }

    addMovement(tween, direction) {
        this.#movement = tween;
        this.#direction = direction;
    }
    addRotation(tween) {
        this.#rotations.push(tween);
    }

    start() {
        this.#movement.start();
        this.#rotations.forEach((event) => {
            event.start();
        })
    }

    merge(events) {
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


    // Setters
    set direction(dir) {
        this.#direction = dir;
    }
}

// This class can be called as callback --> AVOID "THIS"!
class AnimationHandler {
    static eventQueue = []
    static currentEvents = null;
    //static lastEVents = null;

    //TODO REMOVE
    static UP = 0;
    static DOWN = 1;
    static LEFT = 2;
    static RIGHT = 3;


    static addMovement(tween, direction) {
        let evnt = AnimationHandler.getNextEvent()
        if (evnt === null) {
            evnt = new SynchronousAnimations(tween, direction);
            AnimationHandler.eventQueue.push(evnt);
        } else {
            evnt.addMovement(tween, direction);
        }
    }

    static addRotation(events) {
        for (let i = 0; i < events.length; i++) {
            if (i < AnimationHandler.eventQueue.length) {
                // Merging events
                AnimationHandler.eventQueue[i].merge(events[i]);
            } else {
                // There is no scheduled event
                AnimationHandler.eventQueue.push(events[i]);
            }
        }
    }

    static getNextEvent() {
        if (AnimationHandler.eventQueue.length === 0) return null;
        return AnimationHandler.eventQueue[0];
    }


    static startNextEvent() {
        if (AnimationHandler.eventQueue.length === 0) return null;
        AnimationHandler.currentEvents = AnimationHandler.eventQueue[0];
        AnimationHandler.eventQueue[0].start()
        AnimationHandler.eventQueue.shift()
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
        console.log(AnimationHandler.currentEvents)
        if (AnimationHandler.currentEvents === null) return null;
        return AnimationHandler.currentEvents.direction;
    }

    static getNextDirection() {
        if (AnimationHandler.eventQueue.length === 0) return null;
        return AnimationHandler.eventQueue[0].direction;
    }
}

class SnakeNode {
    x;
    y;
    z;
    container;
    mesh;
    direction;
    constructor(x,y,z, direction, geometry, material) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.direction = direction;

        this.container = new THREE.Object3D();
        this.mesh = new THREE.Mesh(geometry, material);
        this.container.add(this.mesh);
    }

    get_position() {
        const vector = [this.x, this.y, this.z];
        return [...vector];
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
    #headRadius = 0.8;
    #headSegments = 30;
    #headColor = 0x44aa88;

    #nodeRadius = .4;
    #nodeSegments = 30;
    #nodeColor = 0x23af11;

    #nodeDistance = 1;
    #nodeDimension = 0.8 * this.#nodeDistance ;

    #nodeGeometry;
    #nodeMaterial;

    #environment_direction


    movementTime = 0.8;


    head;
    nodes = [];
    nodesPositions = [];

    constructor(x=0,y=0,z=0, drawable, movable, erasable) {
        super(x, y, z, drawable, movable, erasable);
        /*----- Head -----*/

        this.x = x;
        this.y = y;
        this.z = z;



        /*----- Nodes -----*/
        //this.#nodeGeometry = new THREE.SphereGeometry(this.#nodeRadius, this.#nodeSegments, this.#nodeSegments);
        const dim = this.#nodeDimension;
        this.#nodeGeometry = new THREE.BoxGeometry(dim,dim,dim);
        this.#nodeMaterial = new THREE.MeshPhongMaterial({color: this.#nodeColor});


        /*---- Movement -----*/
        //this.#events = new AnimationHandler();
        this.mesh = null;
        this.draw();

        console.log(this);
    }

    draw() {
        if (this.drawable) {
            const dim = this.#nodeDimension;
            const geometry = new THREE.BoxGeometry(dim,dim,dim);
            const material = new THREE.MeshPhongMaterial({color: 0x44aa88});

            this.head = new SnakeNode(0,0,0,null,geometry,material);
            this.nodes[0] = this.head;
            this.mesh = this.head.container;

            makeAxisGridDebug(this.head.container, 'Snake Head Position');
            makeAxisGridDebug(this.head.mesh, 'Snake Head');
        }
    }

    addNode() {
        const tail = this.nodes[this.nodes.length -1];
        console.log("tail", tail);
        const pos = tail.get_position();
        pos[tail.direction.axis] -= tail.direction.sign;

        const node = new SnakeNode(pos[0],pos[1],pos[2],tail.direction,this.#nodeGeometry,this.#nodeMaterial);

        switch (tail.direction.axis) {
            case Config.DIRECTIONS.AXES.X:
                node.container.position.x -= tail.direction.sign * this.#nodeDistance;
                break;
            case Config.DIRECTIONS.AXES.Y:
                node.container.position.y -= tail.direction.sign * this.#nodeDistance;
                break;
            case Config.DIRECTIONS.AXES.Z:
                node.container.position.z -= tail.direction.sign * this.#nodeDistance;
                break;
        }

        tail.container.add(node.container);
        this.nodes.push(node);


        makeAxisGridDebug(node.container,"Snake Node Position#" + this.nodes.length);
        makeAxisGridDebug(node.mesh,"Snake Node#" + this.nodes.length);
    }



    /*----- Animation Handler ------*/

    move() {
        const nextEvent = AnimationHandler.getNextEvent();
        if (nextEvent !== null)
            AnimationHandler.startNextEvent();
        else {
            console.log("ERROR: Null Snake movement");
        }
    }

    add_movement(coordinates, direction) {
        if (this.head.direction !== null && (this.head.direction.axis !== direction.axis || this.head.direction.sign !== direction.sign))
            this.rotate(this.head.direction, direction);


        const render_coordinates = Utilities.world_to_render(coordinates);
        const target = {x: render_coordinates[0], y: render_coordinates[1], z: render_coordinates[2]};

        this.head.update_position(coordinates);
        this.head.update_direction(direction);

        const tween = new TWEEN.Tween(this.head.container.position).to(target,this.movementTime * 1000);
        tween.onComplete((twn) => {
            console.log(Controller.get_instance())
            Controller.get_instance().move_snake();
        });

        AnimationHandler.addMovement(tween, direction);
    }

    rotate(old_direction, new_direction) {

        function int_to_string_signed(int) {
            return int <= 0 ? "" + int : "+" + int;
        }

        const eventsList = [];
        for (let i = 1; i < this.nodes.length; i++) {
            const node_relative_pos = this.nodes[i].container.position;
            const delta_pos = [0,0,0];

            delta_pos[old_direction.axis] += old_direction.sign * this.#nodeDistance;
            delta_pos[new_direction.axis] -= new_direction.sign * this.#nodeDistance;

            const x = int_to_string_signed(delta_pos[0]);
            const y = int_to_string_signed(delta_pos[1]);
            const z = int_to_string_signed(delta_pos[2]);

            const translation = new TWEEN.Tween(node_relative_pos).to({x: x, y: y, z: z}, this.movementTime * 1000);

            const events = new SynchronousAnimations();
            events.addRotation(translation);
            eventsList.push(events);
        }
        AnimationHandler.addRotation(eventsList);
    }

    //TODO remove
    _moveToTarget(x, y, z, direction) {
        const target = {x: x, y: y, z: z};
        const tween = new TWEEN.Tween(this.head.position).to(target,this.movementTime * 1000);
        //tween.onComplete(dummyController);
        AnimationHandler.addMovement(tween, direction);
    }

    //TODO remove
    _rotate(x, y, z) {
        const eventsList = [];
        for (let i = 0; i < this.nodes.length - 1; i++) {

            const translation = new TWEEN.Tween(this.nodes[i+1].position).to({x: x, y: y, z: z}, this.movementTime * 1000);
            //const rotation = new TWEEN.Tween(this.nodes[i].children[0].rotation).to({x: '+0', y: '+2', z: +'+0'}, this.movementTime * 1000);

            const events = new SynchronousAnimations();
            events.addRotation(translation);
            //events.addRotation(rotation);

            eventsList.push(events);
        }
        AnimationHandler.addRotation(eventsList);
    }

    goDown() {
        const direction = AnimationHandler.getCurrentDirection();
        if (direction === AnimationHandler.UP){
            console.log("Direction forbidden: skipping command");
            return;
        }

        let x = '+0';
        let y = '+0';
        let z = '+' + (2*this.#nodeRadius + this.#nodeDistance);
        this._moveToTarget(x,y,z, AnimationHandler.DOWN);

        if (direction === AnimationHandler.LEFT) {
            x = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
        if (direction === AnimationHandler.RIGHT) {
            x = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
    }

    goUp() {
        const direction = AnimationHandler.getCurrentDirection();
        if (direction === AnimationHandler.DOWN){
            console.log("Direction forbidden: skipping command");
            return;
        }
        let x = '+0';
        let y = '+0';
        let z = '-' + (2*this.#nodeRadius + this.#nodeDistance);
        this._moveToTarget(x,y,z, AnimationHandler.UP);

        if (direction === AnimationHandler.LEFT) {
            x = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
        if (direction === AnimationHandler.RIGHT) {
            x = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
    }

    goLeft() {
        const direction = AnimationHandler.getCurrentDirection();
        if (direction === AnimationHandler.RIGHT){
            console.log("Direction forbidden: skipping command");
            return;
        }

        let x = '-' + (2*this.#nodeRadius + this.#nodeDistance);
        let y = '+0';
        let z = '+0';
        this._moveToTarget(x,y,z, AnimationHandler.LEFT);

        if (direction === AnimationHandler.UP) {
            x = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
        if (direction === AnimationHandler.DOWN) {
            x = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
    }

    goRight() {
        const direction = AnimationHandler.getCurrentDirection();
        if (direction === AnimationHandler.LEFT){
            console.log("Direction forbidden: skipping command");
            return;
        }

        let x = '+' + (2*this.#nodeRadius + this.#nodeDistance);
        let y = '+0';
        let z = '+0';
        this._moveToTarget(x,y,z, AnimationHandler.RIGHT);

        if (direction === AnimationHandler.UP) {
            x = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
        if (direction === AnimationHandler.DOWN) {
            x = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
    }

    /*----- Utils -----*/
    get_current_movement() {
        return AnimationHandler.getNextMovement();
    }
    get_current_direction() {
        return AnimationHandler.getCurrentDirection();
    }
    get_next_movement() {
        return AnimationHandler.getNextMovement();
    }
    get_next_direction() {
        return AnimationHandler.getNextDirection();
    }

}

//TESTS