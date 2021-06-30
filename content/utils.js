"use strict"
import * as THREE from '../resources/three.js-r129/build/three.module.js';
import {GUI} from "../resources/three.js-r129/examples/jsm/libs/dat.gui.module.js";

const gui = new GUI({name: "Debug"});
gui.width = 400;

/*---- Resize canvas to screen size ------*/
export function resizeCanvas(renderer, camera) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}


/*------ GUI for debugging ------*/
class AxisGridHandler {
    #axis
    #grid

    constructor(node, size = 1, units = 10) {
        this.#axis = new THREE.AxesHelper(size);
        this.#axis.material.depthTest = false;
        this.#axis.renderOrder = 2;
        this.#axis.visible = false;
        node.add(this.#axis);

        this.#grid = new THREE.GridHelper(units, units);
        this.#grid.material.depthTest = false;
        this.#grid.renderOrder = 1;
        this.#grid.visible = false;
        node.add(this.#grid);

    }

    // Getters
    get axisVisible() {
        return this.#axis.visible;
    }
    get gridVisible() {
        return this.#grid.visible;
    }

    // Setters
    set axisVisible(value) {
        this.#axis.visible = value;
    }
    set gridVisible(value) {
        this.#grid.visible = value;
    }
}

export function makeAxisGridDebug(node, label, size = 1, units = 10) {
    const handler = new AxisGridHandler(node,size,units);
    gui.add(handler, 'axisVisible').name(label + ' Axis');
    gui.add(handler, 'gridVisible').name(label + ' Grid');

}
