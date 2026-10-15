/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file brownian-model.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

export interface Point {
  x: number;
  y: number;
}

export interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface TrailPoint extends Point {
  readonly timestamp: number;
}

export class BrownianModel {
  private position: Point = { x: 0, y: 0 };
  private maxDisplacement = 5;
  private bounds: Bounds = { left: 0, right: 0, top: 0, bottom: 0 };
  private trail: TrailPoint[] = [];

  constructor() { }

  // -------------------------------------------------------------------------
  // Interfaz pública
  // -------------------------------------------------------------------------

  step(): void {
    const dx = this.randomDelta();
    const dy = this.randomDelta();

    let x = this.position.x + dx;
    let y = this.position.y + dy;

    x = this.clamp(x, this.bounds.left, this.bounds.right);
    y = this.clamp(y, this.bounds.top, this.bounds.bottom);

    this.position = { x, y };
    this.addTrailPoint();
  }

  pruneTrail(maxAgeMs: number): void {
    const now = Date.now();
    this.trail = this.trail.filter(p => now - p.timestamp <= maxAgeMs);
  }

  // -------------------------------------------------------------------------
  // Getters / Setters
  // -------------------------------------------------------------------------

  getTrail(): readonly TrailPoint[] {
    return this.trail;
  }

  setMaxDisplacement(d: number): void {
    this.maxDisplacement = d;
  }

  updateBounds(bounds: Bounds): void {
    this.bounds = bounds;
  }

  /**
   * @method centerPosition
   * @description
   *   Sitúa la partícula en el centro de los bounds dados.
   *   Llamado por el controlador al iniciar o redimensionar.
   */
  centerPosition(bounds: Bounds): void {
    this.position = {
      x: (bounds.left + bounds.right) / 2,
      y: (bounds.top + bounds.bottom) / 2,
    };
    this.trail = [];
    this.addTrailPoint();
  }

  // -------------------------------------------------------------------------
  // Privados
  // -------------------------------------------------------------------------

  private addTrailPoint(): void {
    this.trail.push({ ...this.position, timestamp: Date.now() });
  }

  private randomDelta(): number {
    return (Math.random() * 2 - 1) * this.maxDisplacement;
  }

  private clamp(v: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, v));
  }
}