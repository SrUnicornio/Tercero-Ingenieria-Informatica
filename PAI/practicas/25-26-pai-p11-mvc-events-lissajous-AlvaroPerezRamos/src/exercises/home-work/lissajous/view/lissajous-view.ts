/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file lissajous-view.ts
 * @description
 *   Vista (capa V del patrón MVC) de la aplicación de curvas de Lissajous.
 *   Fachada que orquesta el canvas (cuadrícula + curva) y delega la gestión
 *   del panel de controles a {@link ControlsPanel}.
 *   No contiene lógica matemática ni de negocio.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { LissajousParams } from '../interfaces/lissajous-params.js';
import { LissajousPoint } from '../interfaces/lissajous-point.js';
import { CurveRenderConfig, DEFAULT_CURVE_RENDER_CONFIG } from '../interfaces/curve-render-config.js';
import { GridRenderer } from './grid-renderer.js';
import { ControlsPanel } from './controls/controls-panel.js';

export { CurveRenderConfig };

/**
 * @class LissajousView
 * @classdesc
 *   Fachada de la capa de presentación.
 *   - Renderizado canvas: cuadrícula (GridRenderer) + curva propia.
 *   - Controles HTML: delegado completamente a ControlsPanel.
 *   - Canvas cuadrado: syncCanvasSize() usa Math.min(clientWidth, clientHeight).
 *
 * @example
 * ```typescript
 * const view = new LissajousView();
 * view.onParamChange((updates) => model.setParams(updates));
 * view.render(points, params);
 * ```
 */
export class LissajousView {
  private readonly canvasElement: HTMLCanvasElement;
  private readonly renderingContext: CanvasRenderingContext2D;
  private readonly gridRenderer: GridRenderer;
  private readonly controlsPanel: ControlsPanel;
  private readonly curveConfig: CurveRenderConfig;

  /** @throws {Error} Si el canvas no existe o no admite contexto 2D. */
  constructor(curveRenderConfig: Partial<CurveRenderConfig> = {}) {
    this.canvasElement = this.requireCanvasById('lissajousCanvas');

    const context = this.canvasElement.getContext('2d');
    if (!context) {
      throw new Error('LissajousView: no se pudo obtener el contexto 2D del canvas.');
    }
    this.renderingContext = context;
    this.curveConfig = { ...DEFAULT_CURVE_RENDER_CONFIG, ...curveRenderConfig };
    this.gridRenderer = new GridRenderer(this.renderingContext);
    this.controlsPanel = new ControlsPanel();
  }

  // ---------------------------------------------------------------------------
  // Tamaño del canvas
  // ---------------------------------------------------------------------------

  /**
   * Sincroniza las dimensiones lógicas del canvas con su CSS.
   * Usa el menor de los dos lados para garantizar que el canvas sea cuadrado.
   */
  syncCanvasSize(): void {
    const canvas = this.canvasElement;

    // Obtenemos el tamaño real de visualización (incluyendo el estiramiento de CSS/Bulma)
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    // Solo actualizamos si el tamaño ha cambiado para no resetear el contexto innecesariamente
    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
  }

  // ---------------------------------------------------------------------------
  // Renderizado
  // ---------------------------------------------------------------------------

  /**
   * Redibuja el canvas completo: cuadrícula de fondo y curva de Lissajous.
   * @param curvePoints   - Puntos normalizados [-1, 1] de la curva.
   * @param currentParams - Parámetros actuales (amplitudes para el escalado).
   */
  render(curvePoints: readonly LissajousPoint[], currentParams: LissajousParams): void {
    const { width, height } = this.canvasElement;
    this.gridRenderer.draw(width, height);
    this.drawCurve(curvePoints, currentParams, width, height);
  }

  // ---------------------------------------------------------------------------
  // Controles — delegados a ControlsPanel
  // ---------------------------------------------------------------------------

  /** Delega la sincronización de controles al panel. */
  updateControlsFromParams(currentParams: LissajousParams): void {
    this.controlsPanel.updateFromParams(currentParams);
  }

  /** Delega el registro del callback de cambios al panel. */
  onParamChange(callback: (updates: Partial<LissajousParams>) => void): void {
    this.controlsPanel.onParamChange(callback);
  }

  // ---------------------------------------------------------------------------
  // Privados — dibujo de la curva
  // ---------------------------------------------------------------------------

  /**
   * Dibuja la curva escalando los puntos normalizados con las amplitudes.
   * El centro de la curva coincide con el centro del canvas.
   */
  private drawCurve(
    curvePoints: readonly LissajousPoint[],
    currentParams: LissajousParams,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    if (curvePoints.length === 0) return;

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    this.renderingContext.save();
    this.renderingContext.strokeStyle = this.curveConfig.curveColor;
    this.renderingContext.lineWidth = this.curveConfig.curveLineWidth;
    this.renderingContext.lineJoin = 'round';
    this.renderingContext.lineCap = 'round';
    this.renderingContext.beginPath();

    const firstPoint = curvePoints[0];
    this.renderingContext.moveTo(
      centerX + firstPoint.x * currentParams.amplitudeX,
      centerY - firstPoint.y * currentParams.amplitudeY,
    );
    for (let pointIndex = 1; pointIndex < curvePoints.length; pointIndex++) {
      const point = curvePoints[pointIndex];
      this.renderingContext.lineTo(
        centerX + point.x * currentParams.amplitudeX,
        centerY - point.y * currentParams.amplitudeY,
      );
    }

    this.renderingContext.stroke();
    this.renderingContext.restore();
  }

  // ---------------------------------------------------------------------------
  // Privados — DOM
  // ---------------------------------------------------------------------------

  /** @throws {Error} Si el elemento no existe o no es HTMLCanvasElement. */
  private requireCanvasById(elementId: string): HTMLCanvasElement {
    const element = document.getElementById(elementId);
    if (!(element instanceof HTMLCanvasElement)) {
      throw new Error(`LissajousView: no se encontró <canvas id="${elementId}">.`);
    }
    return element;
  }
}