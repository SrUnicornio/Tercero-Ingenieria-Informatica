/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file projectile-model.ts
 * @description
 *   Modelo del tiro parabólico (capa M del patrón MVC).
 *
 *   Responsabilidades (SRP):
 *    - Almacenar los parámetros de lanzamiento.
 *    - Calcular el estado físico del proyectil en cada instante.
 *    - Notificar a los observadores cuando la trayectoria finaliza
 *      (patrón Observer).
 *    - Almacenar el historial de todos los lanzamientos para
 *      permitir el reescalado y la redibujabilidad (rescale support).
 *
 *   Esta clase no conoce el Canvas, el DOM ni la Vista.
 *   Solo trabaja en unidades del SI (metros, segundos, m/s).
 *
 *   Ecuaciones de movimiento:
 *   ```
 *   x(t)  = v0 · cos(θ) · t
 *   y(t)  = y0 + v0 · sin(θ) · t − ½ · g · t²
 *   vx(t) = v0 · cos(θ)              (constante)
 *   vy(t) = v0 · sin(θ) − g · t
 *   ```
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import { ProjectileObserver } from '../observer/projectile-observer.js';

/**
 * @interface ProjectileLaunchParams
 * @description Parámetros de entrada del lanzamiento.
 */
export interface ProjectileLaunchParams {
  /** Velocidad inicial del proyectil en m/s. */
  readonly initialSpeed: number;
  /** Ángulo de lanzamiento en grados (0–90). */
  readonly angleDegrees: number;
  /** Altura inicial de lanzamiento en metros. */
  readonly initialHeight: number;
}

/**
 * @interface ProjectileState
 * @description Estado cinemático del proyectil en un instante dado.
 */
export interface ProjectileState {
  /** Posición horizontal en metros. */
  readonly x: number;
  /** Posición vertical en metros. */
  readonly y: number;
  /** Tiempo transcurrido en segundos. */
  readonly time: number;
  /** Indica si el proyectil ha aterrizado (y ≤ 0). */
  readonly hasLanded: boolean;
}

/**
 * @interface RecordedTrajectory
 * @description
 *   Historial completo de un lanzamiento: parámetros usados,
 *   color asignado y lista de puntos de la trayectoria.
 *   Se usa para redibujar todas las trayectorias tras un reescalado.
 */
export interface RecordedTrajectory {
  /** Parámetros con los que se lanzó. */
  readonly params: ProjectileLaunchParams;
  /** Color CSS asignado a esta trayectoria. */
  readonly color: string;
  /** Lista ordenada de estados cinemáticos de la trayectoria. */
  readonly points: ProjectileState[];
  /** Altura máxima alcanzada en metros. */
  readonly maxHeight: number;
  /** Alcance horizontal máximo en metros. */
  readonly maxRange: number;
}

/**
 * @class ProjectileModel
 * @classdesc
 *   Modelo de la simulación de tiro parabólico.
 *   Calcula la física y notifica a los observadores al finalizar.
 *   Mantiene el historial de trayectorias para soporte de reescalado.
 *
 *   Patrones aplicados:
 *   - Observer: notifica el aterrizaje sin acoplar modelo y controlador.
 *
 * @example
 * ```typescript
 * const model = new ProjectileModel();
 * model.addObserver(controller);
 * model.launch({
 *   initialSpeed: 50,
 *   angleDegrees: 45,
 *   initialHeight: 10,
 *   gravity: 9.81,
 * });
 * const state = model.step(0.016);
 * ```
 */
export class ProjectileModel {
  /** Parámetros del lanzamiento activo. */
  private currentParams: ProjectileLaunchParams | null = null;

  /** Tiempo transcurrido desde el lanzamiento en segundos. */
  private elapsedTimeSec = 0;

  /** Altura máxima alcanzada durante la trayectoria activa. */
  private currentMaxHeight = 0;

  /** Indica si hay una simulación activa. */
  private simulationActive = false;

  /** Lista de observadores registrados (patrón Observer). */
  private readonly observerList: ProjectileObserver[] = [];

  /**
   * Historial de todas las trayectorias ya completadas.
   * Permite redibujar todo el canvas tras un reescalado.
   */
  private readonly completedTrajectories: RecordedTrajectory[] = [];

  /**
   * Puntos acumulados del lanzamiento activo en curso.
   * Se añaden al historial cuando el proyectil aterriza.
   */
  private activeTrajectoryPoints: ProjectileState[] = [];

  /** Color CSS del lanzamiento activo (asignado externamente). */
  private activeTrajectoryColor = 'steelblue';

