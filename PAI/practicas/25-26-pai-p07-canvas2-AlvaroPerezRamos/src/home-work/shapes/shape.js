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
 * @classdesc Abstract base class representing a drawable geometric shape.
 *
 * This class defines the common properties and behaviour shared by
 * all shapes in the application.
 */
export class Shape {
    /**
     * @description Creates a new Shape.
     * @param coordinates Position of the shape in the canvas.
     * @param color Fill color of the shape.
     * @param rotation Rotation angle in degrees (default is 0).
     */
    constructor(coordinates, color, rotation = 0) {
        this.coordinates = coordinates;
        this.color = color;
        this.rotation = rotation;
    }
    /**
     * @description Returns the coordinates of the shape.
     */
    getCoordinates() {
        return this.coordinates;
    }
    /**
     * @description Returns the color of the shape.
     */
    getColor() {
        return this.color;
    }
    /**
     * @description Returns the rotation angle of the shape in degrees.
     */
    getRotation() {
        return this.rotation;
    }
    /**
     * @description Returns the type of the shape based on its constructor name.
     */
    getType() {
        return this.constructor.name.toLowerCase();
    }
    /**
     * @description Draw method used by the client.
     * Handles translation and rotation.
     * @param context Canvas rendering context.
     */
    draw(context) {
        context.save();
        context.translate(this.coordinates.x, this.coordinates.y);
        context.rotate(this.rotation * Math.PI / 180);
        context.fillStyle = this.color;
        this.drawShape(context);
        // this.drawCenter(context);
        context.restore();
    }
    /**
     * @description Draws a small circle at the center of the shape for debugging purposes.
     * @param context Canvas rendering context.
     */
    drawCenter(context) {
        context.save();
        context.fillStyle = (this.color === 'black') ? 'white' : 'black';
        context.beginPath();
        context.arc(0, 0, 3, 0, 2 * Math.PI);
        context.fill();
        context.restore();
    }
}
/**
 * @classdesc Circle geometric shape.
 */
export class Circle extends Shape {
    /**
     * @description Creates a new circle.
     * @param coordinates Center coordinates.
     * @param color Fill color.
     * @param radius Circle radius.
     */
    constructor(coordinates, color, rotation, radius) {
        super(coordinates, color, rotation);
        this.radius = radius;
    }
    /** @inheritdoc */
    computeArea() {
        return Math.PI * this.radius ** 2;
    }
    /** @inheritdoc */
    drawShape(context) {
        context.beginPath();
        context.arc(0, 0, this.radius, 0, 2 * Math.PI);
        context.fill();
    }
}
/**
 * @classdesc Rectangle geometric shape.
 */
export class Rectangle extends Shape {
    /**
     * @description Creates a rectangle.
     * @param coordinates Top-left corner coordinates.
     * @param color Fill color.
     * @param width Rectangle width.
     * @param height Rectangle height.
     */
    constructor(coordinates, color, rotation, width, height) {
        super(coordinates, color, rotation);
        this.width = width;
        this.height = height;
    }
    /** @inheritdoc */
    computeArea() {
        return this.width * this.height;
    }
    /** @inheritdoc */
    drawShape(context) {
        context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    }
}
/**
 * @classdesc Square geometric shape.
 *
 * A square is a specific type of rectangle where width = height.
 */
export class Square extends Rectangle {
    /**
     * @description Creates a square.
     * @param coordinates Top-left corner coordinates.
     * @param color Fill color.
     * @param side Length of the square side.
     */
    constructor(coordinates, color, rotation = 0, side) {
        super(coordinates, color, rotation, side, side);
        this.side = side;
    }
}
/**
 * @classdesc Triangle geometric shape.
 */
export class Triangle extends Shape {
    /**
     * @description Creates a triangle.
     * @param coordinates Bottom-left vertex.
     * @param color Fill color.
     * @param base Base length.
     * @param height Triangle height.
     */
    constructor(coordinates, color, rotation, base, height) {
        super(coordinates, color, rotation);
        this.base = base;
        this.height = height;
    }
    /** @inheritdoc */
    computeArea() {
        return (this.base * this.height) / 2;
    }
    /** @inheritdoc */
    drawShape(context) {
        context.beginPath();
        context.moveTo(-this.base / 2, this.height / 2);
        context.lineTo(this.base / 2, this.height / 2);
        context.lineTo(0, -this.height / 2);
        context.closePath();
        context.fill();
    }
}
/**
 * @description Mapping of number of sides to polygon names for regular polygons.
 */
const POLYGON_NAMES = {
    3: 'triangle',
    4: 'square',
    5: 'pentagon',
    6: 'hexagon',
    7: 'heptagon',
    8: 'octagon',
    9: 'nonagon',
    10: 'decagon',
    12: 'dodecagon',
    20: 'icosagon',
};
/**
 * @classdesc Polygon geometric shape.
 */
