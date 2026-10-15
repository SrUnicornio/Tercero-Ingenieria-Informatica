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
import { Circle, Rectangle, Square, Triangle, Polygon, Star, Cross, Oval, Diamond, Heart, Trapezoid, Arrow, Clover, } from './shape.js';
/**
 * @classdesc Factory class to create shape instances based on user input.
 */
export class ShapeFactory {
    /**
     * @description Registers a shape constructor in the factory registry, allowing
     * for dynamic creation of shapes based on their type.
     */
    static register(type, params, constructor) {
        this.registry.set(type, { constructor, params });
    }
    /**
     * @description Creates a shape instance based on the provided type and parameters
     * by looking up the corresponding constructor in the registry.
     * This method abstracts the instantiation logic and allows for easy extension to
     * support new shapes without modifying existing code.
     * @param data
     */
    static createShape(data) {
        const entry = this.registry.get(data.type);
        if (!entry) {
            console.warn(`Shape type '${data.type}' not registered`);
            return null;
        }
        if (!this.validate(data)) {
            console.warn(`Invalid parameters for shape type '${data.type}'`);
            // alert(`Invalid parameters for shape type '${data.type}'. Please check the input values.`);
            return null;
        }
        return entry.constructor(data);
    }
    /**
     * @description Returns an array of all registered shape types in the factory,
     * allowing clients to query which shapes are available for creation.
     */
    static getRegisteredTypes() {
        return Array.from(this.registry.keys());
    }
    /**
     * @description Returns the specific parameters required for a given shape type,
     * allowing clients to understand what data is needed to create an instance of that shape.
     * @param type The type of shape for which to retrieve the parameters.
     * @returns An array of parameter names required for the specified shape type,
     * or an empty array if the type is not registered.
     */
    static getParams(type) {
        const entry = this.registry.get(type);
        return entry ? entry.params : [];
    }
    /**
     * @description Validates the input data for shape creation, ensuring that specific
     * parameters meet the required criteria for certain shape types (e.g., polygons must have at least 3 sides).
     * This method can be extended to include additional validation rules for other shapes as needed.
     * @param data The shape input data to validate.
     * @returns A boolean indicating whether the input data is valid for shape creation.
     */
    static validate(data) {
        switch (data.type) {
            case 'polygon':
                return Number.isInteger(data.params.sides) && data.params.sides >= 3;
            case 'star':
                return Number.isInteger(data.params.points) && data.params.points >= 3;
            default:
                return true;
        }
    }
}
ShapeFactory.registry = new Map();
/* --------------------------------------------------------- */
/* Shape registrations                                       */
/* --------------------------------------------------------- */
ShapeFactory.register('circle', ['radius'], (data) => new Circle(data.coordinates, data.color, data.rotation, data.params.radius));
ShapeFactory.register('rectangle', ['width', 'height'], (data) => new Rectangle(data.coordinates, data.color, data.rotation, data.params.width, data.params.height));
ShapeFactory.register('square', ['side'], (data) => new Square(data.coordinates, data.color, data.rotation, data.params.side));
ShapeFactory.register('triangle', ['base', 'heightTriangle'], (data) => new Triangle(data.coordinates, data.color, data.rotation, data.params.base, data.params.heightTriangle));
ShapeFactory.register('polygon', ['sides', 'radius'], (data) => new Polygon(data.coordinates, data.color, data.rotation, data.params.sides, data.params.radius));
ShapeFactory.register('star', ['points', 'outerRadius', 'innerRadius'], (data) => {
    const points = data.params.points;
    const outer = data.params.outerRadius;
    const inner = data.params.innerRadius;
    const EPSILON = 10e-4;
    if (Math.abs(outer - inner) < EPSILON) {
        return new Polygon(data.coordinates, data.color, data.rotation, Math.floor(points * 2), outer);
    }
    return new Star(data.coordinates, data.color, data.rotation, points, outer, inner);
});
ShapeFactory.register('cross', ['size'], (data) => new Cross(data.coordinates, data.color, data.rotation, data.params.size));
ShapeFactory.register('oval', ['radiusX', 'radiusY'], (data) => new Oval(data.coordinates, data.color, data.rotation, data.params.radiusX, data.params.radiusY));
ShapeFactory.register('diamond', ['width', 'height'], (data) => new Diamond(data.coordinates, data.color, data.rotation, data.params.width, data.params.height));
ShapeFactory.register('heart', ['size'], (data) => new Heart(data.coordinates, data.color, data.rotation, data.params.size));
ShapeFactory.register('trapezoid', ['topBase', 'bottomBase', 'heightTrapezoid'], (data) => new Trapezoid(data.coordinates, data.color, data.rotation, data.params.topBase, data.params.bottomBase, data.params.heightTrapezoid));
ShapeFactory.register('arrow', ['length', 'headSize'], (data) => new Arrow(data.coordinates, data.color, data.rotation, data.params.length, data.params.headSize));
ShapeFactory.register('clover', ['size'], (data) => new Clover(data.coordinates, data.color, data.rotation, data.params.size));
