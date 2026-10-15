/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file projectile-controller.ts
 * @description Controlador MVC de la simulación de tiro parabólico.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import {
  ProjectileModel,
  ProjectileLaunchParams,
  ProjectileState,
} from '../model/projectile-model.js';
import { ProjectileObserver } from '../observer/projectile-observer.js';
import { ProjectileView } from '../view/projectile-view.js';
import { InfoView } from '../view/info-view.js';
import { ControlsView } from '../view/controls-view.js';
import { IColorStrategy } from '../strategy/trajectory-color-strategy.js';

/** Clamp del delta de tiempo por frame (≈ 60 fps). */
const MAX_DELTA_SEC = 0.016;

/**
 * @interface ControllerDependencies
 * @description Agrupa las dependencias del controlador (DI, máx. 1 parámetro).
 */
export interface ControllerDependencies {
  readonly model: ProjectileModel;
  readonly projectileView: ProjectileView;
  readonly infoView: InfoView;
  readonly controlsView: ControlsView;
  readonly colorStrategy: IColorStrategy;
  readonly canvasP1: HTMLCanvasElement;
}

/**
 * @class ProjectileController
 * @classdesc
 *   Controlador MVC. Orquesta Modelo y Vistas sin conocer detalles
 *   de física ni de dibujo. Implementa {@link ProjectileObserver}
 *   (patrón Observer) para recibir la notificación de aterrizaje.
 *
 *   El bucle de animación usa un contador `launchVersion` para invalidar
 *   frames "fantasma" de animaciones anteriores sin necesitar
 *   `cancelAnimationFrame`.
 */
export class ProjectileController implements ProjectileObserver {
  private readonly model: ProjectileModel;
  private readonly projectileView: ProjectileView;
  private readonly infoView: InfoView;
  private readonly controlsView: ControlsView;
  private readonly colorStrategy: IColorStrategy;
  private readonly canvasP1: HTMLCanvasElement;

  private launchVersion = 0;
  private previousTimestampMs: number | null = null;
  private previousState: ProjectileState | null = null;
  private currentColor = 'steelblue';

  /** @param deps - Dependencias agrupadas. */
  constructor(deps: ControllerDependencies) {
    this.model = deps.model;
    this.projectileView = deps.projectileView;
    this.infoView = deps.infoView;
    this.controlsView = deps.controlsView;
    this.colorStrategy = deps.colorStrategy;
    this.canvasP1 = deps.canvasP1;

    this.model.addObserver(this);
    this.controlsView.onLaunch(() => this.handleLaunch());
    this.controlsView.onClear(() => this.handleClear());
    this.registerResizeObserver();
  }

  /**
   * @method initialize
   * @description Sincroniza el canvas y dibuja el estado inicial.
   */
  initialize(): void {
    this.projectileView.syncCanvasSize(this.canvasP1);
    this.projectileView.clearAndRedrawBase([]);
    this.infoView.clear();
  }

  /**
   * @method onProjectileLanded
   * @description Callback del patrón Observer: muestra las estadísticas.
   * @param finalState - Estado final al aterrizar.
   */
  onProjectileLanded(finalState: ProjectileState): void {
    this.infoView.showLandingInfo(finalState, this.model.getCurrentMaxHeight());
    // Redibujar el canvas completo para que la traza quede visible al aterrizar.
    // Se usa getCompletedTrajectories porque el modelo ya registró este vuelo.
    if (this.controlsView.shouldShowTrajectory()) {
      this.projectileView.clearAndRedrawBase(
        this.model.getCompletedTrajectories(),
      );
    } else {
      this.projectileView.clearAndRedrawBase([]);
    }
  }

  // ---------------------------------------------------------------------------
  // Privados — gestión de eventos
  // ---------------------------------------------------------------------------

  /**
   * Gestiona el botón "Lanzar". Delega cada responsabilidad en un
   * método privado para mantener el cuerpo legible.
   */
  private handleLaunch(): void {
    const params = this.readLaunchParams();
    if (params === null) return;

    this.currentColor = this.colorStrategy.nextColor();
    this.applyScale(params);
    this.redrawCanvas();
    this.startPhysics(params);
    this.startAnimation();
  }

