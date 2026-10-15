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
import { Shape } from './shape.js';
import { ShapeInputData } from './shape-factory.js';
/**
 * @classdesc Manages a collection of shapes and handles
 * their rendering on an HTML Canvas.
 *
 * This class provides methods to add shapes to the scene,
 * clear the scene, and redraw all shapes on the canvas.
 * It maintains an internal list of shapes and interacts with the canvas
 * context to render them visually.
 */
export declare class ShapeScene {
    private context;
    private shapes;
    private shapeData;
    constructor(context: CanvasRenderingContext2D);
    /**
     * @description Retrieves the current list of shapes in the scene.
     * @returns An array of shape objects that are currently part of the scene.
     */
    getShapes(): Shape[];
    /**
     * @description Retrieves the current list of shape input data in the scene.
     * @returns An array of shape input data objects.
     */
    getShapeData(): ShapeInputData[];
    /**
     * @description Adds a new shape to the scene and triggers
     * a redraw of the canvas to display the updated list of shapes.
     * @param shape The shape object to be added to the scene.
     * @param data Optional shape input data that corresponds to the shape being added.
     */
    add(shape: Shape, data?: ShapeInputData): void;
    /**
     * @description Clears all shapes from the scene and redraws the canvas
     * to reflect the empty state.
     * This method is useful for resetting the canvas and starting fresh with
     * no shapes displayed. It empties the internal list of shapes and then calls
     * the redraw method to clear the visual representation on the canvas.
     */
    clear(): void;
    /**
     * @description Redraws all shapes currently in the scene on the canvas.
      * This method first clears the entire canvas to remove any existing drawings,
      * and then iterates through the list of shapes, calling their draw method
      * to render each shape on the canvas.
      * It ensures that the visual representation on the canvas is always up-to-date
      * with the current state of the shapes in the scene.
     */
    redraw(): void;
}
/**
 * @classdesc Provides statistical analysis of shapes in the scene, such as counting
 */
export declare class ShapeStatistics {
    /**
     * @description Counts the number of shapes of each type in the provided array of shapes.
     * @param shapes An array of shape objects to be analyzed.
     * @returns A Map where the keys are shape type names (as strings) and the values are
     * the counts of how many shapes of each type are present in the input array.
     */
    static countByType(shapes: Shape[]): Map<string, number>;
}
/**
 * @classdesc Manages the HTML Canvas element and provides methods
 * for interacting with it, such as retrieving the rendering context,
 * resizing the canvas, and handling click events to capture coordinates.
 */
export declare class CanvasManager {
    private canvas;
    constructor(canvas: HTMLCanvasElement);
    /**
     * @description Retrieves the 2D rendering context from the canvas element,
     * which is used for drawing shapes and other graphics on the canvas.
     */
    getContext(): CanvasRenderingContext2D;
    /**
     * @description Returns the current width of the canvas element,
     * which is used to determine the vertical size of the drawing
     * area for rendering shapes.
     */
    getWidth(): number;
    /**
     * @description Returns the current height of the canvas element,
     * which is used to determine the horizontal size of the drawing area
     * for rendering shapes.
     */
    getHeight(): number;
    /**
     * @description Resizes the canvas to match its displayed size in the browser.
     */
    resize(): void;
    /**
     * @description Registers a click event listener on the canvas
     * to capture the coordinates of the click and pass them to a callback function.
     */
    onClick(callback: (coordinate_x: number, coordinate_y: number) => void): void;
}
/**
 * @classdesc Validates shape parameters, particularly the coordinates,
 * to ensure they are within the bounds of the canvas.
 */
