/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 *
 * @file shape.ts
 * @description Definition of geometric shapes that can be rendered
 * on an HTML Canvas element.
 *
 * @author
 * Alvaro Pérez Ramos
 * alu0101574042@ull.edu.es
 *
 * @since 10 Mar 2026
 */
/**
 * @interface Represents a 2D coordinate.
 */
export interface Coordinates {
    x: number;
    y: number;
}
/**
 * @classdesc Abstract base class representing a drawable geometric shape.
 *
 * This class defines the common properties and behaviour shared by
 * all shapes in the application.
 */
export declare abstract class Shape {
    protected readonly coordinates: Coordinates;
    protected readonly color: string;
    protected readonly rotation: number;
    /**
     * @description Creates a new Shape.
     * @param coordinates Position of the shape in the canvas.
     * @param color Fill color of the shape.
     * @param rotation Rotation angle in degrees (default is 0).
     */
    constructor(coordinates: Coordinates, color: string, rotation?: number);
    /**
     * @description Returns the coordinates of the shape.
     */
    getCoordinates(): Coordinates;
    /**
     * @description Returns the color of the shape.
     */
    getColor(): string;
    /**
     * @description Returns the rotation angle of the shape in degrees.
     */
    getRotation(): number;
    /**
     * @description Returns the type of the shape based on its constructor name.
     */
    getType(): string;
    /**
     * @description Draw method used by the client.
     * Handles translation and rotation.
     * @param context Canvas rendering context.
     */
    draw(context: CanvasRenderingContext2D): void;
    /**
     * @description Computes the area of the shape.
     */
    abstract computeArea(): number;
    /**
     * @description Draws the shape in the provided canvas context.
     * @param context Canvas rendering context.
     */
    protected abstract drawShape(context: CanvasRenderingContext2D): void;
    /**
     * @description Draws a small circle at the center of the shape for debugging purposes.
     * @param context Canvas rendering context.
     */
    protected drawCenter(context: CanvasRenderingContext2D): void;
}
/**
 * @classdesc Circle geometric shape.
 */
export declare class Circle extends Shape {
    private readonly radius;
    /**
     * @description Creates a new circle.
     * @param coordinates Center coordinates.
     * @param color Fill color.
     * @param radius Circle radius.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number, radius: number);
    /** @inheritdoc */
    computeArea(): number;
    /** @inheritdoc */
    protected drawShape(context: CanvasRenderingContext2D): void;
}
/**
 * @classdesc Rectangle geometric shape.
 */
export declare class Rectangle extends Shape {
    protected readonly width: number;
    protected readonly height: number;
    /**
     * @description Creates a rectangle.
     * @param coordinates Top-left corner coordinates.
     * @param color Fill color.
     * @param width Rectangle width.
     * @param height Rectangle height.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number, width: number, height: number);
    /** @inheritdoc */
    computeArea(): number;
    /** @inheritdoc */
    protected drawShape(context: CanvasRenderingContext2D): void;
}
/**
 * @classdesc Square geometric shape.
 *
 * A square is a specific type of rectangle where width = height.
 */
