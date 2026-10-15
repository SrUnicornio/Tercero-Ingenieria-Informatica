/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file elipse.ts
 * @description
 *   Implementación de la clase Ellipse para representar y dibujar una elipse utilizando las ecuaciones paramétricas.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * @class Ellipse
 * @description Representa la geometría de una elipse y el planeta asociado.
 */
export class Ellipse {
  /**
   * @param semiMajorAxis Longitud del semi-eje horizontal (A).
   * @param semiMinorAxis Longitud del semi-eje vertical (B).
   * @param horizontalCenterOffset Desplazamiento del centro en X (h).
   * @param verticalCenterOffset Desplazamiento del centro en Y (k).
   */
  constructor(
    private readonly semiMajorAxis: number,
    private readonly semiMinorAxis: number,
    private readonly horizontalCenterOffset: number,
    private readonly verticalCenterOffset: number,
  ) { }

  /**
   * Dibuja la trayectoria de la elipse (Órbita).
   */
  public drawOrbit(context: CanvasRenderingContext2D, originX: number, originY: number): void {
    const totalPoints = 600;
    const doublePi = 2 * Math.PI;

    context.beginPath();
    context.strokeStyle = 'blue';
    context.lineWidth = 2;

    for (let i = 0; i <= totalPoints; i++) {
      const theta = (i / totalPoints) * doublePi;
      const posX = originX + this.semiMajorAxis * Math.cos(theta) + this.horizontalCenterOffset;
      // En canvas Y crece hacia abajo, restamos para que visualmente suba
      const posY = originY - (this.semiMinorAxis * Math.sin(theta) + this.verticalCenterOffset);

      if (i === 0) {
        context.moveTo(posX, posY);
      } else {
        context.lineTo(posX, posY);
      }
    }
    context.stroke();
  }

  /**
   * Dibuja el planeta en una posición angular específica.
   * @param angleT Parámetro t de la ecuación (en radianes).
   */
  public drawPlanet(context: CanvasRenderingContext2D, originX: number, originY: number, angleT: number): void {
    const planetRadius = 10;
    const posX = originX + this.semiMajorAxis * Math.cos(angleT) + this.horizontalCenterOffset;
    const posY = originY - (this.semiMinorAxis * Math.sin(angleT) + this.verticalCenterOffset);

    context.beginPath();
    context.fillStyle = 'red';
    context.arc(posX, posY, planetRadius, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }
}