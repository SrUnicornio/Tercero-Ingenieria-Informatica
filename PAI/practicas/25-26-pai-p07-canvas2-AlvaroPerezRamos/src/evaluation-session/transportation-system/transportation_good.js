/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2021-2022
 *
 * @author F. de Sande
 * @since Feb 27 2024
 * @description El programa modela un sistema de gestión de medios de transporte
 *              El diseño violaba el principio SOLID OCP debido a que el método computePrice tenía una estructura de control que dependía del tipo de transporte, lo que hacía que cada vez que se añadiera un nuevo medio de transporte, se tuviera que modificar el código existente.
 *              Este nuevo diseño no viola el principio
 */
/**
 * Clase que representa un medio de transporte
 */
export class Transportation {
    /**
     * Constructor de la clase Transportation
     */
    constructor(type, distance) {
        this.type = type;
        this.distance = distance;
    }
}
/**
 * Clase que representa un camión
 */
export class Truck extends Transportation {
    constructor(distance) {
        super('Truck', distance);
    }
    /** @inheritdoc */
    computePrice() {
        const basePrice = 500;
        return basePrice * this.distance;
    }
}
/**
 * Clase que representa un barco
 */
export class Ship extends Transportation {
    constructor(distance) {
        super('Ship', distance);
    }
    /** @inheritdoc */
    computePrice() {
        const basePrice = 300;
        return basePrice * this.distance;
    }
}
/**
 * Clase que representa un avión
 */
export class Plane extends Transportation {
    constructor(distance) {
        super('Plane', distance);
    }
    /** @inheritdoc */
    computePrice() {
        const basePrice = 1000;
        return basePrice * this.distance;
    }
}
export function main() {
    const truck = new Truck(100);
    const ship = new Ship(5000);
    console.log('Trasnport price for truck: ' + truck.computePrice() + ' euros');
    console.log('Trasnport price for ship: ' + ship.computePrice() + ' euros');
}
main();
