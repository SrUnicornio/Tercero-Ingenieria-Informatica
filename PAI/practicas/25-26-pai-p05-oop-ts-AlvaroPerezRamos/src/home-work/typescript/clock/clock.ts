/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Asignatura: Programación de Aplicaciones Interactivas
 * 
 * @description Clock
 *  Implementa la clase Clock que representa un reloj de 24 horas. 
 * 
 * @author Alvaro Pérez Ramos   -   alu0101574042@ull.edu.es
 * @since 24 FEB 2026
 * @see {@link https://exercism.org/tracks/typescript/exercises/pangram}
 */

const MINUTES_IN_HOUR = 60
const HOURS_IN_DAY = 24
const MINUTES_IN_DAY = MINUTES_IN_HOUR * HOURS_IN_DAY

/**
 * Clase que representa un reloj de 24 horas.
 */
export class Clock {
  private totalMinutes: number

  /**
   * Crea un nuevo reloj con la hora y los minutos especificados. Si los minutos no se especifican, se asumen como 0.
   * Si la hora o los minutos son negativos o mayores que 23 o 59 respectivamente, se ajustan para que sean válidos.
   * @param hour - La hora del reloj (0-23)
   * @param minute - Los minutos del reloj (0-59), opcional
   */
  constructor(private hour: number, private minute?: number) {
    this.minute = minute ?? 0
    this.totalMinutes = (hour * MINUTES_IN_HOUR + this.minute) % MINUTES_IN_DAY
    if (this.totalMinutes < 0) {
      this.totalMinutes += MINUTES_IN_DAY
    }
  }

  /**
   * Devuelve una representación en cadena de texto del reloj en formato "HH:MM".
   * @returns Una cadena de texto con el formato "HH:MM" que representa la hora del reloj.
   */
  public toString(): string {
    const hours = Math.floor(this.totalMinutes / MINUTES_IN_HOUR)
    const minutes = this.totalMinutes % MINUTES_IN_HOUR
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` 
  }

  /**
   * Devuelve un nuevo reloj que representa la hora resultante de sumar los minutos especificados al reloj actual.
   * 
   * @param minutes - El número de minutos a sumar al reloj actual.
   * @returns Un nuevo reloj que representa la hora resultante de sumar los minutos especificados al reloj actual.
   */
  public plus(minutes: number): Clock {
    const newTotalMinutes = (this.totalMinutes + minutes) % MINUTES_IN_DAY
    return new Clock(0, newTotalMinutes)
  }

  /**
   * Devuelve un nuevo reloj que representa la hora resultante de restar los minutos especificados al reloj actual.
   * 
   * @param minutes - El número de minutos a restar al reloj actual.
   * @returns Un nuevo reloj que representa la hora resultante de restar los minutos especificados al reloj actual.
   */
  public minus(minutes: number): Clock {
    const newTotalMinutes = (this.totalMinutes - minutes) % MINUTES_IN_DAY
    return new Clock(0, newTotalMinutes)
  }

  /**
   * Compara el reloj actual con otro reloj y devuelve true si ambos relojes representan la misma hora, o false en caso contrario.
   * 
   * @param other - El otro reloj con el que se va a comparar el reloj actual. 
   * @returns true si ambos relojes representan la misma hora, o false en caso contrario.
   */
  public equals(other: Clock): boolean {
    return this.totalMinutes === other.totalMinutes
  }
}
