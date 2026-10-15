/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 *
 * @file shape-core.ts
 * @description Core classes for managing shapes and canvas interactions,
 * including the ShapeScene for handling shape collections and rendering,
 * the CanvasManager for managing canvas properties and events,
 * the ShapeValidator for validating shape parameters,
 * the RandomShapeGenerator for creating random shape attributes,
 * and the ShapeForm for managing user input related to shape creation.
 * @author
 * Alvaro Pérez Ramos
 * alu0101574042@ull.edu.es
 * @since 10 Mar 2026
 */

import {Shape, Rectangle} from './shape-ev.js';
import {ShapeFactory, ShapeInputData} from './shape-factory.js';

/**
 * @classdesc Manages a collection of shapes and handles
 * their rendering on an HTML Canvas.
 *
 * This class provides methods to add shapes to the scene,
 * clear the scene, and redraw all shapes on the canvas.
 * It maintains an internal list of shapes and interacts with the canvas
 * context to render them visually.
 */
export class ShapeScene {
  private shapes: Shape[] = [];
  private shapeData: ShapeInputData[] = [];

  constructor(private context: CanvasRenderingContext2D) { }

  /**
   * @description Retrieves the current list of shapes in the scene.
   * @returns An array of shape objects that are currently part of the scene.
   */
  getShapes(): Shape[] {
    return [...this.shapes];
  }

  /**
   * @description Retrieves the current list of shape input data in the scene.
   * @returns An array of shape input data objects.
   */
  getShapeData(): ShapeInputData[] {
    return [...this.shapeData];
  }

  /**
   * @description Adds a new shape to the scene and triggers
   * a redraw of the canvas to display the updated list of shapes.
   * @param shape The shape object to be added to the scene.
   * @param data Optional shape input data that corresponds to the shape being added.
   */
  add(shape: Shape, data?: ShapeInputData): void {
    this.shapes.push(shape);
    if (data) {
      this.shapeData.push(data);
    }
    this.redraw();
  }

  /**
   * @description Clears all shapes from the scene and redraws the canvas
   * to reflect the empty state.
   * This method is useful for resetting the canvas and starting fresh with
   * no shapes displayed. It empties the internal list of shapes and then calls
   * the redraw method to clear the visual representation on the canvas.
   */
  clear(): void {
    this.shapes = [];
    this.shapeData = [];
    this.redraw();
  }

  /**
   * @description Redraws all shapes currently in the scene on the canvas.
    * This method first clears the entire canvas to remove any existing drawings,
    * and then iterates through the list of shapes, calling their draw method
    * to render each shape on the canvas.
    * It ensures that the visual representation on the canvas is always up-to-date
    * with the current state of the shapes in the scene.
   */
  redraw(): void {
    const canvas = this.context.canvas;
    this.context.clearRect(0, 0, canvas.width, canvas.height);

    for (const shape of this.shapes) {
      shape.draw(this.context);
    }
  }

  private overlaps(a: Rectangle, b: Rectangle): boolean {
    const aBounds = this.getBounds(a);
    const bBounds = this.getBounds(b);

    return !(
      aBounds.right < bBounds.left ||
      aBounds.left > bBounds.right ||
      aBounds.bottom < bBounds.top ||
      aBounds.top > bBounds.bottom
    );
  }

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
}

/**
 * @classdesc Provides statistical analysis of shapes in the scene, such as counting
 */
export class ShapeStatistics {
  /**
   * @description Counts the number of shapes of each type in the provided array of shapes.
   * @param shapes An array of shape objects to be analyzed.
   * @returns A Map where the keys are shape type names (as strings) and the values are
   * the counts of how many shapes of each type are present in the input array.
   */
  static countByType(shapes: Shape[]): Map<string, number> {
    const counts = new Map<string, number>();

    for (const shape of shapes) {
      const type = shape.getType();

      if (!counts.has(type)) {
        counts.set(type, 0);
      }
      counts.set(type, counts.get(type)! + 1);
    }
    return counts;
  }
}

/**
 * @classdesc Manages the HTML Canvas element and provides methods
 * for interacting with it, such as retrieving the rendering context,
 * resizing the canvas, and handling click events to capture coordinates.
 */
export class CanvasManager {
  constructor(private canvas: HTMLCanvasElement) { }

  /**
   * @description Retrieves the 2D rendering context from the canvas element,
   * which is used for drawing shapes and other graphics on the canvas.
   */
  getContext(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')!;
  }

  /**
   * @description Returns the current width of the canvas element,
   * which is used to determine the vertical size of the drawing
   * area for rendering shapes.
   */
  getWidth(): number {
    return this.canvas.width;
  }

  /**
   * @description Returns the current height of the canvas element,
   * which is used to determine the horizontal size of the drawing area
   * for rendering shapes.
   */
  getHeight(): number {
    return this.canvas.height;
  }

