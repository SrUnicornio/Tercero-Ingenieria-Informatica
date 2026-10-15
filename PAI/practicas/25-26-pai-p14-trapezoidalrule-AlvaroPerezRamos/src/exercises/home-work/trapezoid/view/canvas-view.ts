/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file canvas-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description
 *   Subelemento de la vista responsable exclusivamente de la gestión
 *   del elemento HTMLCanvasElement:
 *     - Obtención segura del canvas y su contexto 2D.
 *     - Sincronización de dimensiones lógicas con el tamaño CSS.
 *     - Exposición del contexto y las dimensiones al resto de la vista.
 */

/**
 * Encapsula la obtención y sincronización del HTMLCanvasElement.
 * Separa la responsabilidad de gestión del DOM del canvas del
 * renderizado de contenido.
 */
export class CanvasView {
  private readonly canvasElement: HTMLCanvasElement;
  private readonly renderingContext: CanvasRenderingContext2D;

  /**
   * @param canvasId - Atributo `id` del elemento `<canvas>` en el DOM.
   * @throws {Error} Si el elemento no existe o no admite contexto 2D.
   */
  constructor(canvasId: string) {
    this.canvasElement = this.requireCanvasById(canvasId);
    this.renderingContext = this.requireContext2D(this.canvasElement);
  }

  /**
   * Iguala las dimensiones lógicas del canvas (canvas.width /
   * canvas.height) a su tamaño de presentación CSS (clientWidth /
   * clientHeight). Evitar esta sincronización produce distorsión de píxeles.
   *
   * @returns `true` si las dimensiones cambiaron, `false` si ya coincidían.
   */
  syncSize(): boolean {
    const displayWidth = this.canvasElement.clientWidth;
    const displayHeight = this.canvasElement.clientHeight;

    const hasChanged =
      this.canvasElement.width !== displayWidth ||
      this.canvasElement.height !== displayHeight;

    if (hasChanged) {
      this.canvasElement.width = displayWidth;
      this.canvasElement.height = displayHeight;
    }

    return hasChanged;
  }

  /**
   * @description Devuelve el contexto 2D del canvas.
   * @returns Contexto 2D listo para dibujar.
   */
  getContext(): CanvasRenderingContext2D {
    return this.renderingContext;
  }

  /**
   * @description Devuelve las dimensiones lógicas actuales del canvas.
   * @returns Tupla [width, height] en píxeles.
   */
  getDimensions(): [number, number] {
    return [this.canvasElement.width, this.canvasElement.height];
  }

  /**
   * @description Expone el elemento canvas para que el controlador pueda
   *   registrar el ResizeObserver sobre él.
   * @returns Referencia al HTMLCanvasElement.
   */
  getCanvasElement(): HTMLCanvasElement {
    return this.canvasElement;
  }

  /**
   * @param elementId - ID del elemento a buscar en el DOM.
   * @returns El HTMLCanvasElement encontrado.
   * @throws {Error} Si el elemento no existe o no es un canvas.
   */
  private requireCanvasById(elementId: string): HTMLCanvasElement {
    const element = document.getElementById(elementId);
    if (!(element instanceof HTMLCanvasElement)) {
      throw new Error(
          `CanvasView: no se encontró <canvas id="${elementId}">.`,
      );
    }
    return element;
  }

  /**
   * @param canvasElement - Elemento canvas del que obtener el contexto.
   * @returns El contexto 2D del canvas.
   * @throws {Error} Si el canvas no admite contexto 2D.
   */
  private requireContext2D(
      canvasElement: HTMLCanvasElement,
  ): CanvasRenderingContext2D {
    const context = canvasElement.getContext('2d');
    if (!context) {
      throw new Error('CanvasView: no se pudo obtener el contexto 2D del canvas.');
    }
    return context;
  }
}
