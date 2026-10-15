/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Freelancer Rates exercise
 *   The problem is to calculate day rates, budget days, and discounted rates
 *   for freelancers based on hourly rates, number of days, and discounts.
 * @see {@link https://exercism.org/tracks/javascript/exercises/freelancer-rates}
 */

// Constantes para cálculos
const HOURS_PER_DAY = 8;
const BILLABLE_DAYS_PER_MONTH = 22;

/**
 * Calcula la tarifa diaria de un freelancer dado su tarifa por hora.
 * @param {number} hourlyRate - la tarifa por hora del freelancer
 * @returns {number} - la tarifa diaria del freelancer
 */
const dayRate = (hourlyRate) => {
  return hourlyRate * HOURS_PER_DAY;
};

/**
 * Calcula cuántos días puede trabajar un freelancer con un presupuesto dado.
 * @param {number} budget - el presupuesto total disponible
 * @param {number} hourlyRate - la tarifa por hora del freelancer
 * @returns {number} - número de días trabajables dentro del presupuesto
 */
const daysInBudget = (budget, hourlyRate) => {
  return Math.floor(budget / dayRate(hourlyRate));
};

/**
 * Calcula la tarifa total de un proyecto aplicando descuento mensual.
 * @param {number} hourlyRate - la tarifa por hora del freelancer
 * @param {number} numDays - número total de días del proyecto
 * @param {number} discount - descuento aplicado (0.2 = 20%)
 * @returns {number} - coste total redondeado hacia arriba
 */
const priceWithMonthlyDiscount = (hourlyRate, numDays, discount) => {
  const fullMonths = Math.floor(numDays / BILLABLE_DAYS_PER_MONTH);
  const remainingDays = numDays % BILLABLE_DAYS_PER_MONTH;
  const dailyRate = dayRate(hourlyRate);

  const fullMonthCost =
    fullMonths *
    BILLABLE_DAYS_PER_MONTH *
    dailyRate *
    (1 - discount);

  const remainingCost = remainingDays * dailyRate;

  return Math.ceil(fullMonthCost + remainingCost);
};

export { dayRate, daysInBudget, priceWithMonthlyDiscount };
