"use strict";
/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 *
 * @description point in rectangle - X53379
 *   The input consists of several rectangles (four non-negative integer numbers: the width, the height, and the coordinates of the lower-left corner), each followed by a point (two non-negative integer numbers).
 *
 * @author Álvaro Pérez Ramos
 * @since 24 FEB 2026
 * @see {@link https://jutge.org/problems/x53379_en }
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rectangle = exports.Point = void 0;
exports.checkNonNegativeNumbers = checkNonNegativeNumbers;
var fichero = require("fs");
/**
 * Clase que representa un punto en un plano cartesiano.
 */
var Point = /** @class */ (function () {
    function Point(xCoordinate, yCoordinate) {
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
    }
    // Getters para las coordenadas del punto
    Point.prototype.getXCoordinate = function () {
        return this.xCoordinate;
    };
    Point.prototype.getYCoordinate = function () {
        return this.yCoordinate;
    };
    return Point;
}());
exports.Point = Point;
/**
 * Clase que representa un rectángulo en un plano cartesiano.
 */
var Rectangle = /** @class */ (function () {
    function Rectangle(width, height, lowerLeftCorner) {
        this.width = width;
        this.height = height;
        this.lowerLeftCorner = lowerLeftCorner;
    }
    /**
     * Establece la esquina inferior izquierda del rectángulo.
     * @param point Comprueba si el punto dado está dentro del rectángulo, incluyendo los bordes.
     * @returns true si el punto está dentro del rectángulo, false en caso contrario.
     */
    Rectangle.prototype.rectangleContainsPoint = function (point) {
        var xMin = this.lowerLeftCorner.getXCoordinate();
        var xMax = xMin + this.width;
        var yMin = this.lowerLeftCorner.getYCoordinate();
        var yMax = yMin + this.height;
        return (point.getXCoordinate() >= xMin &&
            point.getXCoordinate() <= xMax &&
            point.getYCoordinate() >= yMin &&
            point.getYCoordinate() <= yMax);
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
/**
 * Función para verificar que los numeros de entrada son no negativos.
 * @param numbers Un array de números a verificar.
 */
function checkNonNegativeNumbers(numbers) {
    for (var _i = 0, numbers_1 = numbers; _i < numbers_1.length; _i++) {
        var number = numbers_1[_i];
        if (number < 0) {
            throw new Error("Todos los n\u00FAmeros deben ser no negativos. Se recibieron: ".concat(numbers.join(', ')));
        }
    }
}
/**
 * Función principal que lee la entrada, procesa cada caso y muestra el resultado.
 */
function main() {
    var input = fichero.readFileSync(0, 'utf-8').trim();
    var lines = input.split('\n');
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var values = line.split(' ').map(Number);
        checkNonNegativeNumbers(values);
        var width = values[0], height = values[1], xCorner = values[2], yCorner = values[3], xPoint = values[4], yPoint = values[5];
        var rectangle = new Rectangle(width, height, new Point(xCorner, yCorner));
        var point = new Point(xPoint, yPoint);
        if (rectangle.rectangleContainsPoint(point)) {
            console.log('inside');
        }
        else {
            console.log('outside');
        }
    }
}
if (require.main === module) {
    main();
}
