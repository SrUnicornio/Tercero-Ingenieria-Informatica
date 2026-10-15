/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hand-info-view.test.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Tests unitarios de {@link HandInfoView}.
 *
 *   Estrategia general:
 *   - JSDOM no implementa `HTMLDialogElement.showModal()` ni `.close()`, por
 *     lo que ambos métodos se espían con `vitest.fn()` antes de construir la
 *     vista. Así se verifica que *se invocan*, sin depender de efectos reales.
 *   - El DOM mínimo necesario (modal, botón de cierre y contenedor de tabla)
 *     se construye en `beforeEach` y se limpia en `afterEach` para que cada
 *     test parta de un estado limpio.
 *   - `getHandTable` es una función pura estática: no se mockea,
 *     se usa directamente para comparar con el contenido generado en el DOM.
 */

import {describe, it, expect, vitest, beforeEach, afterEach} from 'vitest';
import {HandInfoView} from '../../balatro/view/hand-info-view';
import {getHandTable} from '../../balatro/model/poker/hand-table';

// ── Constantes de IDs (deben coincidir con los privados de HandInfoView) ──────

const MODAL_ID = 'hand-info-modal';
const CLOSE_BUTTON_ID = 'hand-info-close';
const TABLE_CONTAINER_ID = 'hand-info-table';

// ── Helper de construcción del DOM mínimo ─────────────────────────────────────

/**
 * Inserta en `document.body` la estructura HTML mínima que requiere
 * `HandInfoView` y espía `showModal` y `close` en el `<dialog>`.
 *
 * @returns Referencias a los elementos y los espías, para usarlos en aserciones.
 */
