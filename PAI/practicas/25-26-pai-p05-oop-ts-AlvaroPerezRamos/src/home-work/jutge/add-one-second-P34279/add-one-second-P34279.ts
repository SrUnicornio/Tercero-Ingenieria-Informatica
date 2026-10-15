/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Add one second.
 *   The program asks for a time in hours, minutes, and seconds,
 *   adds one second to it, and displays the new time.
 * 
 * @see {@link https://jutge.org/problems/P34279_en}
 */

import * as fs from 'fs';

/**
 * Represents a time value.
 * Value Object (immutable by convention).
 */
export interface Time {
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
}

/* CONSTANTS */
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

const SECONDS_IN_HOUR = MINUTES_IN_HOUR * SECONDS_IN_MINUTE;
const SECONDS_IN_DAY = HOURS_IN_DAY * SECONDS_IN_HOUR;

/**
 * @description Adds one second to a given time.
 * @param time - The original time to which one second will be added.
 * @returns A new Time object representing the time after adding one second.
 */
export function addOneSecond(time: Time): Time {
  const totalSeconds =
    time.hours * SECONDS_IN_HOUR +
    time.minutes * SECONDS_IN_MINUTE +
    time.seconds +
    1;

  const normalized = totalSeconds % SECONDS_IN_DAY;

  const hours = Math.floor(normalized / SECONDS_IN_HOUR);
  const minutes = Math.floor(
    (normalized % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE,
  );
  const seconds = normalized % SECONDS_IN_MINUTE;

  return { hours, minutes, seconds };
}

/**
 * @description Validates that a given value is an integer within the specified range.
 * @param value - The value to validate.
 * @param maxExclusive - The exclusive upper bound for the valid range (0 to maxExclusive - 1).
 * @param name - The name of the value being validated, used for error messages.
 * @throws Will throw an error if the value is not an integer or is out of range.
 */
function validateRange(
  value: number,
  maxExclusive: number,
  name: string,
): void {
  if (!Number.isInteger(value)) {
    throw new Error(`${name} must be an integer`);
  }

  if (value < 0 || value >= maxExclusive) {
    throw new Error(
      `${name} must be between 0 and ${maxExclusive - 1}`,
    );
  }
}

/**
 * @description Validates a complete time.
 * @param hours - The hours component of the time to validate.
 * @param minutes - The minutes component of the time to validate.
 * @param seconds - The seconds component of the time to validate.
 * @throws Will throw an error if any of the components are invalid.
 */
export function validateTime(
  hours: number,
  minutes: number,
  seconds: number,
): void {
  validateRange(hours, HOURS_IN_DAY, 'hours');
  validateRange(minutes, MINUTES_IN_HOUR, 'minutes');
  validateRange(seconds, SECONDS_IN_MINUTE, 'seconds');
}

/**
 * @description Formats a Time object into a string representation.
 * @param time - The Time object to format as a string 
 * @returns A string representation of the time in the format "hh mm ss", with leading zeros for single-digit values.
 */
export function formatTime(time: Time): string {
  const hh = time.hours.toString().padStart(2, '0');
  const mm = time.minutes.toString().padStart(2, '0');
  const ss = time.seconds.toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

/**
 * @description Parses a string input into a Time object.
 * @param input - The input string containing hours, minutes, and seconds separated by spaces.
 * @returns A Time object representing the parsed time.
 * @throws Will throw an error if the input format is invalid or if the time values are out of range.
 */
function parseInput(input: string): Time {
  const [hours, minutes, seconds] = input
    .trim()
    .split(' ')
    .map(Number);

  validateTime(hours, minutes, seconds);

  return { hours, minutes, seconds };
}

/**
 * The main function that orchestrates reading input, processing the time, and outputting the result.
 * It reads a time from standard input, adds one second to it, and prints the resulting time.
 */
function main(): void {
  const input = fs.readFileSync(0, 'utf-8');
  const time = parseInput(input);

  const result = addOneSecond(time);

  console.log(formatTime(result));
}

if (require.main === module) {
  main();
}