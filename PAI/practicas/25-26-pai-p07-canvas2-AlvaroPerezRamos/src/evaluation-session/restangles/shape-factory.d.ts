/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 *
 * @file shape-factory.ts
 * @description Client code to demonstrate the usage of Shape classes
 * and rendering them on an HTML Canvas.
 *
 * @author
 * Alvaro Pérez Ramos
 * alu0101574042@ull.edu.es
 *
 * @since 10 Mar 2026
 */
import { Coordinates, Shape } from './shape-ev.js';
/**
 * @description Defines the structure of the data used for shape creation,
 * including the type of shape, its coordinates, rotation, color,
 * and specific parameters required for different shapes.
 */
export interface ShapeInputData {
    type: string;
    coordinates: Coordinates;
    rotation: number;
    color: string;
    params: Record<string, number>;
}
type ShapeConstructor = (data: ShapeInputData) => Shape;
/**
 * @description Defines the structure of a shape descriptor, which includes
 * the type of shape and the specific parameters required for that shape.
 */
export interface ShapeRegistration {
    constructor: ShapeConstructor;
    params: string[];
}
/**
 * @classdesc Factory class to create shape instances based on user input.
 */
export declare class ShapeFactory {
    private static registry;
    /**
     * @description Registers a shape constructor in the factory registry, allowing
     * for dynamic creation of shapes based on their type.
     */
    static register(type: string, params: string[], constructor: ShapeConstructor): void;
    /**
     * @description Creates a shape instance based on the provided type and parameters
     * by looking up the corresponding constructor in the registry.
     * This method abstracts the instantiation logic and allows for easy extension to
     * support new shapes without modifying existing code.
     * @param data
     */
    static createShape(data: ShapeInputData): Shape | null;
    /**
     * @description Returns an array of all registered shape types in the factory,
     * allowing clients to query which shapes are available for creation.
     */
    static getRegisteredTypes(): string[];
    /**
     * @description Returns the specific parameters required for a given shape type,
     * allowing clients to understand what data is needed to create an instance of that shape.
     * @param type The type of shape for which to retrieve the parameters.
     * @returns An array of parameter names required for the specified shape type,
     * or an empty array if the type is not registered.
     */
    static getParams(type: string): string[];
    /**
     * @description Validates the input data for shape creation, ensuring that specific
     * parameters meet the required criteria for certain shape types (e.g., polygons must have at least 3 sides).
     * This method can be extended to include additional validation rules for other shapes as needed.
     * @param data The shape input data to validate.
     * @returns A boolean indicating whether the input data is valid for shape creation.
     */
    private static validate;
}
export {};
