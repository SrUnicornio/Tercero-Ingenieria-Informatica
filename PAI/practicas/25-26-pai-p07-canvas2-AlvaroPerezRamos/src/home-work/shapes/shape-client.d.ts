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
export declare class ShapeClient {
    private canvasManager;
    private scene;
    private form;
    private controller;
    /**
     * @description References to the buttons for drawing shapes, clearing the canvas, and generating random shapes.
     */
    /**
     * @description Initializes the ShapeClient by setting up references to DOM elements and event listeners.
     * @param canvasManager - Manages the HTML canvas element and its context.
     * @param scene - Represents the current state of the shapes on the canvas and handles rendering.
     * @param form - Manages the input form for shape parameters and user interactions.
     * @param controller - Handles the logic for drawing shapes and managing the scene based on user input.
     * @param storage - Manages the persistence of shape data using localStorage.
     */
    constructor(canvasManager: CanvasManager, scene: ShapeScene, form: ShapeForm, controller: ShapeController);
    /**
     * @description Initializes the ShapeClient by setting up event listeners for window resize, beforeunload, and button clicks.
     * It also loads any previously saved shapes from localStorage to restore the state of the canvas.
     */
    private initialize;
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
    private handleRandomDraw;
}
