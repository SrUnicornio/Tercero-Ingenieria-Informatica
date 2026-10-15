import { BrownianModel } from "../model/brownian-model.js";
import { BrownianView } from "../view/brownian-view.js";

const TRAIL_LIFETIME_MS = 8000;

export class BrownianController {
  private animationId: number | null = null;

  constructor(
    private model: BrownianModel,
    private view: BrownianView
  ) {
    window.addEventListener("resize", () => this.onResize());
    this.start();
    
    const startButton = document.getElementById("startButton") as HTMLButtonElement;
    startButton.addEventListener("click", () => this.onStart());
  }

  start(): void {
    this.init();
    this.loop();
  }

  // -------------------------------------------------------------------------
  // Privados
  // -------------------------------------------------------------------------

  /**
   * @method onStart
   * @description
   *   Lee el valor D del input, lo pasa al modelo y arranca la animación.
   *   Si ya había una animación corriendo, la cancela primero.
   */
  private onStart(): void {
    const dInput = document.getElementById("dInput") as HTMLInputElement;
    const d = parseFloat(dInput.value);

    if (!isNaN(d) && d > 0) {
      this.model.setMaxDisplacement(d);
    }

    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    this.init();
    this.loop();
  }

  private init(): void {
    const bounds = this.view.getBounds();
    this.model.updateBounds(bounds);
    this.model.centerPosition(bounds);
  }

  private loop = (): void => {
    this.model.step();
    this.model.pruneTrail(TRAIL_LIFETIME_MS);
    const trail = this.model.getTrail();
    this.view.render(trail);
    this.animationId = requestAnimationFrame(this.loop);
  };

  private onResize(): void {
    const bounds = this.view.resize();
    this.model.updateBounds(bounds);
  }
}