  // -------------------------------------------------------------------------
  // Interfaz pública — Observer
  // -------------------------------------------------------------------------

  /**
   * @method addObserver
   * @description Registra un observador que será notificado al aterrizar.
   * @param observer - Objeto que implementa {@link ProjectileObserver}.
   */
  addObserver(observer: ProjectileObserver): void {
    this.observerList.push(observer);
  }

  // -------------------------------------------------------------------------
  // Interfaz pública — Simulación
  // -------------------------------------------------------------------------

  /**
   * @method launch
   * @description
   *   Inicializa la simulación con los parámetros dados.
   *   Reinicia el tiempo, la altura máxima y los puntos activos.
   *
   * @param params - Parámetros de lanzamiento (incluye gravedad).
   * @param color  - Color CSS asignado a esta trayectoria.
   * @throws {Error} Si la velocidad, la altura o la gravedad son inválidas.
   */
  launch(params: ProjectileLaunchParams, color: string): void {
    this.validateLaunchParams(params);
    this.currentParams = params;
    this.elapsedTimeSec = 0;
    this.currentMaxHeight = params.initialHeight;
    this.simulationActive = true;
    this.activeTrajectoryPoints = [];
    this.activeTrajectoryColor = color;
  }

  /**
   * @method step
   * @description
   *   Avanza la simulación `deltaSec` segundos y devuelve el nuevo estado.
   *   Acumula el estado en los puntos activos.
   *   Si el proyectil aterriza, registra la trayectoria y notifica.
   *
   * @param deltaSec - Incremento de tiempo en segundos.
   * @returns El estado cinemático actual del proyectil.
   */
  step(deltaSec: number): ProjectileState {
    if (!this.simulationActive || this.currentParams === null) {
      return { x: 0, y: 0, time: 0, hasLanded: true };
    }

    this.elapsedTimeSec += deltaSec;
    const state = this.computeStateAtTime(this.elapsedTimeSec);

    this.activeTrajectoryPoints.push(state);

    if (state.y > this.currentMaxHeight) {
      this.currentMaxHeight = state.y;
    }

    if (state.hasLanded) {
      this.simulationActive = false;
      this.recordCompletedTrajectory(state);
      this.notifyAllObservers(state);
    }

    return state;
  }

  /**
   * @method clearAllTrajectories
   * @description
   *   Elimina el historial completo de trayectorias.
   *   Se usa cuando el usuario pulsa "Limpiar".
   */
  clearAllTrajectories(): void {
    this.completedTrajectories.length = 0;
    this.activeTrajectoryPoints = [];
    this.simulationActive = false;
    this.currentParams = null;
  }

  // -------------------------------------------------------------------------
  // Interfaz pública — Consultas
  // -------------------------------------------------------------------------

  /**
   * @method getCurrentMaxHeight
   * @description Devuelve la altura máxima del lanzamiento activo.
   * @returns Altura máxima en metros.
   */
  getCurrentMaxHeight(): number {
    return this.currentMaxHeight;
  }

  /**
   * @method isSimulationActive
   * @description Indica si hay una simulación en curso.
   * @returns `true` si el proyectil está en vuelo.
   */
  isSimulationActive(): boolean {
    return this.simulationActive;
  }

  /**
   * @method getCurrentParams
   * @description Devuelve los parámetros del lanzamiento activo.
   * @returns Los parámetros de lanzamiento, o `null` si no hay ninguno.
   */
  getCurrentParams(): ProjectileLaunchParams | null {
    return this.currentParams;
  }

  /**
   * @method getCompletedTrajectories
   * @description
   *   Devuelve una copia de solo lectura del historial de trayectorias
   *   completadas. Se usa para redibujar el canvas tras un reescalado.
   * @returns Array inmutable de trayectorias registradas.
   */
  getCompletedTrajectories(): readonly RecordedTrajectory[] {
    return this.completedTrajectories;
  }

  /**
   * @method computeGlobalBounds
   * @description
   *   Calcula los límites globales (maxX, maxY) considerando todas las
   *   trayectorias almacenadas más los parámetros del lanzamiento
   *   propuesto. Permite ajustar la escala antes de lanzar.
   *
   * @param proposedParams - Parámetros del nuevo lanzamiento a incluir.
   * @returns El rango necesario en metros para mostrar todo el contenido.
   */
  computeGlobalBounds(
    proposedParams: ProjectileLaunchParams,
  ): { maxX: number; maxY: number } {
    const { maxX: proposedMaxX, maxY: proposedMaxY } =
      this.computeBoundsForParams(proposedParams);

    let globalMaxX = proposedMaxX;
    let globalMaxY = proposedMaxY;

    for (const trajectory of this.completedTrajectories) {
      globalMaxX = Math.max(globalMaxX, trajectory.maxRange);
      globalMaxY = Math.max(globalMaxY, trajectory.maxHeight);
    }

    return { maxX: globalMaxX, maxY: globalMaxY };
  }

