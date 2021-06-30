"use strict"
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {makeAxisGridDebug} from "./utils.js";

class snakeNode {
    geometry;
    texture;
    mesh;


}

export class Snake {
    #headRadius = 1.5;
    #headSegments = 30;
    #headColor = 0x44aa88;

    #nodeRadius = 1.5;
    #nodeSegments = 30;
    #nodeColor = 0x23af11;

    #nodeGeometry;
    #nodeMaterial;

    head
    nodes = []

    constructor(x=0,y=0,z=0) {
        /*----- Head -----*/
        const geometry = new THREE.SphereGeometry(this.#headRadius, this.#headSegments, this.#headSegments);
        const material = new THREE.MeshPhongMaterial({color: this.#headColor});
        this.head = new THREE.Mesh(geometry, material);
        this.nodes[0] = this.head;

        makeAxisGridDebug(this.head, 'Snake Head');

        this.head.position.x = x;
        this.head.position.y = y;
        this.head.position.z = z;

        /*----- Nodes -----*/
        this.#nodeGeometry = new THREE.SphereGeometry(this.#nodeRadius, this.#nodeSegments, this.#nodeSegments);
        this.#nodeMaterial = new THREE.MeshPhongMaterial({color: this.#nodeColor});


    }


    addNode() {
        const node = new THREE.Mesh(this.#nodeGeometry, this.#nodeMaterial);
        node.position.x = 2 * this.#nodeRadius + 0.2;

        makeAxisGridDebug(node,"Snake Node#" + this.nodes.length);

        this.nodes[this.nodes.length -1].add(node);
        this.nodes.push(node);

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