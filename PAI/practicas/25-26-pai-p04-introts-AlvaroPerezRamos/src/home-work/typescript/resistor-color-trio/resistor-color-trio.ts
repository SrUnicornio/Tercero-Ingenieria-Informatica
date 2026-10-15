/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas (PAI)
 *
 * Resistor Color Trio.
 *
 * Given three color bands, this module computes the resistance value
 * and formats it using the appropriate unit.
 *
 * @see https://exercism.org/tracks/typescript/exercises/resistor-color-trio
 *
 * @author Álvaro Pérez Ramos
 * @since 2026-02-15
 */

/**
 * Available resistor colors ordered by their numeric value.
 */
export const COLORS: string[] = [
  'black',
  'brown',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'violet',
  'grey',
  'white',
];

/**
 * Decodes the value of a resistor based on its color bands.
 *
 * @param colors Array of three color names.
 * @returns Formatted resistor value with unit.
 */
export function decodedResistorValue(colors: string[]): string {
  const baseValue =
    COLORS.indexOf(colors[0]) * 10 +
    COLORS.indexOf(colors[1]);

  const multiplier = Math.pow(
    10,
    COLORS.indexOf(colors[2]),
  );

  let value = baseValue * multiplier;
  let unit = 'ohms';

  if (value >= 1e9) {
    value /= 1e9;
    unit = 'gigaohms';
  } else if (value >= 1e6) {
    value /= 1e6;
    unit = 'megaohms';
  } else if (value >= 1e3) {
    value /= 1e3;
    unit = 'kiloohms';
  }

  return `${value} ${unit}`;
}
