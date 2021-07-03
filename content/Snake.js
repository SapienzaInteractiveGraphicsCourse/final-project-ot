"use strict"
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {makeAxisGridDebug} from "./utils.js";
import {TWEEN} from "../resources/three.js-r129/examples/jsm/libs/tween.module.min.js";
import {dummyController} from "../index.js";


class SynchronousEvents {
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
export class EventHandler {
    static eventQueue = []
    static currentEvents = null;

    static UP = 0;
    static DOWN = 1;
    static LEFT = 2;
    static RIGHT = 3;


    static addMovement(tween, direction) {
        let evnt = EventHandler.getNextEvent()
        if (evnt === null) {
            evnt = new SynchronousEvents(tween, direction);
            EventHandler.eventQueue.push(evnt);
        } else {
            evnt.addMovement(tween, direction);
        }
    }

    static addRotation(events) {
        for (let i = 0; i < events.length; i++) {
            if (i < EventHandler.eventQueue.length) {
                // Merging events
                EventHandler.eventQueue[i].merge(events[i]);
            } else {
                // There is no scheduled event
                EventHandler.eventQueue.push(events[i]);
            }
        }
    }

    static getNextEvent() {
        if (EventHandler.eventQueue.length === 0) return null;
        return EventHandler.eventQueue[0];
    }


    static startNextEvent() {
        if (EventHandler.eventQueue.length === 0) return null;
        EventHandler.currentEvents = EventHandler.eventQueue[0];
        EventHandler.eventQueue[0].start()
        EventHandler.eventQueue.shift()
    }

    static getCurrentDirection() {
        if (EventHandler.currentEvents === null) return null;
        return EventHandler.currentEvents.direction;
    }
}

export class Snake {
    #headRadius = 1.2;
    #headSegments = 30;
    #headColor = 0x44aa88;

    #nodeRadius = 1.2;
    #nodeSegments = 30;
    #nodeColor = 0x23af11;
    #nodeDistance = 0.8;

    #nodeGeometry;
    #nodeMaterial;

    #events

    movementTime = 0.8;

    head
    nodes = []


    constructor(x=0,y=0,z=0) {
        /*----- Head -----*/
        const geometry = new THREE.SphereGeometry(this.#headRadius, this.#headSegments, this.#headSegments);
        const material = new THREE.MeshPhongMaterial({color: this.#headColor});
        const head = new THREE.Mesh(geometry, material);
        const headPosition = new THREE.Object3D();
        headPosition.add(head);
        this.head = headPosition
        this.nodes[0] = headPosition;

        makeAxisGridDebug(headPosition, 'Snake Head Position');
        makeAxisGridDebug(head, 'Snake Head');

        head.position.x = x;
        head.position.y = y;
        head.position.z = z;

        /*----- Nodes -----*/
        this.#nodeGeometry = new THREE.SphereGeometry(this.#nodeRadius, this.#nodeSegments, this.#nodeSegments);
        this.#nodeMaterial = new THREE.MeshPhongMaterial({color: this.#nodeColor});


        /*---- Movement -----*/
        //this.#events = new EventHandler();

    }


    addNode() {
        const nodePosition = new THREE.Object3D();
        const node = new THREE.Mesh(this.#nodeGeometry, this.#nodeMaterial);
        nodePosition.add(node);

        makeAxisGridDebug(nodePosition,"Snake Node Position#" + this.nodes.length);
        makeAxisGridDebug(node,"Snake Node#" + this.nodes.length);

        nodePosition.position.x = 2 * this.#nodeRadius + this.#nodeDistance;

        this.nodes[this.nodes.length -1].add(nodePosition);
        this.nodes.push(nodePosition);
    }



    /*----- Animation Handler ------*/

    start(events) {
        const nextEvent = EventHandler.getNextEvent();
        if (nextEvent !== null)
            EventHandler.startNextEvent();
        else {
            this._moveToTarget('+5','+0','+0')
        }
    }

    _moveToTarget(x, y, z, direction) {
        const target = {x: x, y: y, z: z};
        const tween = new TWEEN.Tween(this.head.position).to(target,this.movementTime * 1000);
        tween.onComplete(dummyController);
        EventHandler.addMovement(tween, direction);
    }

    _rotate(x, y, z) {
        const eventsList = [];
        for (let i = 0; i < this.nodes.length - 1; i++) {

            const translation = new TWEEN.Tween(this.nodes[i+1].position).to({x: x, y: y, z: z}, this.movementTime * 1000);
            const rotation = new TWEEN.Tween(this.nodes[i].children[0].rotation).to({x: '+0', y: '+2', z: +'+0'}, this.movementTime * 1000);

            const events = new SynchronousEvents();
            events.addRotation(translation);
            events.addRotation(rotation);

            eventsList.push(events);
        }
        EventHandler.addRotation(eventsList);
    }

    goDown() {
        const direction = EventHandler.getCurrentDirection();
        if (direction === EventHandler.UP){
            console.log("Direction forbidden: skipping command");
            return;
        }

        let x = '+0';
        let y = '+0';
        let z = '+' + (2*this.#nodeRadius + this.#nodeDistance);
        this._moveToTarget(x,y,z, EventHandler.DOWN);

        if (direction === EventHandler.LEFT) {
            x = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
        if (direction === EventHandler.RIGHT) {
            x = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
    }

    goUp() {
        const direction = EventHandler.getCurrentDirection();
        if (direction === EventHandler.DOWN){
            console.log("Direction forbidden: skipping command");
            return;
        }
        let x = '+0';
        let y = '+0';
        let z = '-' + (2*this.#nodeRadius + this.#nodeDistance);
        this._moveToTarget(x,y,z, EventHandler.UP);

        if (direction === EventHandler.LEFT) {
            x = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
        if (direction === EventHandler.RIGHT) {
            x = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
    }

    goLeft() {
        const direction = EventHandler.getCurrentDirection();
        if (direction === EventHandler.RIGHT){
            console.log("Direction forbidden: skipping command");
            return;
        }

        let x = '-' + (2*this.#nodeRadius + this.#nodeDistance);
        let y = '+0';
        let z = '+0';
        this._moveToTarget(x,y,z, EventHandler.LEFT);

        if (direction === EventHandler.UP) {
            x = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
        if (direction === EventHandler.DOWN) {
            x = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
    }

    goRight() {
        const direction = EventHandler.getCurrentDirection();
        if (direction === EventHandler.LEFT){
            console.log("Direction forbidden: skipping command");
            return;
        }

        let x = '+' + (2*this.#nodeRadius + this.#nodeDistance);
        let y = '+0';
        let z = '+0';
        this._moveToTarget(x,y,z, EventHandler.RIGHT);

        if (direction === EventHandler.UP) {
            x = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
        if (direction === EventHandler.DOWN) {
            x = '-' + (2*this.#nodeRadius + this.#nodeDistance);
            y = '+0';
            z = '+' + (2*this.#nodeRadius + this.#nodeDistance);
            this._rotate(x,y,z);
        }
    }

    /*----- Utils -----*/
    updatePosition(x,y,z) {
        this.head.position.x = x;
        this.head.position.y = y;
        this.head.position.z = z;
    }

    // Getters


    // Setters

}

//TESTS