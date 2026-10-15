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
import { CanvasManager, ShapeScene } from './shape-core.js';
/**
 * @classdesc Interface controls the visibility of input parameters based on the selected shape type.
*
* This class listens to changes in the shape selection dropdown and shows/hides the relevant input fields
* for the parameters needed to create the selected shape.
*/
export declare class ShapeClient {
    private canvasManager;
    private scene;
    /**
     * @description Initializes the ShapeClient by setting up references to DOM elements and event listeners.
     * @param canvasManager - Manages the HTML canvas element and its context.
     * @param scene - Represents the current state of the shapes on the canvas and handles rendering.
     */
    constructor(canvasManager: CanvasManager, scene: ShapeScene);
    /**
     * @description Initializes the ShapeClient by setting up event listeners for window resize, beforeunload, and button clicks.
     * It also loads any previously saved shapes from localStorage to restore the state of the canvas.
     */
    private initialize;
    /**
     * 3.- En el directorio src/evaluation-session/rectangles desarrolle una aplicación web orientada a objetos que muestre un número dado de rectángulos en el canvas de su aplicación.
  El programa cliente contemplará como una constante (“cableada” en el código y de valor inicial 20) el número de rectángulos que mostrará la aplicación y representará los rectángulos en el canvas en posiciones generadas aleatoriamente.
  La superficie de cada rectángulo ha de ser coloreada utilizando 5 colores diferentes y el color de cada uno se genera también aleatoriamente.
  Para cada rectángulo represente gráficamente un punto (4 píxeles de grosor) situado en el centro y junto al mismo escriba textualmente en el canvas el área del rectángulo. Elija un tamaño mínimo de rectángulo de modo que el texto de las coordenadas se muestre con claridad.
     */
    private generateRandomRectangles;
}
