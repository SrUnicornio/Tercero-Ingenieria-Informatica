/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 24 FEB 2026
 * Contiene la clase MySet que representa un conjunto de elementos
 */

/**
 * Clase que representa un conjunto de elementos
 */
export class MySet {
  private mask: number;

  /**
   * Constructor de la clase MySet
   * 
   * @param values - Valores iniciales del conjunto (opcional)
   */
  constructor(values: number[] = []) {
    this.mask = 0;
    values.forEach((v) => this.add(v));
  }

  /**
   * Comprueba que el valor es un número natural mayor o igual a 1
   * 
   * @param value - Valor a comprobar
   */
  private static checkValue(value: number): void {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error('Solo naturales >= 1');
    }
  }

  /**
   * Añade un valor al conjunto
   * 
   * @param value - Valor a añadir al conjunto
   */
  add(value: number): void {
    MySet.checkValue(value);
    this.mask |= 1 << value;
  }

  /**
   * Comprueba si un valor está presente en el conjunto
   * 
   * @param value - Valor a comprobar
   * @returns true si el valor estaba presente en el conjunto, false en caso contrario
   */
  has(value: number): boolean {
    return (this.mask & (1 << value)) !== 0;
  }

  /**
   * Calcula el número de elementos en el conjunto
   * 
   * @returns El número de elementos en el conjunto
   */
  size(): number {
    let count = 0;
    let m = this.mask;
    while (m) {
      count += m & 1;
      m >>= 1;
    }
    return count;
  }

  /**
   * Calcula la unión de dos conjuntos
   * 
   * @param other - Conjunto con el que se va a calcular la unión 
   * @returns Un nuevo conjunto que es la unión de los dos conjuntos
   */
  union(other: MySet): MySet {
    const r = new MySet();
    r.mask = this.mask | other.mask;
    return r;
  }

  /**
   * Calcula la intersección de dos conjuntos
   * 
   * @param other - Conjunto con el que se va a calcular la intersección
   * @returns Un nuevo conjunto que es la intersección de los dos conjuntos
   */
  intersection(other: MySet): MySet {
    const r = new MySet();
    r.mask = this.mask & other.mask;
    return r;
  }

  /**
   * Calcula la diferencia de dos conjuntos
   * 
   * @param other - Conjunto con el que se va a calcular la diferencia
   * @returns Un nuevo conjunto que es la diferencia de los dos conjuntos
   */
  difference(other: MySet): MySet {
    const r = new MySet();
    r.mask = this.mask & ~other.mask;
    return r;
  }

  /**
   * Comprueba si el conjunto está vacío
   * 
   * @returns true si el conjunto está vacío, false en caso contrario
   */
  isEmpty(): boolean {
    return this.mask === 0;
  }

  /**
   * Comprueba si el conjunto es un subconjunto de otro conjunto
   * 
   * @param other - Conjunto con el que se va a comparar
   * @returns true si el conjunto es un subconjunto del otro conjunto, false en caso contrario
   */
  isSubsetOf(other: MySet): boolean {
    return (this.mask & other.mask) === this.mask;
  }

  /**
   * Comprueba si el conjunto es disjunto de otro conjunto
   * 
   * @param other - Conjunto con el que se va a comparar
   * @returns true si el conjunto es disjunto del otro conjunto, false en caso contrario
   */
  isDisjointFrom(other: MySet): boolean {
    return (this.mask & other.mask) === 0;
  }

  /**
   * Comprueba si dos conjuntos son iguales
   * 
   * @param other - Conjunto con el que se va a comparar
   * @returns true si los conjuntos son iguales, false en caso contrario
   */
  isEqual(other: MySet): boolean {
    return this.mask === other.mask;
  }

  /**
   * Devuelve una representación en forma de cadena del conjunto
   * 
   * @returns Una cadena que representa el conjunto
   */
  toString(): string {
    const elems: number[] = [];
    for (let i = 1; i < 32; i++) {
      if (this.has(i)) elems.push(i);
    }
    return `{${elems.join(', ')}}`;
  }
}