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

import { Rectangle } from './shape-ev.js';
import {CanvasManager, ShapeScene} from './shape-core.js';

/**
 * @classdesc Interface controls the visibility of input parameters based on the selected shape type.
*
* This class listens to changes in the shape selection dropdown and shows/hides the relevant input fields
* for the parameters needed to create the selected shape.
*/
export class ShapeClient {
  private static readonly DEFAULT_RECTANGLE_COUNT = 20;
  private static readonly COLORS = ['red', 'green', 'blue', 'yellow', 'purple'];
  private rectangles: Rectangle[] = [];
  /**
   * @description Initializes the ShapeClient by setting up references to DOM elements and event listeners.
   * @param canvasManager - Manages the HTML canvas element and its context.
   * @param scene - Represents the current state of the shapes on the canvas and handles rendering.
   */
  constructor(private canvasManager: CanvasManager, private scene: ShapeScene) {
    this.initialize();
  }

  /**
   * @description Initializes the ShapeClient by setting up event listeners for window resize, beforeunload, and button clicks.
   * It also loads any previously saved shapes from localStorage to restore the state of the canvas.
   */
  private initialize(): void {
    this.canvasManager.resize();

    const couterRentangles = ShapeClient.DEFAULT_RECTANGLE_COUNT;
    this.generateRandomRectangles(couterRentangles);

    window.addEventListener('resize', () => {
      this.canvasManager.resize();
      this.scene.redraw();
    });

    window.addEventListener('beforeunload', () => this.scene.clear());
  }
  /**
   * 3.- En el directorio src/evaluation-session/rectangles desarrolle una aplicación web orientada a objetos que muestre un número dado de rectángulos en el canvas de su aplicación.
El programa cliente contemplará como una constante (“cableada” en el código y de valor inicial 20) el número de rectángulos que mostrará la aplicación y representará los rectángulos en el canvas en posiciones generadas aleatoriamente.
La superficie de cada rectángulo ha de ser coloreada utilizando 5 colores diferentes y el color de cada uno se genera también aleatoriamente.
Para cada rectángulo represente gráficamente un punto (4 píxeles de grosor) situado en el centro y junto al mismo escriba textualmente en el canvas el área del rectángulo. Elija un tamaño mínimo de rectángulo de modo que el texto de las coordenadas se muestre con claridad.
   */
  private generateRandomRectangles(count: number): void {
    const colors = ShapeClient.COLORS;
    const canvasWidth = this.canvasManager.getWidth();
    const canvasHeight = this.canvasManager.getHeight();

    const MIN_WIDTH = 40;
    const MIN_HEIGHT = 30;
    const MAX_SIZE = 120;

    for (let i = 0; i < count; i++) {
      const width = MIN_WIDTH + Math.random() * MAX_SIZE;
      const height = MIN_HEIGHT + Math.random() * MAX_SIZE;

      const centerX = Math.random() * canvasWidth;
      const centerY = Math.random() * canvasHeight;

      const color = colors[Math.floor(Math.random() * colors.length)];

      const rectangle = new Rectangle(
        { x: centerX - width / 2, y: centerY - height / 2 },
        color,
        0,
        width,
        height
      );

      this.scene.add(rectangle);
      this.rectangles.push(rectangle);
    }
  }
  /**
   * 4.- Consiga a continuación que aquellos rectángulos cuyas superficies se solapen, se muestren con un borde de color negro y 4 píxeles de grosor.
   */
  private getBounds(rect: Rectangle) {
    const { x, y } = rect.getCoordinates();

    const width = rect.getWidth();
    const height = rect.getHeight();

    return {
      left: x - width / 2,
      right: x + width / 2,
      top: y - height / 2,
      bottom: y + height / 2,
    };
  }

  private overlaps(rectangleA: Rectangle, rectangleB: Rectangle): boolean {
    const rectangleA1 = this.getBounds(rectangleA);
    const rectangleB2 = this.getBounds(rectangleB);

    return !(
      rectangleA1.right < rectangleB2.left ||
      rectangleA1.left > rectangleB2.right ||
      rectangleA1.bottom < rectangleB2.top ||
      rectangleA1.top > rectangleB2.bottom
    );
  }

  private drawBorder(rect: Rectangle, contex: CanvasRenderingContext2D): void {
    const { x, y } = rect.getCoordinates();

    contex.save();
    contex.translate(x, y);

    contex.strokeStyle = 'black';
    contex.lineWidth = 4;

    contex.strokeRect(
      -rect.getWidth() / 2,
      -rect.getHeight() / 2,
      rect.getWidth(),
      rect.getHeight()
    );

    contex.restore();
  }
} 

/**
 * @description Punto de entrada
 */
function main(): void {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const canvasManager = new CanvasManager(canvas);
  const context = canvasManager.getContext();
  const scene = new ShapeScene(context);

  new ShapeClient(canvasManager, scene);
}

main(); 