/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file result-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Subelemento de la vista responsable de mostrar el área total
 *   calculada en el párrafo #trap-result del HTML.
 *   Solo escribe en el DOM: no lee inputs ni conoce el modelo.
 */

/** ID del párrafo de resultado en el HTML. */
const RESULT_PARAGRAPH_ID = 'trap-result';

/** Prefijo fijo del texto de resultado. */
const RESULT_PREFIX = 'Sum of all Trapezium areas: ';

/**
 * Actualiza el párrafo de resultado con el área total.
 * El controlador llama a update() después de cada render.
 */
export class ResultView {
  private readonly resultParagraph: HTMLElement;

  /** @throws {Error} Si el párrafo de resultado no existe en el DOM. */
  constructor() {
    const element = document.getElementById(RESULT_PARAGRAPH_ID);
    if (!(element instanceof HTMLElement)) {
      throw new Error(
          `ResultView: no se encontró #${RESULT_PARAGRAPH_ID}.`,
      );
    }
    this.resultParagraph = element;
  }

  /**
   * Escribe el área total en el párrafo de resultado.
   * @param totalArea - Área total calculada por la regla del trapecio.
   */
  update(totalArea: number): void {
    this.resultParagraph.textContent =
      `${RESULT_PREFIX}${totalArea.toFixed(3)}`;
  }

  /** Restaura el guion inicial antes del primer cálculo. */
  reset(): void {
    this.resultParagraph.textContent = `${RESULT_PREFIX}—`;
  }
}
