/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file trochoid-model.ts
 * @description
 *   Modelo (capa M del patrón MVC) de la aplicación Trochoid.
 *   Almacena los parámetros de los círculos y genera los datos de dibujo.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

import {
  CircleData,
  SegmentData,
  PointData,
  CircleStyle,
  DEFAULT_CIRCLE_STYLES,
} from '../interfaces/trochoid-params.js';

/**
 * @interface RenderData
 * @description Todos los elementos que la vista debe dibujar.
 */
export interface RenderData {
  readonly circles: readonly CircleData[];
  readonly segments: readonly SegmentData[];
  readonly points: readonly PointData[];
}

/**
 * @class TrochoidModel
 * @classdesc
 *   Modelo MVC de la Trochoid.
 *   Almacena los parámetros de los círculos y genera los datos de renderizado.
 */
export class TrochoidModel {
  // Parámetros del círculo rodante
  private rollingCircleRadius: number = 1;
  private rollingCircleCenterX: number = 0;
  private rollingCircleCenterY: number = 0;
  private rollingCircleStyle: CircleStyle = DEFAULT_CIRCLE_STYLES.ROLLING_CIRCLE;

  // Parámetros del círculo exterior
  private outerCircleRadius: number = 2;
  private outerCircleCenterX: number = 0;
  private outerCircleCenterY: number = 0;
  private outerCircleStyle: CircleStyle = DEFAULT_CIRCLE_STYLES.OUTER_CIRCLE;
  private isOuterCircleVisible: boolean = true;

  // Parámetros del punto trazador
  private tracerPointRadiusPx: number = 6;
  private tracerPointColor: string = 'red';

  // Parámetros del segmento
  private segmentColor: string = 'red';
  private segmentWidth: number = 2;

  // Ángulo del punto trazador (en radianes)
  private angle: number = 0;

  // ---------------------------------------------------------------------------
  // Getters y Setters para el círculo rodante
  // ---------------------------------------------------------------------------

  getRollingCircleRadius(): number {
    return this.rollingCircleRadius;
  }

  setRollingCircleRadius(radius: number): void {
    this.rollingCircleRadius = radius;
  }

  getRollingCircleCenter(): { x: number; y: number } {
    return { x: this.rollingCircleCenterX, y: this.rollingCircleCenterY };
  }

  setRollingCircleCenter(x: number, y: number): void {
    this.rollingCircleCenterX = x;
    this.rollingCircleCenterY = y;
  }

  getRollingCircleStyle(): CircleStyle {
    return { ...this.rollingCircleStyle };
  }

  setRollingCircleStyle(style: CircleStyle): void {
    this.rollingCircleStyle = { ...style };
  }

  // ---------------------------------------------------------------------------
  // Getters y Setters para el círculo exterior
  // ---------------------------------------------------------------------------

  getOuterCircleRadius(): number {
    return this.outerCircleRadius;
  }

  setOuterCircleRadius(radius: number): void {
    this.outerCircleRadius = radius;
  }

  getOuterCircleCenter(): { x: number; y: number } {
    return { x: this.outerCircleCenterX, y: this.outerCircleCenterY };
  }

  setOuterCircleCenter(x: number, y: number): void {
    this.outerCircleCenterX = x;
    this.outerCircleCenterY = y;
  }

  getOuterCircleStyle(): CircleStyle {
    return { ...this.outerCircleStyle };
  }

  setOuterCircleStyle(style: CircleStyle): void {
    this.outerCircleStyle = { ...style };
  }

  isOuterCircleVisible(): boolean {
    return this.isOuterCircleVisible;
  }

  setOuterCircleVisible(visible: boolean): void {
    this.isOuterCircleVisible = visible;
  }

  toggleOuterCircleVisibility(): void {
    this.isOuterCircleVisible = !this.isOuterCircleVisible;
  }

  // ---------------------------------------------------------------------------
  // Getters y Setters para el punto trazador
  // ---------------------------------------------------------------------------

  getTracerPointRadius(): number {
    return this.tracerPointRadiusPx;
  }

  setTracerPointRadius(radiusPx: number): void {
    this.tracerPointRadiusPx = radiusPx;
  }

  getTracerPointColor(): string {
    return this.tracerPointColor;
  }

  setTracerPointColor(color: string): void {
    this.tracerPointColor = color;
  }

  // ---------------------------------------------------------------------------
  // Getters y Setters para el segmento
  // ---------------------------------------------------------------------------

  getSegmentColor(): string {
    return this.segmentColor;
  }

  setSegmentColor(color: string): void {
    this.segmentColor = color;
  }

  getSegmentWidth(): number {
    return this.segmentWidth;
  }

  setSegmentWidth(width: number): void {
    this.segmentWidth = width;
  }

  // ---------------------------------------------------------------------------
  // Ángulo
  // ---------------------------------------------------------------------------

  getAngle(): number {
    return this.angle;
  }

  setAngle(angle: number): void {
    this.angle = angle;
  }

  // ---------------------------------------------------------------------------
  // Generación de datos de renderizado
  // ---------------------------------------------------------------------------

  /**
   * @method getRenderData
   * @description Genera todos los datos necesarios para que la vista dibuje.
   */
  getRenderData(): RenderData {
    const circles: CircleData[] = [];

    // Círculo rodante
    circles.push({
      centerX: this.rollingCircleCenterX,
      centerY: this.rollingCircleCenterY,
      radius: this.rollingCircleRadius,
      style: this.rollingCircleStyle,
    });

    // Círculo exterior (opcional)
    if (this.isOuterCircleVisible) {
      circles.push({
        centerX: this.outerCircleCenterX,
        centerY: this.outerCircleCenterY,
        radius: this.outerCircleRadius,
        style: this.outerCircleStyle,
      });
    }

    // Calcular posición del punto trazador
    const tracerX = this.outerCircleRadius * Math.cos(this.angle);
    const tracerY = this.outerCircleRadius * Math.sin(this.angle);

    // Segmento (centro → punto trazador)
    const segments: SegmentData[] = [
      {
        fromX: this.rollingCircleCenterX,
        fromY: this.rollingCircleCenterY,
        toX: tracerX,
        toY: tracerY,
        color: this.segmentColor,
        lineWidth: this.segmentWidth,
      },
    ];

    // Punto trazador
    const points: PointData[] = [
      {
        centerX: tracerX,
        centerY: tracerY,
        radiusPx: this.tracerPointRadiusPx,
        color: this.tracerPointColor,
      },
    ];

    return { circles, segments, points };
  }

  // ---------------------------------------------------------------------------
  // Método para cambiar el ángulo (si se necesita)
  // ---------------------------------------------------------------------------

  incrementAngle(delta: number): void {
    this.angle += delta;
  }
}