export class Polygon extends Shape {
    /**
     * @description Creates a regular polygon.
     * @param coordinates Center of the polygon.
     * @param color Fill color.
     * @param sides Number of sides of the polygon.
     * @param radius Distance from center to vertices.
     */
    constructor(coordinates, color, rotation, sides, radius) {
        super(coordinates, color, rotation);
        this.sides = sides;
        this.radius = radius;
    }
    /**
     * @description Returns the name of the polygon.
     * @returns The name of the polygon based on its number of sides,
     * or a generic name if not predefined.
     */
    getType() {
        if (this.sides > 20) {
            return 'circle';
        }
        if (!Number.isInteger(this.sides)) {
            return 'irregular polygon';
        }
        const name = POLYGON_NAMES[this.sides];
        return name ?? `${this.sides}-gon`;
    }
    /** @inheritdoc */
    computeArea() {
        const side = 2 * this.radius * Math.sin(Math.PI / this.sides);
        const apothem = this.radius * Math.cos(Math.PI / this.sides);
        return (this.sides * side * apothem) / 2;
    }
    /** @inheritdoc */
    drawShape(context) {
        const startAngle = -Math.PI / 2;
        const angle = (2 * Math.PI) / this.sides;
        context.beginPath();
        const startX = this.radius * Math.cos(startAngle);
        const startY = this.radius * Math.sin(startAngle);
        context.moveTo(startX, startY);
        for (let i = 1; i < this.sides; i++) {
            const coordinateX = this.radius * Math.cos(startAngle + i * angle);
            const coordinateY = this.radius * Math.sin(startAngle + i * angle);
            context.lineTo(coordinateX, coordinateY);
        }
        context.closePath();
        context.fill();
    }
}
/**
 * @description Mapping of number of points to star names for regular stars.
 */
const STAR_NAMES = {
    3: 'tri-star',
    4: 'tetragram',
    5: 'pentagram',
    6: 'hexagram',
    7: 'heptagram',
    8: 'octagram',
    9: 'enneagram',
    10: 'decagram',
    12: 'dodecagram',
};
/**
 * @classdesc Star geometric shape.
 */
export class Star extends Shape {
    /**
     * @description Creates a regular star.
     * @param coordinates Center of the star.
     * @param color Fill color.
     * @param points Number of points of the star.
     * @param outerRadius Distance from center to outer vertices.
     * @param innerRadius Distance from center to inner vertices.
     */
    constructor(coordinates, color, rotation, points, outerRadius, innerRadius) {
        super(coordinates, color, rotation);
        this.points = points;
        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius;
    }
    /**
     * @description Returns the name of the stars.
     * @returns The name of the satras based on its number of points,
     * or a generic name if not predefined.
     */
    getType() {
        if (this.points > 20) {
            return 'star';
        }
        if (!Number.isInteger(this.points)) {
            return 'irregular star';
        }
        const name = STAR_NAMES[this.points];
        return name ?? `${this.points}-star`;
    }
    /** @inheritdoc */
    computeArea() {
        return Math.PI * this.outerRadius ** 2;
    }
    /** @inheritdoc */
    drawShape(context) {
        const step = Math.PI / this.points;
        const startAngle = -Math.PI / 2;
        context.beginPath();
        for (let i = 0; i < this.points * 2; i++) {
            const radius = (i % 2 === 0) ?
                this.outerRadius :
                this.innerRadius;
            const angle = startAngle + i * step;
            const coordinateX = radius * Math.cos(angle);
            const coordinateY = radius * Math.sin(angle);
            if (i === 0) {
                context.moveTo(coordinateX, coordinateY);
            }
            else {
                context.lineTo(coordinateX, coordinateY);
            }
        }
        context.closePath();
        context.fill();
    }
}
/**
 * @classdesc Regular cross geometric shape.
 */
export class Cross extends Shape {
    /**
     * @description Creates a cross.
     * @param coordinates Center of the cross.
     * @param color Fill color.
     * @param size Size of the cross arms.
     */
    constructor(coordinates, color, rotation, size) {
        super(coordinates, color, rotation);
        this.size = size;
    }
    /** @inheritdoc */
    computeArea() {
        return this.size ** 2;
    }
    /** @inheritdoc */
    drawShape(context) {
        const armSize = this.size / 3;
        // Draw vertical arm
        context.fillRect(-armSize / 2, -this.size / 2, armSize, this.size);
        // Draw horizontal arm
        context.fillRect(-this.size / 2, -armSize / 2, this.size, armSize);
    }
}
/**
 * @classdesc Regular oval geometric shape
 */