  /**
   * @description Resizes the canvas to match its displayed size in the browser.
   */
  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  /**
   * @description Registers a click event listener on the canvas
   * to capture the coordinates of the click and pass them to a callback function.
   */
  onClick(callback: (
    coordinate_x: number,
    coordinate_y: number) => void): void {
    this.canvas.addEventListener('click', (event) => {
      const rect = this.canvas.getBoundingClientRect();

      const coordinateX = event.clientX - rect.left;
      const coordinateY = event.clientY - rect.top;

      callback(coordinateX, coordinateY);
    });
  }
}

/**
 * @classdesc Validates shape parameters, particularly the coordinates,
 * to ensure they are within the bounds of the canvas.
 */
export class ShapeValidator {
  /**
   * @description Clamps the X and Y coordinates of a shape to ensure they are within the bounds of the canvas dimensions.
   * @param values The shape input data containing the original coordinates and other parameters for the shape.
   * @param width The width of the canvas, used to clamp the X coordinate within the range of 0 to the canvas width.
   * @param height The height of the canvas, used to clamp the Y coordinate within the range of 0 to the canvas height.
   * @returns The shape input data with the X and Y coordinates adjusted to be within the canvas bounds.
   */
  static clampCoordinates(values: ShapeInputData, width: number, height: number): ShapeInputData {
    return {
      ...values,
      coordinates: {
        x: Math.max(0, Math.min(values.coordinates.x, width)),
        y: Math.max(0, Math.min(values.coordinates.y, height)),
      },
    };
  }
}

/** Constants for random shape generation */
const MAX_RGB_COLOR = 0xFFFFFF;
const HEX_BASE = 16;
const HEX_COLOR_LENGTH = 6;

/** Constants for random parameter generation */
const MIN_PARAM_VALUE = 20;
const PARAM_RANGE = 100;

/** Constants for random rotation generation */
const MAX_ROTATION = 360;

/**
 * @description Generates a random color in hexadecimal format.
 * @returns A string representing a random color in hexadecimal format
 */
function generateRandomColor(): string {
  const randomColorValue = Math.floor(Math.random() * MAX_RGB_COLOR);

  return `#${randomColorValue
      .toString(HEX_BASE)
      .padStart(HEX_COLOR_LENGTH, '0')}`;
}

/**
 * @description Generates a random parameter value within a specified range,
 * which can be used for setting random attributes of shapes such as size or dimensions.
 * @returns A number representing a random parameter value within the defined range.
 */
function generateRandomParam(): number {
  return MIN_PARAM_VALUE + Math.random() * PARAM_RANGE;
}

/**
 * @classdesc Generates random shape parameters.
 */
export class RandomShapeGenerator {
  /**
   * Generates random parameters for a shape
   */
  static generate(width: number, height: number): ShapeInputData {
    const types = ShapeFactory.getRegisteredTypes();
    const type = types[Math.floor(Math.random() * types.length)];
    const paramsNeeded = ShapeFactory.getParams(type);
    const params: Record<string, number> = {};

    for (const param of paramsNeeded) {
      params[param] = generateRandomParam();
    }

    return {
      type,
      coordinates: {
        x: Math.random() * width,
        y: Math.random() * height,
      },
      rotation: Math.random() * MAX_ROTATION,
      color: generateRandomColor(),
      params,
    };
  }
}

/**
 * @classdesc Manages the form inputs for shape parameters and provides a method to retrieve their values.
 */
export class ShapeForm {
  private shapeSelect: HTMLSelectElement;

  private inputColor: HTMLInputElement;
  private inputX: HTMLInputElement;
  private inputY: HTMLInputElement;
  private inputRotation: HTMLInputElement;

  private paramContainer: HTMLElement;

  private paramInputs: Map<string, HTMLInputElement> = new Map();

  /**
   * @description Initializes the ShapeForm by setting up references
   * to the relevant DOM elements and event listeners for updating
   * the visibility of input fields based on the selected shape type.
   */
  constructor() {
    const selectorContainer = document.getElementById('shape-selector') as HTMLElement;
    this.shapeSelect = document.createElement('select');
    selectorContainer.appendChild(this.shapeSelect);
    this.buildShapeOptions();

    this.inputColor = document.getElementById('color') as HTMLInputElement;
    this.inputX = document.getElementById('posX') as HTMLInputElement;
    this.inputY = document.getElementById('posY') as HTMLInputElement;
    this.inputRotation = document.getElementById('rotacion') as HTMLInputElement;

    this.paramContainer = document.getElementById('shape-params') as HTMLElement;
    this.shapeSelect.addEventListener('change', () => this.updateInputs());

    this.updateInputs();
  }

  /**
   * @description Updates the visibility of input fields based on the selected shape type.
   */
  private updateInputs(): void {
    const type = this.shapeSelect.value;
    const params = ShapeFactory.getParams(type);
    this.paramContainer.innerHTML = '';
    this.paramInputs.clear();

    for (const param of params) {
      const label = document.createElement('label');
      label.textContent = param + ':';
      const input = document.createElement('input');

      input.type = 'number';
      input.value = '50';

      label.appendChild(input);
      this.paramContainer.appendChild(label);
      this.paramInputs.set(param, input);
    }
  }

