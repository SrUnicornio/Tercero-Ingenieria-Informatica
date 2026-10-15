/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file brownian-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import { Point, TrailPoint } from "../model/brownian-model.js";

export interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export interface BrownianViewConfig {
  particleRadius: number;
  trailLifetimeMs: number;
}

const DEFAULT_CONFIG: BrownianViewConfig = {
  particleRadius: 11,
  trailLifetimeMs: 8000,
};

export class BrownianView {
  private context: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private config: BrownianViewConfig;
  private canvas: HTMLCanvasElement;

  constructor(config: Partial<BrownianViewConfig> = {}) {
    this.canvas = document.getElementById("brownianCanvas") as HTMLCanvasElement;

    if (!this.canvas) {
      throw new Error('BrownianView: no se encontró <canvas id="brownianCanvas">.');
    }

    const context = this.canvas.getContext("2d");
    if (!context) {
      throw new Error("BrownianView: no se pudo obtener el contexto 2D.");
    }

    this.context = context;
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.resize();
  }

  // -------------------------------------------------------------------------
  // Gestión del tamaño
  // -------------------------------------------------------------------------

  resize(): Bounds {
    this.width = window.innerWidth - 40;
    this.height = window.innerHeight - 40;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    return this.getBounds();
  }

  // -------------------------------------------------------------------------
  // Dibujo
  // -------------------------------------------------------------------------

  clear(): void {
    this.context.fillStyle = "black";
    this.context.fillRect(0, 0, this.width, this.height);

    this.context.strokeStyle = "blue";
    this.context.lineWidth = 1;
    this.context.strokeRect(0, 0, this.width, this.height);
  }

  drawTrail(trailPoints: readonly TrailPoint[]): void {
    const now = Date.now();

    for (let i = 1; i < trailPoints.length; i++) {
      const prev = trailPoints[i - 1];
      const curr = trailPoints[i];

      const ageMs = now - curr.timestamp;
      const opacity = 1 - ageMs / this.config.trailLifetimeMs;

      if (opacity <= 0) continue;

      this.context.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
      this.context.lineWidth = 3;
      this.context.beginPath();
      this.context.moveTo(prev.x, prev.y);
      this.context.lineTo(curr.x, curr.y);
      this.context.stroke();
    }
  }

  drawParticle(p: Point): void {
    this.context.beginPath();
    this.context.arc(p.x, p.y, this.config.particleRadius, 0, Math.PI * 2);
    this.context.fillStyle = "white";
    this.context.fill();
  }

  render(trail: readonly TrailPoint[]): void {
    this.clear();
    this.drawTrail(trail);
    this.drawParticle(trail[trail.length - 1]);
  }

  // -------------------------------------------------------------------------
  // Consultas
  // -------------------------------------------------------------------------

  getBounds(): Bounds {
    return {
      left: 20,
      right: this.width - 20,
      top: 20,
      bottom: this.height - 20,
    };
  }
}