export class Oval extends Shape {
    /**
     * @description Creates an oval.
     * @param coordinates Center of the cross.
     * @param color Fill color.
     * @param radiusX Horizontal radius of the oval.
     * @param radiusY Vertical radius of the oval.
     */
    constructor(coordinates, color, rotation, radiusX, radiusY) {
        super(coordinates, color, rotation);
        this.radiusX = radiusX;
        this.radiusY = radiusY;
    }
    /**
     *  @description Returns the horizontal radius of the oval.
     */
    getRadiusX() {
        return this.radiusX;
    }
    /**
     * @description Returns the vertical radius of the oval.
     */
    getRadiusY() {
        return this.radiusY;
    }
    /** @inheritdoc */
    computeArea() {
        return Math.PI * this.radiusX * this.radiusY;
    }
    /** @inheritdoc */
    drawShape(context) {
        context.beginPath();
        context.ellipse(0, 0, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
        context.fill();
    }
}
/**
 * @classdesc Regular diamond geometric shape
 */
export class Diamond extends Rectangle {
    /**
     * @description Creates a diamond.
     * @param coordinates Center of the diamond.
     * @param color Fill color.
     * @param width Width of the diamond.
     * @param height Height of the diamond.
     */
    constructor(coordinates, color, rotation = 0, width, height) {
        super(coordinates, color, rotation, width, height);
    }
    /** @inheritdoc */
    drawShape(context) {
        context.beginPath();
        context.moveTo(0, -this.height / 2);
        context.lineTo(this.width / 2, 0);
        context.lineTo(0, this.height / 2);
        context.lineTo(-this.width / 2, 0);
        context.closePath();
        context.fill();
    }
}
/**
 * @classdesc Heart geometric shape
 */
export class Heart extends Shape {
    /**
     * @description Creates a heart.
     * @param coordinates Center of the heart.
     * @param color Fill color.
     * @param size Size of the heart.
     */
    constructor(coordinates, color, rotation, size) {
        super(coordinates, color, rotation);
        this.size = size;
    }
    /** @inheritdoc */
    computeArea() {
        return (this.size ** 2 * Math.PI) / 2;
    }
    /** @inheritdoc */
    drawShape(context) {
        const topCurveHeight = this.size * 0.3;
        context.beginPath();
        context.moveTo(0, topCurveHeight);
        context.bezierCurveTo(this.size / 2, -topCurveHeight, this.size, topCurveHeight, 0, this.size);
        context.bezierCurveTo(-this.size, topCurveHeight, -this.size / 2, -topCurveHeight, 0, topCurveHeight);
        context.closePath();
        context.fill();
    }
}
/**
 * @classdesc Trapezoid geometric shape
 */
export class Trapezoid extends Shape {
    /**
     * @description Creates a trapezoid.
     * @param coordinates Center of the trapezoid.
     * @param color Fill color.
     * @param topBase Length of the top base.
     * @param bottomBase Length of the bottom base.
     * @param height Height of the trapezoid.
     */
    constructor(coordinates, color, rotation, topBase, bottomBase, height) {
        super(coordinates, color, rotation);
        this.topBase = topBase;
        this.bottomBase = bottomBase;
        this.height = height;
    }
    /** @inheritdoc */
    computeArea() {
        return ((this.topBase + this.bottomBase) / 2) * this.height;
    }
    /** @inheritdoc */
    drawShape(context) {
        const halfTopBase = this.topBase / 2;
        const halfBottomBase = this.bottomBase / 2;
        context.beginPath();
        context.moveTo(-halfBottomBase, this.height / 2);
        context.lineTo(halfBottomBase, this.height / 2);
        context.lineTo(halfTopBase, -this.height / 2);
        context.lineTo(-halfTopBase, -this.height / 2);
        context.closePath();
        context.fill();
    }
}
/**
 * @classdesc Arrow geometric shape
 */
export class Arrow extends Shape {
    /**
     * @description Creates an arrow.
     * @param coordinates Center of the arrow.
     * @param color Fill color.
     * @param length Length of the arrow.
     * @param headSize Size of the arrowhead.
     */
    constructor(coordinates, color, rotation, length, headSize) {
        super(coordinates, color, rotation);
        this.length = length;
        this.headSize = headSize;
    }
    /** @inheritdoc */
    computeArea() {
        return this.length * this.headSize;
    }
    /** @inheritdoc */
    drawShape(context) {
        context.beginPath();
        context.moveTo(0, -this.length / 2);
        context.lineTo(0, this.length / 2);
        context.lineTo(-this.headSize / 2, this.length / 2 - this.headSize);
        context.moveTo(0, this.length / 2);
        context.lineTo(this.headSize / 2, this.length / 2 - this.headSize);
        context.stroke();
    }
}
/**
* @classdesc Clover shape
*/
export class Clover extends Shape {
    /**
     * @description Creates a clover.
     * @param coordinates Center of the clover.
     * @param color Fill color.
     * @param size Size of the clover.
     */
    constructor(coordinates, color, rotation, size) {
        super(coordinates, color, rotation);
        this.size = size;
    }
    /** @inheritdoc */
    computeArea() {
        const r = this.size / 4;
        return 4 * Math.PI * r * r;
    }
    /** @inheritdoc */
    drawShape(context) {
        const radius = this.size / 4;
        context.beginPath();
        context.arc(0, -radius, radius, 0, 2 * Math.PI);
        context.arc(radius, 0, radius, 0, 2 * Math.PI);
        context.arc(0, radius, radius, 0, 2 * Math.PI);
        context.arc(-radius, 0, radius, 0, 2 * Math.PI);
        context.fill();
    }
}
