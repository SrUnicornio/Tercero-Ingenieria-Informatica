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
export declare abstract class Transportation {
    protected type: string;
    protected distance: number;
    /**
     * Constructor de la clase Transportation
     */
    constructor(type: string, distance: number);
    /**
     * @description Método que calcula el precio del transporte
     * @returns El precio del transporte
     */
    abstract computePrice(): number;
}
/**
 * Clase que representa un camión
 */
export declare class Truck extends Transportation {
    constructor(distance: number);
    /** @inheritdoc */
    computePrice(): number;
}
/**
 * Clase que representa un barco
 */
export declare class Ship extends Transportation {
    constructor(distance: number);
    /** @inheritdoc */
    computePrice(): number;
}
/**
 * Clase que representa un avión
 */
export declare class Plane extends Transportation {
    constructor(distance: number);
    /** @inheritdoc */
    computePrice(): number;
}
export declare function main(): void;