  /** Gestiona el botón "Limpiar". */
  private handleClear(): void {
    this.model.clearAllTrajectories();
    this.projectileView.clearAndRedrawBase([]);
    this.infoView.clear();
  }

  /**
   * Lee y valida los parámetros del formulario.
   * @returns Los parámetros o `null` si la validación falla.
   */
  private readLaunchParams(): ProjectileLaunchParams | null {
    try {
      return this.controlsView.getLaunchParams();
    } catch (validationError) {
      alert(String(validationError));
      return null;
    }
  }

  /**
   * Calcula los límites globales (historial + nuevo lanzamiento)
   * y actualiza la escala del canvas.
   * @param params - Parámetros del nuevo lanzamiento.
   */
  private applyScale(params: ProjectileLaunchParams): void {
    const globalBounds = this.model.computeGlobalBounds(params);
    this.projectileView.setScale(globalBounds);
  }

  /**
   * Limpia el canvas y redibuja el fondo con el historial apropiado
   * según la preferencia de acumulación del usuario.
   */
  private redrawCanvas(): void {
    // Trayectorias históricas siempre se acumulan en el modelo.
    // Solo se muestran en pantalla si el usuario activó la estela.
    // const shouldAccumulate = this.controlsView.shouldAccumulateTrajectories();
    const showTrail = this.controlsView.shouldShowTrajectory();
    if (showTrail) {
      this.projectileView.clearAndRedrawBase(
        this.model.getCompletedTrajectories(),
      );
    } else {
      this.projectileView.clearAndRedrawBase([]);
    }
  }

  /**
   * Lanza el modelo, limpia el panel de info, dibuja el cañón
   * y reinicia el estado del bucle de animación.
   * @param params - Parámetros de lanzamiento.
   */
  private startPhysics(params: ProjectileLaunchParams): void {
    this.model.launch(params, this.currentColor);
    this.infoView.clear();
    this.projectileView.drawCannon(
      params.initialHeight,
      params.angleDegrees,
      this.currentColor,
    );
    this.previousState = null;
    this.previousTimestampMs = null;
  }

  /**
   * Incrementa la versión del lanzamiento e inicia el bucle
   * de `requestAnimationFrame`.
   */
  private startAnimation(): void {
    this.launchVersion++;
    const capturedVersion = this.launchVersion;
    requestAnimationFrame((ts) => this.animationLoop(ts, capturedVersion));
  }

  /**
   * @method animationLoop
   * @description
   *   Frame de animación (función flecha para preservar `this`).
   *   Si la versión no coincide con la activa, el frame es "fantasma"
   *   y se autodestruye sin programar el siguiente.
   *
   * @param timestamp       - Timestamp de alta resolución del navegador.
   * @param capturedVersion - Versión capturada en closure al lanzar.
   */
  private readonly animationLoop = (
    timestamp: number,
    capturedVersion: number,
  ): void => {
    if (capturedVersion !== this.launchVersion) return;
    if (!this.model.isSimulationActive()) return;

    if (this.previousTimestampMs === null) {
      this.previousTimestampMs = timestamp;
      requestAnimationFrame((ts) => this.animationLoop(ts, capturedVersion));
      return;
    }

    const deltaSec = Math.min(
      (timestamp - this.previousTimestampMs) / 1000,
      MAX_DELTA_SEC,
    );
    this.previousTimestampMs = timestamp;

    const state = this.model.step(deltaSec);
    const showTrail = this.controlsView.shouldShowTrajectory();
    this.projectileView.drawProjectilePoint(state, this.currentColor, this.previousState, showTrail);
    this.previousState = state;

    if (this.model.isSimulationActive()) {
      requestAnimationFrame((ts) => this.animationLoop(ts, capturedVersion));
    }
  };

  // ---------------------------------------------------------------------------
  // Privados — resize
  // ---------------------------------------------------------------------------

  /**
   * Registra un ResizeObserver para sincronizar el canvas al viewport.
   */
  private registerResizeObserver(): void {
    const observer = new ResizeObserver(() => {
      this.projectileView.syncCanvasSize(this.canvasP1);
      this.projectileView.clearAndRedrawBase(
        this.model.getCompletedTrajectories(),
      );
    });
    observer.observe(this.canvasP1);
  }
}