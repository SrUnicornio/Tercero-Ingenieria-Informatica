/**
 * @file compute-pi-controls-view.ts
 * @description Clase encargada de gestionar los elementos de la interfaz de usuario (botones, sliders).
 */
export class ControlsView {
  constructor(private readonly container: HTMLElement) { }

  /**
   * Inyecta el HTML de los controles en el contenedor.
   */
  render(): void {
    this.container.innerHTML = `
      <div class="field mb-5">
        <p class="is-size-7"><strong>Total Number of points:</strong> <span id="total-pts">0</span></p>
        <p class="is-size-7"><strong>Points within circle:</strong> <span id="inside-pts">0</span></p>
        <p class="is-size-7"><strong>Pi estimation:</strong> <span id="pi-val">-</span></p>
      </div>

      <div class="buttons">
        <button id="button-add" class="button is-fullwidth is-small">
          Add points one-by-one
        </button>
      </div>

      <div class="field mb-4">
        <label class="checkbox is-size-7">
          <input type="checkbox" id="check-animate">
          <strong>Animate</strong>
        </label>
      </div>

      <div class="field mb-4">
        <label class="label is-size-7 mb-1">Speed</label>
        <input id="slider-speed" class="slider is-fullwidth" step="1" min="1" max="100" value="50" type="range" style="width: 100%;">
      </div>

      <button id="button-reset" class="button is-fullwidth is-small mb-4">
        Reset
      </button>

      <a href="https://en.wikipedia.org/wiki/Monte_Carlo_method" 
         target="_blank" 
         class="button is-fullwidth is-small is-link is-light">
        <span class="icon is-small">
          <i class="fas fa-external-link-alt"></i>
        </span>
        <span>Monte Carlo Methods</span>
      </a>
    `;
  }

  // Métodos para facilitar al controlador la suscripción a eventos
  onAddPoint(callback: () => void): void {
    document.getElementById('button-add')?.addEventListener('click', callback);
  }

  onReset(callback: () => void): void {
    document.getElementById('button-reset')?.addEventListener('click', callback);
  }
}