function buildDom(): {
  modal: HTMLDialogElement;
  closeButton: HTMLButtonElement;
  tableContainer: HTMLElement;
  showModalSpy: ReturnType<typeof vitest.fn>;
  closeSpy: ReturnType<typeof vitest.fn>;
  } {
  const modal = document.createElement('dialog');
  modal.id = MODAL_ID;

  const closeButton = document.createElement('button');
  closeButton.id = CLOSE_BUTTON_ID;

  const tableContainer = document.createElement('div');
  tableContainer.id = TABLE_CONTAINER_ID;

  modal.appendChild(closeButton);
  modal.appendChild(tableContainer);
  document.body.appendChild(modal);

  // JSDOM no implementa showModal/close; los reemplazamos por espías.
  const showModalSpy = vitest.fn();
  const closeSpy = vitest.fn();
  modal.showModal = showModalSpy;
  modal.close = closeSpy;

  return {modal, closeButton, tableContainer, showModalSpy, closeSpy};
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('HandInfoView', () => {
  let dom: ReturnType<typeof buildDom>;

  beforeEach(() => {
    dom = buildDom();
  });

  afterEach(() => {
    // Limpiar el DOM entre tests para evitar contaminación de estado.
    document.body.innerHTML = '';
  });

  // ── Constructor ────────────────────────────────────────────────────────────

  describe('constructor', () => {
    it('debe lanzar un Error si el elemento #hand-info-modal no existe en el DOM', () => {
      // Eliminamos el modal recién añadido para simular DOM incompleto.
      document.body.innerHTML = '';

      expect(() => new HandInfoView()).toThrow(
          `Elemento DOM no encontrado: #${MODAL_ID}`,
      );
    });

    it('no debe lanzar si el DOM está completo', () => {
      expect(() => new HandInfoView()).not.toThrow();
    });
  });

  // ── buildHandTable ─────────────────────────────────────────────────────────

  describe('buildHandTable (generación de filas en el constructor)', () => {
    it('debe crear tantas filas como entradas devuelve getHandTable', () => {
      new HandInfoView();

      const rows = dom.tableContainer.querySelectorAll('.hand-info-row');
      const expectedRowCount = getHandTable().length;

      expect(rows.length).toBe(expectedRowCount);
    });

    it('debe incluir el nombre de cada jugada en la fila correspondiente', () => {
      new HandInfoView();

      const handTable = getHandTable();
      const nameElements = dom.tableContainer.querySelectorAll(
          '.hand-info-row__name',
      );

      handTable.forEach((entry: { name: string }, rowIndex: number) => {
        expect(nameElements[rowIndex].textContent).toBe(entry.name);
      });
    });

    it('debe incluir los chips de cada jugada en la fila correspondiente', () => {
      new HandInfoView();

      const handTable = getHandTable();
      const chipsElements = dom.tableContainer.querySelectorAll(
          '.hand-info-row__chips',
      );

      handTable.forEach((entry: { chips: number }, rowIndex: number) => {
        expect(chipsElements[rowIndex].textContent).toContain(
            String(entry.chips),
        );
      });
    });

    it('debe incluir el multiplicador de cada jugada en la fila correspondiente', () => {
      new HandInfoView();

      const handTable = getHandTable();
      const multElements = dom.tableContainer.querySelectorAll(
          '.hand-info-row__mult',
      );

      handTable.forEach((entry: { multiplier: number }, rowIndex: number) => {
        expect(multElements[rowIndex].textContent).toContain(
            String(entry.multiplier),
        );
      });
    });

    it('debe dejar el contenedor vacío si #hand-info-table no existe en el DOM', () => {
      // Eliminamos el contenedor de tabla para simular DOM parcial.
      dom.tableContainer.remove();

      // No debe lanzar; simplemente no genera filas.
      expect(() => new HandInfoView()).not.toThrow();
    });
  });

  // ── open ───────────────────────────────────────────────────────────────────

  describe('open', () => {
    it('debe llamar a showModal() en el elemento <dialog>', () => {
      const view = new HandInfoView();

      view.open();

      expect(dom.showModalSpy).toHaveBeenCalledTimes(1);
    });

    it('debe poder abrirse varias veces sin error', () => {
      const view = new HandInfoView();

      view.open();
      view.open();

      expect(dom.showModalSpy).toHaveBeenCalledTimes(2);
    });
  });

  // ── wireCloseEvents — botón de cierre ──────────────────────────────────────

  describe('wireCloseEvents — botón ✕', () => {
    it('debe llamar a close() al hacer clic en el botón #hand-info-close', () => {
      new HandInfoView();

      dom.closeButton.click();

      expect(dom.closeSpy).toHaveBeenCalledTimes(1);
    });

    it('debe poder cerrarse varias veces sin error', () => {
      new HandInfoView();

      dom.closeButton.click();
      dom.closeButton.click();

      expect(dom.closeSpy).toHaveBeenCalledTimes(2);
    });

    it('no debe cerrar si el botón #hand-info-close no existe en el DOM', () => {
      // Eliminamos el botón antes de instanciar: wireCloseEvents usa ?. y no lanza.
      dom.closeButton.remove();

      expect(() => new HandInfoView()).not.toThrow();
    });
  });

  // ── wireCloseEvents — clic en el backdrop ──────────────────────────────────

  describe('wireCloseEvents — clic en el backdrop', () => {
    it('debe llamar a close() cuando event.target es el propio <dialog>', () => {
      new HandInfoView();

      // Simulamos un clic cuyo target ES el dialog (backdrop).
      const backdropClick = new MouseEvent('click', {bubbles: true});
      Object.defineProperty(backdropClick, 'target', {value: dom.modal});
      dom.modal.dispatchEvent(backdropClick);

      expect(dom.closeSpy).toHaveBeenCalledTimes(1);
    });

    it('NO debe llamar a close() cuando event.target es un elemento hijo del modal', () => {
      new HandInfoView();

      // Simulamos un clic cuyo target es un elemento hijo (no el backdrop).
      const innerClick = new MouseEvent('click', {bubbles: true});
      Object.defineProperty(innerClick, 'target', {value: dom.closeButton});
      dom.modal.dispatchEvent(innerClick);

      expect(dom.closeSpy).not.toHaveBeenCalled();
    });
  });
});