  /**
   * @description Builds the options for the shape selection dropdown
   * based on the registered shape types in the ShapeFactory, allowing
   * users to select from the available shapes when creating new shapes
   * on the canvas.
   */
  private buildShapeOptions(): void {
    const defaultOption = document.createElement('option');

    defaultOption.value = '';
    defaultOption.textContent = '-- Select a shape --';

    this.shapeSelect.appendChild(defaultOption);
    const types = ShapeFactory.getRegisteredTypes();

    for (const type of types) {
      const option = document.createElement('option');

      option.value = type;
      option.textContent =
        type.charAt(0).toUpperCase() + type.slice(1);

      this.shapeSelect.appendChild(option);
    }
  }

  /**
   * @description Sets the position values in the form inputs based on
   * the provided X and Y coordinates, allowing for quick updates to
   * the shape's position when interacting with the canvas.
   */
  setPosition(x: number, y: number): void {
    this.inputX.value = String(Math.round(x));
    this.inputY.value = String(Math.round(y));
  }

  /**
   * @description Sets the values of the form inputs based on the provided
   * parameters, allowing for pre-filling the form with specific shape attributes.
   * @param values An object containing the shape type, coordinates, rotation, color,
   * and specific parameters for the shape.
   */
  setValues(data: ShapeInputData): void {
    this.shapeSelect.value = data.type;
    this.updateInputs();
    this.inputX.value = String(Math.round(data.coordinates.x));
    this.inputY.value = String(Math.round(data.coordinates.y));

    this.inputRotation.value = String(Math.round(data.rotation));
    this.inputColor.value = data.color;

    for (const [key, value] of Object.entries(data.params)) {
      const input = this.paramInputs.get(key);

      if (input) {
        input.value = String(Math.round(value));
      }
    }
  }

  /**
   * @description Retrieves the current values from the form inputs
   * related to shape parameters and returns them as an object.
   */
  getValues(): ShapeInputData {
    const params: Record<string, number> = {};

    for (const [key, input] of this.paramInputs) {
      params[key] = Number(input.value);
    }

    return {
      type: this.shapeSelect.value,
      coordinates: {
        x: Number(this.inputX.value),
        y: Number(this.inputY.value),
      },
      rotation: Number(this.inputRotation.value),
      color: this.inputColor.value,
      params,
    };
  }
}

/**
 * @classdesc Manages the storage of shape data in the browser's localStorage,
 * allowing for saving and loading of shapes across sessions.
 */
export class ShapeStorage {
  constructor(private key: string) { }

  /**
   * @description Saves the provided shape input data to localStorage under the specified key, allowing
   * for persistence of shape data across browser sessions.
   * @param data An array of shape input data objects to be saved, which will be serialized to JSON format
   * for storage in localStorage.
   */
  save(data: ShapeInputData[]): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  /**
   * @description Loads shape input data from localStorage using the specified key,
   * allowing for retrieval of previously saved shape data.
   * @returns An array of shape input data objects that were loaded from localStorage.
   * If no data is found under the specified key, an empty array is returned.
   */
  load(): ShapeInputData[] {
    const saved = localStorage.getItem(this.key);
    return saved ? JSON.parse(saved) : [];
  }

  /**
   * @description Clears the shape data stored in localStorage under the specified key,
   * allowing for the removal of saved shape data and resetting of the storage state.
   */
  clear(): void {
    localStorage.removeItem(this.key);
  }
}

/**
 * @classdesc Controller class that manages the interaction between the shape scene,
 * canvas, and user input for creating and managing shapes.
 */
export class ShapeController {
  constructor(private scene: ShapeScene, private canvas: CanvasManager) { }

  /**
   * @description Draws a shape on the canvas based on the provided shape input data.
   * @param data The shape input data containing the type, coordinates, rotation, color,
   * and specific parameters for the shape to be drawn.
   */
  drawShape(data: ShapeInputData): void {
    const validated =
      ShapeValidator.clampCoordinates(
          data,
          this.canvas.getWidth(),
          this.canvas.getHeight(),
      );
    const shape = ShapeFactory.createShape(validated);
    if (shape) {
      this.scene.add(shape, validated);
    }
  }

  /**
   * @description Draws a specified number of shapes with random attributes on the canvas.
   * @param count The number of random shapes to be generated and drawn on the canvas.
   */
  drawRandom(count: number): void {
    for (let i = 0; i < count; i++) {
      const data =
        RandomShapeGenerator.generate(
            this.canvas.getWidth(),
            this.canvas.getHeight(),
        );

      this.drawShape(data);
    }
  }

  /**
   * @description Loads shapes from the provided shape input data and adds them to the scene.
   * @param data An array of shape input data objects that represent the shapes to be loaded and added to the scene.
   */
  loadShapes(data: ShapeInputData[]): void {
    for (const shape of data) {
      this.drawShape(shape);
    }
  }
}
