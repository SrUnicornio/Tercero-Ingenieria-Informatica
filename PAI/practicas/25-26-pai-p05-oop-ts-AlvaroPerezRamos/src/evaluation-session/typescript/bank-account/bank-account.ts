/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author Álvaro Pérez Ramos
 * @since 3 MAR 2026
 * @desc Bank account
 *
 * @see {@link exercism.org/tracks/typescript/exercises/bank-account }
 */

/**
 * Clase que representa un error relacionado con la cuenta bancaria.
 */
export class ValueError extends Error {
  constructor() {
    super('Bank account error')
  }
}

/**
 * Clase que representa una cuenta bancaria con operaciones básicas como abrir, cerrar, depositar, retirar y consultar el saldo.
 */
export class BankAccount {
  constructor(private balanceValue: number = 0, private isOpen: boolean = false) { 

  }

  /**
   * Abre la cuenta bancaria. Si la cuenta ya está abierta, lanza un error.
   */
  open(): void {
    if (this.isOpen) {
      throw new ValueError()
    }
    this.isOpen = true
  }

  /**
   * Cierra la cuenta bancaria. Si la cuenta ya está cerrada, lanza un error. Al cerrar la cuenta, el saldo se restablece a cero.
   */
  close(): void {
    if (!this.isOpen) {
      throw new ValueError()
    }
    this.isOpen = false
    this.balanceValue = 0
  }

  /**
   * Deposita un monto en la cuenta bancaria. Si la cuenta está cerrada o el monto es negativo, lanza un error.
   * @param balance El monto a depositar en la cuenta bancaria. Debe ser un número no negativo. Si la cuenta está cerrada o el monto es negativo, lanza un error.
   */
  deposit(balance: number): void {
    if (!this.isOpen || balance < 0) {
      throw new ValueError()
    }
    this.balanceValue += balance
  }

  /**
   * Retira un monto de la cuenta bancaria. Si la cuenta está cerrada, el monto es negativo o el monto a retirar es mayor que el saldo actual, lanza un error.
   * @param balance El monto a retirar de la cuenta bancaria. Debe ser un número no negativo y no puede ser mayor que el saldo actual. Si la cuenta está cerrada, el monto es negativo o el monto a retirar es mayor que el saldo actual, lanza un error.
   */
  withdraw(balance: number): void {
    if (!this.isOpen || balance > this.balanceValue || balance < 0) {
      throw new ValueError()
    }
    this.balanceValue -= balance
  }

  /**
   * Devuelve el saldo actual de la cuenta bancaria. Si la cuenta está cerrada, lanza un error.
   */
  get balance(): number {
    if (!this.isOpen) {
      throw new ValueError()
    }
    return this.balanceValue
  }
}
