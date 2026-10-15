/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file elipse-app.ts
 * @description
 *   Fachada de la aplicación que gestiona la interfaz de usuario y la interacción para dibujar una elipse en un canvas HTML5 utilizando la clase Ellipse.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */
/**
 * Universidad de La Laguna
 * @file ellipse-app.ts
 * @description Fachada que gestiona la UI, el sistema cartesiano y la animación.
 */

import { Ellipse } from './ellipse.js';

export class EllipseApp {
  private canvas!: HTMLCanvasElement;
  private context!: CanvasRenderingContext2D;

  // Elementos de entrada de la interfaz
  private inputSemiMajorAxis!: HTMLInputElement;
  private inputSemiMinorAxis!: HTMLInputElement;
  private inputOffsetX!: HTMLInputElement;
  private inputOffsetY!: HTMLInputElement;

  // Estado de la animación
  private animationFrameId: number = 0;
  private currentPlanetAngle: number = 0;
  private readonly rotationVelocity: number = 0.02;

  // Configuración del grid 
  private readonly pixelStepBetweenTicks = 50;
  private readonly tickLength = 6;

  constructor(private readonly containerId: string) {
    this.createInterface();
    this.render(); // Dibujo inicial
  }

  /**
   * Crea los controles y el canvas dinámicamente.
   */
  private createInterface(): void {
    const rootElement = document.getElementById(this.containerId);
    if (!rootElement) return;

    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls';

    const addInputField = (labelText: string, defaultValue: string) => {
      const label = document.createElement('label');
      label.textContent = `${labelText}: `;
      const input = document.createElement('input');
      input.type = 'number';
      input.value = defaultValue;
      label.appendChild(input);
      controlsContainer.appendChild(label);
      return input;
    };

    this.inputSemiMajorAxis = addInputField('Eje A (Horiz)', '200');
    this.inputSemiMinorAxis = addInputField('Eje B (Vert)', '120');
    this.inputOffsetX = addInputField('Despl. h', '0');
    this.inputOffsetY = addInputField('Despl. k', '0');

    const animateButton = document.createElement('button');
    animateButton.textContent = 'Iniciar Animación';
    animateButton.onclick = () => this.startAnimation();

    const stopButton = document.createElement('button');
    stopButton.textContent = 'Detener';
    stopButton.onclick = () => this.stopAnimation();

    controlsContainer.appendChild(animateButton);
    controlsContainer.appendChild(stopButton);

    this.canvas = document.createElement('canvas');
    this.canvas.width = window.innerWidth * 0.9;
    this.canvas.height = 550;
    this.context = this.canvas.getContext('2d')!;

    rootElement.appendChild(controlsContainer);
    rootElement.appendChild(this.canvas);
  }

  public startAnimation(): void {
    this.stopAnimation();
    const animationLoop = () => {
      this.render();
      this.currentPlanetAngle += this.rotationVelocity;
      this.animationFrameId = requestAnimationFrame(animationLoop);
    };
    animationLoop();
  }

  public stopAnimation(): void {
    if (this.animationFrameId !== 0) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  /**
   * Redibuja todo el contenido del canvas.
   */
  private render(): void {
    const context = this.context;
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const canvasCenterX = this.canvas.width / 2;
    const canvasCenterY = this.canvas.height / 2;

    this.drawCoordinateSystem(canvasCenterX, canvasCenterY);

    const currentEllipse = new Ellipse(
      parseFloat(this.inputSemiMajorAxis.value) || 0,
      parseFloat(this.inputSemiMinorAxis.value) || 0,
      parseFloat(this.inputOffsetX.value) || 0,
      parseFloat(this.inputOffsetY.value) || 0
    );

    currentEllipse.drawOrbit(context, canvasCenterX, canvasCenterY);
    currentEllipse.drawPlanet(context, canvasCenterX, canvasCenterY, this.currentPlanetAngle);
  }

  /**
   * Dibuja los ejes con marcas (ticks) y números.
   */
  private drawCoordinateSystem(originX: number, originY: number): void {
    const context = this.context;
    context.save();
    context.strokeStyle = 'gray';
    context.fillStyle = 'black';
    context.font = '10px Arial';

    this.drawSimpleLine(0, originY, this.canvas.width, originY);
    this.drawSimpleLine(originX, 0, originX, this.canvas.height);

    // Marcas en el eje X
    for (let offset = this.pixelStepBetweenTicks; originX + offset < this.canvas.width || originX - offset > 0; offset += this.pixelStepBetweenTicks) {
      if (originX + offset < this.canvas.width) this.drawTick(originX + offset, originY, 'horizontal', offset.toString());
      if (originX - offset > 0) this.drawTick(originX - offset, originY, 'horizontal', (-offset).toString());
    }

    // Marcas en el eje Y
    for (let offset = this.pixelStepBetweenTicks; originY + offset < this.canvas.height || originY - offset > 0; offset += this.pixelStepBetweenTicks) {
      if (originY + offset < this.canvas.height) this.drawTick(originX, originY + offset, 'vertical', (-offset).toString());
      if (originY - offset > 0) this.drawTick(originX, originY - offset, 'vertical', offset.toString());
    }

    context.fillText('0', originX + 5, originY - 5);
    context.restore();
  }

  /**
   * Dibuja una marca (tick) en el eje correspondiente con su etiqueta.
   */
  private drawTick(x: number, y: number, orientation: 'horizontal' | 'vertical', label: string): void {
    const context = this.context;
    context.beginPath();
    if (orientation === 'horizontal') {
      context.moveTo(x, y - this.tickLength / 2);
      context.lineTo(x, y + this.tickLength / 2);
      context.textAlign = 'center';
      context.fillText(label, x, y + 15);
    } else {
      context.moveTo(x - this.tickLength / 2, y);
      context.lineTo(x + this.tickLength / 2, y);
      context.textAlign = 'right';
      context.textBaseline = 'middle';
      context.fillText(label, x - 10, y);
    }
    context.stroke();
  }

  /**
   * Dibuja una línea simple entre dos puntos.
   */
  private drawSimpleLine(startX: number, startY: number, endX: number, endY: number): void {
    this.context.beginPath();
    this.context.moveTo(startX, startY);
    this.context.lineTo(endX, endY);
    this.context.stroke();
  }
}