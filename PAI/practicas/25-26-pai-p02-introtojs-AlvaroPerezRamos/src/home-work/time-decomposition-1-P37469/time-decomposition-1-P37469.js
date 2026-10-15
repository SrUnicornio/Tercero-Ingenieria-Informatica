/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Jun 30 2026
 * @desc Time decomposition.
 *   The program asks for a number of seconds and decomposes it into hours, minutes, and seconds.
 * @link https://jutge.org/problems/P70955_en
 */
'use strict';

let inputSeconds = 0;

/**
 * Descompone los segundos en horas, minutos y segundos.
 * @param {number} totalSeconds
 * @returns {Object} - { hours, minutes, seconds }
 */
const decomposeTime = (totalSeconds) => {
  const SECONDS_IN_A_MINUTE = 60;
  const SECONDS_IN_AN_HOUR = 3600; // 60 * 60

  const hours = Math.floor(totalSeconds / SECONDS_IN_AN_HOUR);
  const minutes = Math.floor((totalSeconds % SECONDS_IN_AN_HOUR) / SECONDS_IN_A_MINUTE);
  const seconds = totalSeconds % SECONDS_IN_A_MINUTE;

  return { hours, minutes, seconds };
};

/**
 * Programa principal.
 * @returns {void}
 */
const main = () => {
  const { hours, minutes, seconds } = decomposeTime(inputSeconds);
  console.log(`${hours} ${minutes} ${seconds}`); 
};

process.stdin.on('data', (data) => {
  inputSeconds = Number.parseInt(data.toString().trim(), 10);
});

process.stdin.on('end', main);
