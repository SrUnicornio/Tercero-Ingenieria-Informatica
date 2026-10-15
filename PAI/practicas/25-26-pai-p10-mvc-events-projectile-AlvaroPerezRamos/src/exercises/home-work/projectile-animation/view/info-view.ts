/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file info-view.ts
 * @description
 *   Vista del canvas de información P2 (capa V del patrón MVC).
 *
 *   Muestra, una vez aterrizado el proyectil, los tres datos que exige
 *   el guión de la práctica:
 *     - Tiempo de vuelo `t` en segundos.
 *     - Distancia recorrida horizontalmente `x` en metros.
 *     - Altura máxima alcanzada `y max` en metros.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { ProjectileState } from '../model/projectile-model.js';

/**
 * @interface InfoViewConfig
 * @description Parámetros de estilo y layout del panel P2.
 */
export interface InfoViewConfig {
  /** Margen interior del canvas P2 en píxeles. */
  readonly margin:     number;
  /** Interlineado entre filas de información en píxeles. */
  readonly lineHeight: number;
  /** Fuente CSS para el texto. */
  readonly font:       string;
  /** Color CSS del texto. */
  readonly color:      string;
}

/**
 * @constant DEFAULT_INFO_VIEW_CONFIG
 * @description Configuración por defecto del panel P2.
 */
export const DEFAULT_INFO_VIEW_CONFIG: InfoViewConfig = {
  margin:     16,
  lineHeight: 28,
  font:       '14px monospace',
  color:      'darkslategray',
};

/**
 * @class InfoView
 * @classdesc
 *   Vista del panel de información P2.
 *   Muestra las estadísticas del último lanzamiento sobre un canvas.
 *   No conoce la física ni controla eventos.
 */
export class InfoView {
  private readonly context: CanvasRenderingContext2D;
  private readonly config:  InfoViewConfig;

  /**
   * @param canvas - Elemento `<canvas>` del DOM para el panel P2.
   * @param config - Configuración de estilo (opcional).
   * @throws {Error} Si el canvas no soporta 2D.
   */
  constructor(
    private readonly canvas: HTMLCanvasElement,
    config: Partial<InfoViewConfig> = {},
  ) {
    const context = canvas.getContext('2d');
    if (context === null) {
      throw new Error('InfoView: no se pudo obtener el contexto 2D del canvas P2.');
    }
    this.context = context;
    this.config  = { ...DEFAULT_INFO_VIEW_CONFIG, ...config };
  }

  /**
   * @method clear
   * @description Limpia el panel P2 al iniciar un nuevo lanzamiento.
   */
  clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * @method showLandingInfo
   * @description
   *   Muestra los tres datos requeridos por el guión una vez que el
   *   proyectil ha aterrizado: tiempo de vuelo, distancia horizontal
   *   y altura máxima.
   *
   * @param finalState - Estado final del proyectil al aterrizar.
   * @param maxHeight  - Altura máxima alcanzada en metros.
   */
  showLandingInfo(finalState: ProjectileState, maxHeight: number): void {
    this.clear();

    this.context.save();
    this.context.font      = this.config.font;
    this.context.fillStyle = this.config.color;

    const rows: string[] = [
      `Tiempo de vuelo (t): ${finalState.time.toFixed(2)} s`,
      `Distancia horizontal (x): ${finalState.x.toFixed(1)} m`,
      `Altura máxima (y max): ${maxHeight.toFixed(1)} m`
    ];

    rows.forEach((text, index) => {
      const x = this.config.margin;
      const y = this.config.margin + (index + 1) * this.config.lineHeight;
      this.context.fillText(text, x, y);
    });

    this.context.restore();
  }
}