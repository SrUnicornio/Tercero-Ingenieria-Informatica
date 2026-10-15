/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 * 
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Annalyn's Infiltration exercise
 *   The problem is to determine if you can execute a fast attack, spy on someone, signal the prisoner, or free the prisoner based on the state of the knight, archer, prisoner, and pet dog.
 * @see {@link https://exercism.org/tracks/javascript/exercises/annalyns-infiltration}
 */


/**
 * Determina si puedes ejecutar un ataque rápido, lo cual es posible si el caballero está dormido.
 * @param {boolean} knightIsAwake - si el caballero está despierto o no
 * @returns {boolean} - true si puedes ejecutar un ataque rápido, false de lo contrario
 */
const canExecuteFastAttack = (knightIsAwake) => {
  return !knightIsAwake;
}

/**
 * Determina si puedes espiar a alguien, lo cual es posible si cualquiera del caballero, arquero o prisionero está despierto.
 * @param {boolean} knightIsAwake - si el caballero está despierto o no
 * @param {boolean} archerIsAwake - si el arquero está despierto o no
 * @param {boolean} prisonerIsAwake - si el prisionero está despierto o no
 * @returns {boolean} - true si puedes espiar a alguien, false de lo contrario
 */
const canSpy = (knightIsAwake, archerIsAwake, prisonerIsAwake) => {
  return knightIsAwake || archerIsAwake || prisonerIsAwake;
}

/**
 * Determina si puedes señalar al prisionero, lo cual es posible si el arquero está dormido y el prisionero está despierto.
 * @param {boolean} archerIsAwake - si el arquero está despierto o no
 * @param {boolean} prisonerIsAwake - si el prisionero está despierto o no
 * @returns {boolean} - true si puedes señalar al prisionero, false de lo contrario
 */
const canSignalPrisoner = (archerIsAwake, prisonerIsAwake) => {
  return !archerIsAwake && prisonerIsAwake;
}

/**
 * Determina si puedes liberar al prisionero, lo cual es posible si el prisionero está despierto, el perro no está presente, y tanto el caballero como el arquero están dormidos.
 * @param {boolean} knightIsAwake - si el caballero está despierto o no
 * @param {boolean} archerIsAwake - si el arquero está despierto o no
 * @param {boolean} prisonerIsAwake - si el prisionero está despierto o no
 * @param {boolean} dogIsPresent - si el perro está presente o no
 * @returns {boolean} - true si puedes liberar al prisionero, false de lo contrario
 */
const canFreePrisoner = (knightIsAwake, archerIsAwake, prisonerIsAwake, dogIsPresent) => {
  return (dogIsPresent && !archerIsAwake) || (prisonerIsAwake && !knightIsAwake && !archerIsAwake);

}
export {canExecuteFastAttack, canSpy, canSignalPrisoner, canFreePrisoner}