  // -------------------------------------------------------------------------
  // Privados
  // -------------------------------------------------------------------------

  /**
   * Valida los parámetros antes de lanzar.
   * @param params - Parámetros a validar.
   * @throws {Error} Si algún parámetro está fuera de rango.
   */
  private validateLaunchParams(params: ProjectileLaunchParams): void {
    if (params.initialSpeed <= 0) {
      throw new Error('La velocidad inicial debe ser positiva.');
    }
    if (params.initialHeight < 0) {
      throw new Error('La altura inicial no puede ser negativa.');
    }
  }

  /**
   * Calcula el estado cinemático en el instante `time` según las
   * ecuaciones de movimiento parabólico.
   *
   * @param time - Tiempo en segundos desde el lanzamiento.
   * @returns El estado cinemático en ese instante.
   */
  private computeStateAtTime(time: number): ProjectileState {
    const params = this.currentParams!;
    const angleRad = (params.angleDegrees * Math.PI) / 180;
    const v0x = params.initialSpeed * Math.cos(angleRad);
    const v0y = params.initialSpeed * Math.sin(angleRad);
    const gravity = 9.81;

    const x = v0x * time;
    const rawY = params.initialHeight + v0y * time - 0.5 * gravity * time * time;

    if (rawY <= 0 && time > 0) {
      const landingTime = this.computeLandingTimeSec(params);
      const xLanding = v0x * landingTime;
      return { x: xLanding, y: 0, time: landingTime, hasLanded: true };
    }

    return { x, y: rawY, time, hasLanded: false };
  }

  /**
   * Calcula el tiempo de vuelo hasta y = 0 resolviendo la ecuación
   * cuadrática: y0 + v0y·t − ½·g·t² = 0.
   *
   * @param params - Parámetros del lanzamiento.
   * @returns Tiempo de vuelo en segundos.
   */
  private computeLandingTimeSec(
    params: ProjectileLaunchParams,
  ): number {
    const angleRad = (params.angleDegrees * Math.PI) / 180;
    const v0y = params.initialSpeed * Math.sin(angleRad);
    const y0 = params.initialHeight;
    const gravity = 9.81;
    const discriminant = v0y * v0y + 2 * gravity * y0;
    return (v0y + Math.sqrt(discriminant)) / gravity;
  }

  /**
   * Calcula los límites (maxX, maxY) para unos parámetros dados,
   * incluyendo márgenes visuales del 10 % en X y del 20 % en Y.
   *
   * @param params - Parámetros de lanzamiento.
   * @returns Límites en metros con márgenes.
   */
  private computeBoundsForParams(
    params: ProjectileLaunchParams,
  ): { maxX: number; maxY: number } {
    const X_MARGIN = 1.1;
    const Y_MARGIN = 1.2;
    const MIN_RANGE_METERS = 10;

    const angleRad = (params.angleDegrees * Math.PI) / 180;
    const v0x = params.initialSpeed * Math.cos(angleRad);
    const v0y = params.initialSpeed * Math.sin(angleRad);
    const gravity = 9.81;

    const flightTimeSec = this.computeLandingTimeSec(params);
    const rawMaxX = v0x * flightTimeSec;

    const timeToPeakSec = v0y / gravity;
    const peakHeight = params.initialHeight
      + v0y * timeToPeakSec
      - 0.5 * gravity * timeToPeakSec * timeToPeakSec;

    return {
      maxX: Math.max(rawMaxX * X_MARGIN, MIN_RANGE_METERS),
      maxY: Math.max(peakHeight * Y_MARGIN, MIN_RANGE_METERS),
    };
  }

  /**
   * Registra la trayectoria completada en el historial.
   * @param finalState - Estado final al aterrizar.
   */
  private recordCompletedTrajectory(finalState: ProjectileState): void {
    this.completedTrajectories.push({
      params: this.currentParams!,
      color: this.activeTrajectoryColor,
      points: [...this.activeTrajectoryPoints],
      maxHeight: this.currentMaxHeight,
      maxRange: finalState.x,
    });
  }

  /**
   * Notifica a todos los observadores que el proyectil ha aterrizado.
   * @param finalState - Estado final al aterrizar.
   */
  private notifyAllObservers(finalState: ProjectileState): void {
    for (const observer of this.observerList) {
      observer.onProjectileLanded(finalState);
    }
  }
}
