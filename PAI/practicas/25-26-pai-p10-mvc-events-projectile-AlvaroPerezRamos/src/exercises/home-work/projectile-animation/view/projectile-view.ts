/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file projectile-view.ts
 * @description
 *   Fachada (Facade) de todos los sub-renderizadores del canvas P1.
 *   El controlador solo interactúa con esta clase.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import {
  CoordinateTransformer,
  TransformerConfig,
} from '../util/coordinate-transformer.js';
import { ProjectileState, RecordedTrajectory } from '../model/projectile-model.js';
import { DEFAULT_AXIS_CONFIG, AxisConfig }      from './axis/axis.js';
import { CoordinateSystem }                     from './coordinate-system.js';
import { GridRenderer }                         from './grid-renderer.js';
import { CannonDrawer }                         from './cannon-drawer.js';
import { TickSpacingCalculator }                from '../util/tick-spacing-calculator.js';

/**
 * @interface ProjectileViewConfig
 * @description
 *   Parámetros de layout del canvas P1.
 *   Sustituye las constantes de módulo sueltas para cumplir la guía
 *   de estilo de Google (no usar module-level constants para valores
 *   configurables de una clase).
 */
export interface ProjectileViewConfig {
  /** Margen izquierdo en píxeles (espacio para etiquetas del eje Y). */
  readonly marginLeftPx:          number;
  /** Margen inferior en píxeles (espacio para etiquetas del eje X). */
  readonly marginBottomPx:        number;
  /** Margen superior en píxeles (espacio para la flecha del eje Y). */
  readonly marginTopPx:           number;
  /** Margen derecho en píxeles (espacio para la flecha del eje X). */
  readonly marginRightPx:         number;
  /** Rango inicial por defecto antes del primer lanzamiento, en metros. */
  readonly initialMaxRangeMeters: number;
  /** Radio en píxeles del punto de la trayectoria activa. */
  readonly trajectoryPointRadius: number;
}

/**
 * @constant DEFAULT_PROJECTILE_VIEW_CONFIG
 * @description Configuración por defecto del layout del canvas P1.
 */
export const DEFAULT_PROJECTILE_VIEW_CONFIG: ProjectileViewConfig = {
  marginLeftPx:          55,
  marginBottomPx:        40,
  marginTopPx:           30,
  marginRightPx:         30,
  initialMaxRangeMeters: 100,
  trajectoryPointRadius: 2,
};

/**
 * @interface ScaleBounds
 * @description Rango físico visible para ajustar la escala del canvas.
 */
export interface ScaleBounds {
  readonly maxX: number;
  readonly maxY: number;
}

/**
 * @class ProjectileView
 * @classdesc
 *   Fachada del canvas P1. Delega el dibujo del sistema de coordenadas
 *   a {@link CoordinateSystem}, el cañón a {@link CannonDrawer} y la
 *   cuadrícula a {@link GridRenderer}.
 */
export class ProjectileView {
  private readonly context:     CanvasRenderingContext2D;
  private readonly transformer: CoordinateTransformer;
  private readonly viewConfig:  ProjectileViewConfig;
  private readonly cannonDrawer: CannonDrawer;

  private coordinateSystem: CoordinateSystem;
  private gridRenderer:     GridRenderer;
  private axisConfig:       AxisConfig;

  /**
   * @param canvasElement - Elemento `<canvas>` gestionado por esta vista.
   * @param viewConfig    - Configuración de layout (opcional).
   * @throws {Error} Si el canvas no soporta el contexto 2D.
   */
  constructor(
    canvasElement: HTMLCanvasElement,
    viewConfig: Partial<ProjectileViewConfig> = {},
  ) {
    const context = canvasElement.getContext('2d');
    if (!context) {
      throw new Error('ProjectileView: no se pudo obtener el contexto 2D.');
    }
    this.context = context;
    this.viewConfig = { ...DEFAULT_PROJECTILE_VIEW_CONFIG, ...viewConfig };

    const initialTransformerConfig: TransformerConfig = {
      canvasWidth:  canvasElement.width,
      canvasHeight: canvasElement.height,
      marginLeft:   this.viewConfig.marginLeftPx,
      marginBottom: this.viewConfig.marginBottomPx,
      marginTop:    this.viewConfig.marginTopPx,
      marginRight:  this.viewConfig.marginRightPx,
      maxX:         this.viewConfig.initialMaxRangeMeters,
      maxY:         this.viewConfig.initialMaxRangeMeters,
    };

    this.transformer      = new CoordinateTransformer(initialTransformerConfig);
    this.axisConfig       = { ...DEFAULT_AXIS_CONFIG };
    this.coordinateSystem = new CoordinateSystem(context, this.transformer, this.axisConfig);
    this.gridRenderer     = new GridRenderer(context, this.transformer);
    this.cannonDrawer     = new CannonDrawer(context, this.transformer);
  }

  // ---------------------------------------------------------------------------
  // Escala
  // ---------------------------------------------------------------------------

  /**
   * @method setScale
   * @description
   *   Actualiza el rango visible y reconstruye los renderizadores de
   *   cuadrícula y ejes con el nuevo espaciado de ticks calculado
   *   dinámicamente.
   * @param bounds - Nuevos límites en metros.
   */
  setScale(bounds: ScaleBounds): void {
    this.transformer.updateScale(bounds.maxX, bounds.maxY);
    const newTickSpacing = TickSpacingCalculator.compute(
      Math.max(bounds.maxX, bounds.maxY),
    );
    this.axisConfig       = { ...this.axisConfig, tickSpacingMeters: newTickSpacing };
    this.coordinateSystem = new CoordinateSystem(this.context, this.transformer, this.axisConfig);
    this.gridRenderer     = new GridRenderer(this.context, this.transformer);
  }