export declare class Square extends Rectangle {
    readonly side: number;
    /**
     * @description Creates a square.
     * @param coordinates Top-left corner coordinates.
     * @param color Fill color.
     * @param side Length of the square side.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number | undefined, side: number);
}
/**
 * @classdesc Triangle geometric shape.
 */
export declare class Triangle extends Shape {
    private readonly base;
    private readonly height;
    /**
     * @description Creates a triangle.
     * @param coordinates Bottom-left vertex.
     * @param color Fill color.
     * @param base Base length.
     * @param height Triangle height.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number, base: number, height: number);
    /** @inheritdoc */
    computeArea(): number;
    /** @inheritdoc */
    protected drawShape(context: CanvasRenderingContext2D): void;
}
/**
 * @classdesc Polygon geometric shape.
 */
export declare class Polygon extends Shape {
    private readonly sides;
    private readonly radius;
    /**
     * @description Creates a regular polygon.
     * @param coordinates Center of the polygon.
     * @param color Fill color.
     * @param sides Number of sides of the polygon.
     * @param radius Distance from center to vertices.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number, sides: number, radius: number);
    /**
     * @description Returns the name of the polygon.
     * @returns The name of the polygon based on its number of sides,
     * or a generic name if not predefined.
     */
    getType(): string;
    /** @inheritdoc */
    computeArea(): number;
    /** @inheritdoc */
    protected drawShape(context: CanvasRenderingContext2D): void;
}
/**
 * @classdesc Star geometric shape.
 */
export declare class Star extends Shape {
    private readonly points;
    private readonly outerRadius;
    private readonly innerRadius;
    /**
     * @description Creates a regular star.
     * @param coordinates Center of the star.
     * @param color Fill color.
     * @param points Number of points of the star.
     * @param outerRadius Distance from center to outer vertices.
     * @param innerRadius Distance from center to inner vertices.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number, points: number, outerRadius: number, innerRadius: number);
    /**
     * @description Returns the name of the stars.
     * @returns The name of the satras based on its number of points,
     * or a generic name if not predefined.
     */
    getType(): string;
    /** @inheritdoc */
    computeArea(): number;
    /** @inheritdoc */
    protected drawShape(context: CanvasRenderingContext2D): void;
}
/**
 * @classdesc Regular cross geometric shape.
 */
export declare class Cross extends Shape {
    private readonly size;
    /**
     * @description Creates a cross.
     * @param coordinates Center of the cross.
     * @param color Fill color.
     * @param size Size of the cross arms.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number, size: number);
    /** @inheritdoc */
    computeArea(): number;
    /** @inheritdoc */
    protected drawShape(context: CanvasRenderingContext2D): void;
}
/**
 * @classdesc Regular oval geometric shape
 */
export declare class Oval extends Shape {
    private readonly radiusX;
    private readonly radiusY;
    /**
     * @description Creates an oval.
     * @param coordinates Center of the cross.
     * @param color Fill color.
     * @param radiusX Horizontal radius of the oval.
     * @param radiusY Vertical radius of the oval.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number, radiusX: number, radiusY: number);
    /**
     *  @description Returns the horizontal radius of the oval.
     */
    getRadiusX(): number;
    /**
     * @description Returns the vertical radius of the oval.
     */
    getRadiusY(): number;
    /** @inheritdoc */
    computeArea(): number;
    /** @inheritdoc */
    protected drawShape(context: CanvasRenderingContext2D): void;
}
/**
 * @classdesc Regular diamond geometric shape
 */
export declare class Diamond extends Rectangle {
    /**
     * @description Creates a diamond.
     * @param coordinates Center of the diamond.
     * @param color Fill color.
     * @param width Width of the diamond.
     * @param height Height of the diamond.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number | undefined, width: number, height: number);
    /** @inheritdoc */
    protected drawShape(context: CanvasRenderingContext2D): void;
}
/**
 * @classdesc Heart geometric shape
 */
export declare class Heart extends Shape {
    private readonly size;
    /**
     * @description Creates a heart.
     * @param coordinates Center of the heart.
     * @param color Fill color.
     * @param size Size of the heart.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number, size: number);
    /** @inheritdoc */
    computeArea(): number;
    /** @inheritdoc */
    protected drawShape(context: CanvasRenderingContext2D): void;
}
/**
 * @classdesc Trapezoid geometric shape
 */
export declare class Trapezoid extends Shape {
    private readonly topBase;
    private readonly bottomBase;
    private readonly height;
    /**
     * @description Creates a trapezoid.
     * @param coordinates Center of the trapezoid.
     * @param color Fill color.
     * @param topBase Length of the top base.
     * @param bottomBase Length of the bottom base.
     * @param height Height of the trapezoid.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number, topBase: number, bottomBase: number, height: number);
    /** @inheritdoc */
    computeArea(): number;
    /** @inheritdoc */
    protected drawShape(context: CanvasRenderingContext2D): void;
}
/**
 * @classdesc Arrow geometric shape
 */
export declare class Arrow extends Shape {
    private readonly length;
    private readonly headSize;
    /**
     * @description Creates an arrow.
     * @param coordinates Center of the arrow.
     * @param color Fill color.
     * @param length Length of the arrow.
     * @param headSize Size of the arrowhead.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number, length: number, headSize: number);
    /** @inheritdoc */
    computeArea(): number;
    /** @inheritdoc */
    protected drawShape(context: CanvasRenderingContext2D): void;
}
/**
* @classdesc Clover shape
*/
export declare class Clover extends Shape {
    private readonly size;
    /**
     * @description Creates a clover.
     * @param coordinates Center of the clover.
     * @param color Fill color.
     * @param size Size of the clover.
     */
    constructor(coordinates: Coordinates, color: string, rotation: number, size: number);
    /** @inheritdoc */
    computeArea(): number;
    /** @inheritdoc */
    protected drawShape(context: CanvasRenderingContext2D): void;
}
