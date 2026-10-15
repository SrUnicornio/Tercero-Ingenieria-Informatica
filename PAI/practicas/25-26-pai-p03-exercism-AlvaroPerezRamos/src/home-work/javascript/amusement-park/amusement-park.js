/// <reference path="./global.d.ts" />
// @ts-check

/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since Feb 04 2026
 * @desc Amusement Park exercise
 *   The problem is to manage visitors and their tickets in an amusement park.
 * @see {@link https://exercism.org/tracks/javascript/exercises/amusement-park}
 */

/**
 * Creates a new visitor.
 *
 * @param {string} name
 * @param {number} age
 * @param {string} ticketId
 * @returns {Visitor} the visitor that was created
 */
const createVisitor = (name, age, ticketId) => {
  const visitor = {
    name: name,
    age: age,
    ticketId: ticketId
  };
  return visitor;
};

/**
 * Revokes a ticket for a visitor.
 *
 * @param {Visitor} visitor the visitor with an active ticket
 * @returns {Visitor} the visitor without a ticket
 */
const revokeTicket = (visitor) => {
  visitor.ticketId = null;
  return visitor;
};

/**
 * Determines the status a ticket has in the ticket tracking object.
 *
 * @param {Record<string, string|null>} tickets
 * @param {string} ticketId
 * @returns {string} ticket status
 */
const ticketStatus = (tickets, ticketId) => {
  if (tickets[ticketId] === undefined) {
    return 'unknown ticket id';
  }
  if (tickets[ticketId] === null) {
    return 'not sold';
  }
  const visitorName = tickets[ticketId];
  return `sold to ${visitorName}`;
}

/**
 * Determines the status a ticket has in the ticket tracking object
 * and returns a simplified status message.
 *
 * @param {Record<string, string|null>} tickets
 * @param {string} ticketId
 * @returns {string} ticket status
 */
const simpleTicketStatus = (tickets, ticketId) => {
  const visitorName = tickets[ticketId];
  if (visitorName === undefined || visitorName === null) {
    return 'invalid ticket !!!';
  }
  return visitorName;
};

/**
 * Determines the version of the GTC that was signed by the visitor.
 *
 * @param {VisitorWithGtc} visitor
 * @returns {string | undefined} version
 */
const gtcVersion = (visitor) => {
  return visitor.gtc?.version;
};

export {
  createVisitor,
  revokeTicket,
  ticketStatus,
  simpleTicketStatus,
  gtcVersion
};