export declare class ShapeValidator {
    /**
     * @description Clamps the X and Y coordinates of a shape to ensure they are within the bounds of the canvas dimensions.
     * @param values The shape input data containing the original coordinates and other parameters for the shape.
     * @param width The width of the canvas, used to clamp the X coordinate within the range of 0 to the canvas width.
     * @param height The height of the canvas, used to clamp the Y coordinate within the range of 0 to the canvas height.
     * @returns The shape input data with the X and Y coordinates adjusted to be within the canvas bounds.
     */
    static clampCoordinates(values: ShapeInputData, width: number, height: number): ShapeInputData;
}
/**
 * @classdesc Generates random shape parameters.
 */
export declare class RandomShapeGenerator {
    /**
     * Generates random parameters for a shape
     */
    static generate(width: number, height: number): ShapeInputData;
}
/**
 * @classdesc Manages the form inputs for shape parameters and provides a method to retrieve their values.
 */
export declare class ShapeForm {
    private shapeSelect;
    private inputColor;
    private inputX;
    private inputY;
    private inputRotation;
    private paramContainer;
    private paramInputs;
    /**
     * @description Initializes the ShapeForm by setting up references
     * to the relevant DOM elements and event listeners for updating
     * the visibility of input fields based on the selected shape type.
     */
    constructor();
    /**
     * @description Updates the visibility of input fields based on the selected shape type.
     */
    private updateInputs;
    /**
     * @description Builds the options for the shape selection dropdown
     * based on the registered shape types in the ShapeFactory, allowing
     * users to select from the available shapes when creating new shapes
     * on the canvas.
     */
    private buildShapeOptions;
    /**
     * @description Sets the position values in the form inputs based on
     * the provided X and Y coordinates, allowing for quick updates to
     * the shape's position when interacting with the canvas.
     */
    setPosition(x: number, y: number): void;
    /**
     * @description Sets the values of the form inputs based on the provided
     * parameters, allowing for pre-filling the form with specific shape attributes.
     * @param values An object containing the shape type, coordinates, rotation, color,
     * and specific parameters for the shape.
     */
    setValues(data: ShapeInputData): void;
    /**
     * @description Retrieves the current values from the form inputs
     * related to shape parameters and returns them as an object.
     */
    getValues(): ShapeInputData;
}
/**
 * @classdesc Manages the storage of shape data in the browser's localStorage,
 * allowing for saving and loading of shapes across sessions.
 */
export declare class ShapeStorage {
    private key;
    constructor(key: string);
    /**
     * @description Saves the provided shape input data to localStorage under the specified key, allowing
     * for persistence of shape data across browser sessions.
     * @param data An array of shape input data objects to be saved, which will be serialized to JSON format
     * for storage in localStorage.
     */
    save(data: ShapeInputData[]): void;
    /**
     * @description Loads shape input data from localStorage using the specified key,
     * allowing for retrieval of previously saved shape data.
     * @returns An array of shape input data objects that were loaded from localStorage.
     * If no data is found under the specified key, an empty array is returned.
     */
    load(): ShapeInputData[];
    /**
     * @description Clears the shape data stored in localStorage under the specified key,
     * allowing for the removal of saved shape data and resetting of the storage state.
     */
    clear(): void;
}
/**
 * @classdesc Controller class that manages the interaction between the shape scene,
 * canvas, and user input for creating and managing shapes.
 */
export declare class ShapeController {
    private scene;
    private canvas;
    constructor(scene: ShapeScene, canvas: CanvasManager);
    /**
     * @description Draws a shape on the canvas based on the provided shape input data.
     * @param data The shape input data containing the type, coordinates, rotation, color,
     * and specific parameters for the shape to be drawn.
     */
    drawShape(data: ShapeInputData): void;
    /**
     * @description Draws a specified number of shapes with random attributes on the canvas.
     * @param count The number of random shapes to be generated and drawn on the canvas.
     */
    drawRandom(count: number): void;
    /**
     * @description Loads shapes from the provided shape input data and adds them to the scene.
     * @param data An array of shape input data objects that represent the shapes to be loaded and added to the scene.
     */
    loadShapes(data: ShapeInputData[]): void;
}
