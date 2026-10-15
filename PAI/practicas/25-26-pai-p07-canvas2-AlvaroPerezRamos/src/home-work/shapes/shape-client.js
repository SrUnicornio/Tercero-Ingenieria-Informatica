/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 *
 * @file shape-client.ts
 * @description Client code to demonstrate the usage of Shape classes and rendering them on an HTML Canvas.
 *
 * @author
 * Alvaro Pérez Ramos
 * alu0101574042@ull.edu.es
 *
 * @since 10 Mar 2026
 */
import { CanvasManager, ShapeForm, ShapeScene, ShapeController } from './shape-core.js';
/**
 * @classdesc Interface controls the visibility of input parameters based on the selected shape type.
*
* This class listens to changes in the shape selection dropdown and shows/hides the relevant input fields
* for the parameters needed to create the selected shape.
*/
export class ShapeClient {
    /**
     * @description References to the buttons for drawing shapes, clearing the canvas, and generating random shapes.
     */
    // private btnDraw: HTMLButtonElement;
    // private btnClear: HTMLButtonElement;
    // private btnRandom: HTMLButtonElement;
    /**
     * @description Initializes the ShapeClient by setting up references to DOM elements and event listeners.
     * @param canvasManager - Manages the HTML canvas element and its context.
     * @param scene - Represents the current state of the shapes on the canvas and handles rendering.
     * @param form - Manages the input form for shape parameters and user interactions.
     * @param controller - Handles the logic for drawing shapes and managing the scene based on user input.
     * @param storage - Manages the persistence of shape data using localStorage.
     */
    constructor(canvasManager, scene, form, controller) {
        // this.btnDraw = document.getElementById('btnDraw') as HTMLButtonElement;
        // this.btnClear = document.getElementById('btnClear') as HTMLButtonElement;
        // this.btnRandom = document.getElementById('btnRandom') as HTMLButtonElement;
        this.canvasManager = canvasManager;
        this.scene = scene;
        this.form = form;
        this.controller = controller;
        this.initialize();
    }
    /**
     * @description Initializes the ShapeClient by setting up event listeners for window resize, beforeunload, and button clicks.
     * It also loads any previously saved shapes from localStorage to restore the state of the canvas.
     */
    initialize() {
        this.canvasManager.resize();
        // this.loadScene();
        window.addEventListener('resize', () => {
            this.canvasManager.resize();
            this.scene.redraw();
        });
        this.handleRandomDraw();
        window.addEventListener('beforeunload', () => this.scene.clear());
        // this.btnDraw.addEventListener('click', () => this.handleManualDraw());
        //caudno cargue ña ventan llanar a rndom
        // this.btnClear.addEventListener('click', () => this.displayClearAlert());
        this.canvasManager.onClick((x, y) => this.form.setPosition(x, y));
    }
    /**
     * @description Draws a shape on the canvas based on the selected draw manual.
    
    private handleManualDraw(): void {
      const values = this.form.getValues();
      this.controller.drawShape(values);
    }
      */
    /**
     * @description Draws a specified number of random shapes on the canvas, prompting the user for the count and validating the input.
     */
    handleRandomDraw() {
        const input = prompt('How many random shapes would you like to generate?', '5');
        const count = Number(input);
        if (!input || isNaN(count) || count <= 0) {
            alert('Invalid input. Please enter a positive number.');
            return;
        }
        this.controller.drawRandom(count);
    }
}
/**
 * @description Punto de entrada
 */
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const canvasManager = new CanvasManager(canvas);
    const context = canvasManager.getContext();
    const scene = new ShapeScene(context);
    const form = new ShapeForm();
    // const storage = new ShapeStorage('homework-shapes');
    const controller = new ShapeController(scene, canvasManager);
    new ShapeClient(canvasManager, scene, form, controller);
});