  /**
   * @method syncCanvasSize
   * @description Sincroniza las dimensiones lógicas del canvas con su tamaño CSS.
   * @param canvasElement - El canvas cuyo tamaño ha cambiado.
   */
  syncCanvasSize(canvasElement: HTMLCanvasElement): void {
    canvasElement.width  = canvasElement.clientWidth;
    canvasElement.height = canvasElement.clientHeight;
    this.transformer.updateCanvasSize(
      canvasElement.clientWidth,
      canvasElement.clientHeight,
    );
  }

  // ---------------------------------------------------------------------------
  // Dibujo del sistema de coordenadas
  // ---------------------------------------------------------------------------

  /**
   * @method clearAndRedrawBase
   * @description
   *   Limpia el canvas, dibuja fondo (cuadrícula + ejes) y redibuja
   *   el historial de trayectorias si se proporciona.
   * @param historicalTrajectories - Trayectorias completadas a redibujar.
   */
  clearAndRedrawBase(
    historicalTrajectories: readonly RecordedTrajectory[],
  ): void {
    this.clearBackground();
    this.drawCoordinateSystem();
    this.redrawAllHistoricalTrajectories(historicalTrajectories);
  }

  /**
   * @method clearBackground
   * @description Limpia todo el canvas con fondo blanco.
   */
  clearBackground(): void {
    const { canvasWidth, canvasHeight } = this.transformer.getConfig();
    this.context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // ---------------------------------------------------------------------------
  // Dibujo de trayectoria
  // ---------------------------------------------------------------------------

  /**
   * @method drawCannon
   * @description Dibuja el cañón en la posición de lanzamiento.
   * @param initialHeightMeters - Altura inicial en metros.
   * @param angleDegrees        - Ángulo en grados.
   * @param color               - Color CSS del lanzamiento.
   */
  drawCannon(
    initialHeightMeters: number,
    angleDegrees:        number,
    color:               string,
  ): void {
    this.cannonDrawer.draw(initialHeightMeters, angleDegrees, color);
  }

  /**
   * @method drawProjectilePoint
   * @description
   *   Dibuja el punto actual del proyectil y el segmento desde el anterior.
   * @param currentState  - Estado cinemático actual.
   * @param color         - Color CSS de la trayectoria.
   * @param previousState - Estado anterior (`null` en el primer punto).
   */
  drawProjectilePoint(
    currentState:  ProjectileState,
    color:         string,
    previousState: ProjectileState | null,
    showTrajectory: boolean,
  ): void {
    const current = this.transformer.toPixel(currentState.x, currentState.y);

    if (showTrajectory && previousState !== null) {
      const previous = this.transformer.toPixel(previousState.x, previousState.y);
      this.context.beginPath();
      this.context.moveTo(previous.x, previous.y);
      this.context.lineTo(current.x,  current.y);
      this.context.strokeStyle = color;
      this.context.lineWidth   = 2;
      this.context.stroke();
    }

    this.drawCanonBall(currentState, color);
  }

  // ---------------------------------------------------------------------------
  // Privados
  // ---------------------------------------------------------------------------

  /** Dibuja la cuadrícula y los dos ejes cartesianos. */
  private drawCoordinateSystem(): void {
    this.gridRenderer.draw();
    this.coordinateSystem.draw();
  }

  /** Redibuja todas las trayectorias del historial con la escala actual. */
  private redrawAllHistoricalTrajectories(
    trajectories: readonly RecordedTrajectory[],
  ): void {
    for (const trajectory of trajectories) {
      this.redrawSingleTrajectory(trajectory);
    }
  }

  /** Redibuja una única trayectoria histórica. */
  private redrawSingleTrajectory(trajectory: RecordedTrajectory): void {
    this.drawTrajectory(trajectory);
  }

  /**
   * @method drawTrajectory
   * @description Dibuja la trayectoria del proyectil.
   * @param trajectory - Trayectoria a dibujar.
   */
  private drawTrajectory(trajectory: RecordedTrajectory): void {
    const { points, color } = trajectory;
    if (points.length === 0) return;

    for (let pointIndex = 1; pointIndex < points.length; pointIndex++) {
      const previous = this.transformer.toPixel(
        points[pointIndex - 1].x,
        points[pointIndex - 1].y,
      );
      const current = this.transformer.toPixel(
        points[pointIndex].x,
        points[pointIndex].y,
      );
      this.context.beginPath();
      this.context.moveTo(previous.x, previous.y);
      this.context.lineTo(current.x,  current.y);
      this.context.strokeStyle = color;
      this.context.lineWidth   = 2;
      this.context.stroke();
    }
  }

  /**
   * @method drawCanonBall
   * @description Dibuja el proyectil en su posición actual.
   * @param state - Estado cinemático actual del proyectil.
   * @param color - Color CSS de la trayectoria.
   */
  private drawCanonBall(state: ProjectileState, color: string): void {
    const { x, y } = this.transformer.toPixel(state.x, state.y);
    this.context.beginPath();
    this.context.arc(x, y, this.viewConfig.trajectoryPointRadius, 0, 2 * Math.PI);
    this.context.fillStyle = color;
    this.context.fill();
  }
}