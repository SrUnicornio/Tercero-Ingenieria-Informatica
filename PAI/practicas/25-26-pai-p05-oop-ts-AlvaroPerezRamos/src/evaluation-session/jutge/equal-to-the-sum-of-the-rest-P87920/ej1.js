"use strict";
/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 *
 * @description
 *   El programa, dada una secuencia de números enteros, indicará si hay algún número igual a la suma del resto.
 *   La entrada contiene varios casos. Cada caso comienza con un número number ≥ 1 seguido de number números enteros.
 *   Para cada caso, el programa indicará si hay algún número igual a la suma del resto.
 *
 * @author Álvaro Pérez Ramos
 * @since 24 FEB 2026
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComputeSecuence = void 0;
exports.checkSizeOfSecuence = checkSizeOfSecuence;
exports.sizeMustBePositive = sizeMustBePositive;
var fichero = require("fs");
var ComputeSecuence = /** @class */ (function () {
    function ComputeSecuence(secuence) {
        this.secuence = secuence;
    }
    ComputeSecuence.prototype.getSequence = function () {
        return this.secuence;
    };
    /**
     * Comprueba si hay algún número en la secuencia que sea igual a la suma del resto de los números.
     * @returns 'YES' si existe tal número, 'NO' en caso contrario.
     */
    ComputeSecuence.prototype.isEqualToSumOfRest = function () {
        var totalSum = this.secuence.reduce(function (acc, num) { return acc + num; }, 0);
        for (var _i = 0, _a = this.secuence; _i < _a.length; _i++) {
            var num = _a[_i];
            if (num === totalSum - num) {
                return 'YES';
            }
        }
        return 'NO';
    };
    return ComputeSecuence;
}());
exports.ComputeSecuence = ComputeSecuence;
/**
 * Función para verificar que el número de elementos en la secuencia es correcto.
 * @param size El número esperado de elementos.
 * @param secuence La secuencia de números a verificar.
 * @throws Error si el tamaño de la secuencia no coincide con el número esperado.
 */
function checkSizeOfSecuence(size, secuence) {
    if (size !== secuence.length) {
        throw new Error("El tama\u00F1o de la secuencia (".concat(secuence.length, ") no coincide con el n\u00FAmero esperado (").concat(size, ")."));
    }
}
/**
 * Función para verificar que el tamaño de la secuencia es un número positivo.
 * @param size El número de elementos en la secuencia.
 * @throws Error si el tamaño de la secuencia no es un número positivo.
 */
function sizeMustBePositive(size) {
    if (size < 1) {
        throw new Error("El tama\u00F1o de la secuencia debe ser un n\u00FAmero positivo. Se recibi\u00F3: ".concat(size));
    }
}
/**
 * Función principal que lee la entrada, procesa cada caso y muestra el resultado.
 */
function main() {
    var input = fichero.readFileSync(0, 'utf-8').trim();
    if (!input)
        return;
    var tokens = input.split(/\s+/).map(Number);
    var index = 0;
    while (index < tokens.length) {
        var size = tokens[index++];
        sizeMustBePositive(size);
        var secuence = tokens.slice(index, index + size);
        checkSizeOfSecuence(size, secuence);
        index += size;
        var compute = new ComputeSecuence(secuence);
        console.log(compute.isEqualToSumOfRest());
    }
}
if (require.main === module) {
    main();
}
