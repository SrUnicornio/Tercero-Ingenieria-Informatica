/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file render.ts
 * @description
 *   Implementación de clases para renderizar un sistema de coordenadas cartesianas y funciones matemáticas en un canvas.
 *   Incluye la gestión del canvas, el dibujo del grid, los ejes y la representación de funciones.
 * 
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  30 March 2026
 */

import { MathFunction } from './math-functions.js';
import { Point, CartesianGridConfig } from "./config.js";
import { CoordinateSystemModel } from "./coordinate.js";

/**
 * Constantes para estilos de líneas (dashed)
 */
// const MINOR_LINE_DASH = [2, 4];
// const MAJOR_LINE_DASH = [6, 6];
const LABEL_OFFSET_PX = 10;


/**
 * @class CanvasManager
 * @classdesc Maneja la interacción con el elemento canvas y su contexto 2D.
 * Proporciona métodos para limpiar el canvas y obtener sus dimensiones.
 */
export class CanvasManager {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  /**
   * @constructor
   * @description Inicializa el CanvasManager con el ID del canvas en el DOM.
   * @param canvasId - ID del elemento canvas a gestionar.
   * @throws Error si el elemento no es un canvas o si no se puede obtener el contexto 2D.
   */
  constructor(canvasId: string) {
    const element = document.getElementById(canvasId);

    if (!(element instanceof HTMLCanvasElement)) {
      throw new Error(`Canvas no válido: ${canvasId}`);
    }

    const context = element.getContext('2d');
    if (!context) {
      throw new Error('No se pudo obtener contexto 2D');
    }

    this.canvas = element;
    this.context = context;
  }

  /**
   * @method getContext
   * @description Devuelve el contexto 2D del canvas para dibujar.
   * @returns El contexto 2D del canvas.
   */
  getContext(): CanvasRenderingContext2D {
    return this.context;
  }

  /**
   * @method getWidth
   * @description Devuelve el ancho del canvas en píxeles.
   * @returns El ancho del canvas.
   */
  getWidth(): number {
    return this.canvas.width;
  }

  /**
   * @method getHeight
   * @description Devuelve la altura del canvas en píxeles.
   * @returns La altura del canvas.
   */
  getHeight(): number {
    return this.canvas.height;
  }

  /**
   * @method clear
   * @description Limpia todo el contenido del canvas, dejándolo en blanco.
   */
  clear(): void {
    this.context.clearRect(0, 0, this.getWidth(), this.getHeight());
  }
}

/**
 * @class LineDrawer
 * @classdesc Servicio compartido para trazar segmentos en el canvas.
 */
export class LineDrawer {
  /**
   * @constructor
   * @param canvas - Gestor de canvas que provee el contexto de dibujo.
   */
  constructor(private readonly canvas: CanvasManager) { }

  /**
   * @method draw
   * @description Dibuja una línea entre dos puntos del canvas.
   * @param start - Punto de inicio de la línea.
   * @param end - Punto de fin de la línea.
   */
  draw(start: Point, end: Point): void {
    const context = this.canvas.getContext();
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }
}


/**
 * @class GridRenderer
 * @classdesc Encargado de dibujar el grid del sistema de coordenadas cartesianas.
 * Dibuja tanto las líneas menores (grid) como las mayores (ejes).
 * Utiliza la configuración proporcionada para personalizar la apariencia.
 */
export class GridRenderer {
  /**
   * @constructor
   * @description Inicializa el GridRenderer con el canvas, el modelo y la configuración.
   * @param canvas - Instancia de CanvasManager para dibujar en el canvas.
   * @param model - Instancia de CoordinateSystemModel para obtener el origen y la escala.
   * @param config - Configuración para personalizar la apariencia del grid y los ejes.
   */
  constructor(
    private readonly canvas: CanvasManager,
    private readonly model: CoordinateSystemModel,
    private readonly config: CartesianGridConfig,
    private readonly lineDrawer: LineDrawer,
  ) { }

  /**
   * @method draw
   * @description Dibuja el grid completo, incluyendo líneas menores y mayores.
   * Se encarga de llamar a los métodos específicos para cada tipo de línea.
   */
  draw(): void {
    this.drawMinor();
    this.drawMajor();
  }

  /**
   * @method drawMinor
   * @description Dibuja las líneas menores del grid, utilizando un estilo punteado.
   * Solo dibuja las líneas que no coinciden con las líneas mayores (ejes).
   */
  private drawMinor(): void {
    const context = this.canvas.getContext();
    const origin = this.model.getOrigin();
    const step = this.config.minorStepPx;
    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();

    context.save();
    context.strokeStyle = this.config.gridMinorColor;
    context.lineWidth = 0.5;
    // context.setLineDash(MINOR_LINE_DASH);

    // --- Verticales (hacia derecha e izquierda del eje Y) ---
    for (let x = origin.x + step; x <= width; x += step) {
      if ((x - origin.x) % this.config.majorStepPx !== 0) {
        this.line({ x, y: 0 }, { x, y: height });
      }
    }
    for (let x = origin.x - step; x >= 0; x -= step) {
      if ((origin.x - x) % this.config.majorStepPx !== 0) {
        this.line({ x, y: 0 }, { x, y: height });
      }
    }

    // --- Horizontales (hacia arriba y abajo del eje X) ---
    for (let y = origin.y + step; y <= height; y += step) {
      if ((y - origin.y) % this.config.majorStepPx !== 0) {
        this.line({ x: 0, y }, { x: width, y });
      }
    }
    for (let y = origin.y - step; y >= 0; y -= step) {
      if ((origin.y - y) % this.config.majorStepPx !== 0) {
        this.line({ x: 0, y }, { x: width, y });
      }
    }

    context.restore();
  }

  /**
   * @method drawMajor
   * @description Dibuja las líneas mayores del grid, que corresponden a los ejes X e Y.
   */
  private drawMajor(): void {
    const context = this.canvas.getContext();
    const origin = this.model.getOrigin();
    const step = this.config.majorStepPx;

    context.save();
    context.strokeStyle = this.config.gridMajorColor;
    context.lineWidth = 1;
    // context.setLineDash(MAJOR_LINE_DASH);

    for (let x = origin.x; x <= this.canvas.getWidth(); x += step) {
      this.line({ x, y: 0 }, { x, y: this.canvas.getHeight() });
    }

    for (let x = origin.x; x >= 0; x -= step) {
      this.line({ x, y: 0 }, { x, y: this.canvas.getHeight() });
    }

    for (let y = origin.y; y <= this.canvas.getHeight(); y += step) {
      this.line({ x: 0, y }, { x: this.canvas.getWidth(), y });
    }

    for (let y = origin.y; y >= 0; y -= step) {
      this.line({ x: 0, y }, { x: this.canvas.getWidth(), y });
    }

    context.restore();
  }

  /**
   * @method line
   * @description Dibuja una línea entre dos puntos en el canvas.
   * @param start - Punto de inicio de la línea.
   * @param end - Punto de fin de la línea.
   */
  private line(start: Point, end: Point): void {
    this.lineDrawer.draw(start, end);
  }
}

/**
 * @class AxisRenderer
 * @classdesc Encargado de dibujar los ejes X e Y del sistema de coordenadas cartesianas.
 * Dibuja las líneas de los ejes, las marcas (ticks) y las etiquetas con los valores correspondientes.
 * Utiliza la configuración proporcionada para personalizar la apariencia de los ejes y las etiquetas.
 */
export class AxisRenderer {
  /**
   * @constructor
   * @description Inicializa el AxisRenderer con el canvas, el modelo y la configuración.
   * @param canvas - Instancia de CanvasManager para dibujar en el canvas.
   * @param model - Instancia de CoordinateSystemModel para obtener el origen y la escala.
   * @param config - Configuración para personalizar la apariencia de los ejes y las etiquetas.
   */
  constructor(
    private readonly canvas: CanvasManager,
    private readonly model: CoordinateSystemModel,
    private readonly config: CartesianGridConfig,
    private readonly lineDrawer: LineDrawer,
  ) { }

  /**
   * @method draw
   * @description Dibuja los ejes X e Y, incluyendo las líneas principales, las marcas (ticks) y las etiquetas.
   */
  draw(): void {
    this.drawAxes();
    this.drawAxisTicks();
    this.drawAxisLabels();
  }

  /**
   * @method drawAxes
   * @description Dibuja las líneas principales de los ejes X e Y en el canvas.
   */
  private drawAxes(): void {
    const context = this.canvas.getContext();
    const origin = this.model.getOrigin();
    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();

    context.save();
    context.strokeStyle = this.config.axisColor;
    context.lineWidth = 2;

    this.lineDrawer.draw({ x: 0, y: origin.y }, { x: width, y: origin.y });
    this.drawArrowhead(width, origin.y, 0); 
    this.lineDrawer.draw({ x: origin.x, y: 0 }, { x: origin.x, y: height });
    this.drawArrowhead(origin.x, 0, -Math.PI / 2);

    context.restore();
  }

  /**
   * @method drawXAxisTicks
   * @description Dibuja las marcas (ticks) en el eje X, indicando las unidades correspondientes.
   * Las marcas se dibujan cada cierto número de píxeles definido en la configuración.
   */
  private drawAxisTicks(): void {
    const context = this.canvas.getContext();
    const origin = this.model.getOrigin();
    const step = this.config.majorStepPx;
    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();
    const margin = 2

    context.save();
    context.strokeStyle = this.config.axisColor;
    context.lineWidth = 1;

    for (let x = origin.x + step; x <= width - margin; x += step) {
      this.drawTick(x, origin.y, true);
    }
    for (let x = origin.x - step; x >= margin; x -= step) {
      this.drawTick(x, origin.y, true);
    }

    for (let y = origin.y + step; y <= height - margin; y += step) {
      this.drawTick(origin.x, y, false);
    }
    for (let y = origin.y - step; y >= margin; y -= step) {
      this.drawTick(origin.x, y, false);
    }

    context.restore();
  }

  /**
   * @method drawArrowhead
   * @description Dibuja una flecha en el extremo de un eje para indicar la dirección positiva.
   * @param x - Coordenada X en píxeles donde se dibujará la flecha.
   * @param y - Coordenada Y en píxeles donde se dibujará la flecha.
   * @param angle - Ángulo de rotación en radianes.
   */
  private drawArrowhead(x: number, y: number, angle: number): void {
    const context = this.canvas.getContext();
    const arrowSize = 10;

    context.save();
    context.translate(x, y);
    context.rotate(angle);

    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(-arrowSize, -arrowSize / 2);
    context.lineTo(-arrowSize, arrowSize / 2);
    context.closePath();
    context.fill();

    context.restore();
  }

  /**
   * @method drawXAxisLabels
   * @description Dibuja las etiquetas numéricas en el eje X, indicando las unidades correspondientes.
   * Las etiquetas se dibujan cada cierto número de píxeles definido en la configuración, y se posicionan adecuadamente para no superponerse con los ticks.
   */
  private drawAxisLabels(): void {
    const context = this.canvas.getContext();
    const origin = this.model.getOrigin();
    const stepPx = this.config.majorStepPx;
    const tickX = this.config.unitsPerTickX;
    const tickY = this.config.unitsPerTickY;
    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();
    const padding = 20;

    context.save();
    context.fillStyle = this.config.labelColor;
    context.font = this.config.font;
    context.textAlign = 'center';
    context.textBaseline = 'top';

    for (let i = 1; ; i++) {
      const x = origin.x + i * stepPx;
      if (x > width - padding) break;
      context.fillText(String(i * tickX), x, origin.y + LABEL_OFFSET_PX);
    }

    for (let i = -1; ; i--) {
      const x = origin.x + i * stepPx;
      if (x < padding) break;
      context.fillText(String(i * tickX), x, origin.y + LABEL_OFFSET_PX);
    }

    context.textAlign = 'right';
    context.textBaseline = 'middle';
    for (let i = 1; ; i++) {
      const y = origin.y - i * stepPx;
      if (y < padding) break; 
      context.fillText(String(i * tickY), origin.x - LABEL_OFFSET_PX, y);
    }

    for (let i = -1; ; i--) {
      const y = origin.y - i * stepPx;
      if (y > height - padding) break;
      context.fillText(String(i * tickY), origin.x - LABEL_OFFSET_PX, y);
    }

    context.textAlign = 'left';
    context.textBaseline = 'bottom';
    context.fillText('0', origin.x + 6, origin.y - 6);

    context.restore();
  }

  /**
   * @method drawTick
   * @description Dibuja una marca (tick) en el eje correspondiente, indicando la unidad en ese punto.
   * Las marcas se dibujan como pequeñas líneas perpendiculares al eje principal, con un tamaño definido en la configuración.
   * @param x - Coordenada X en píxeles donde se dibujará la marca (tick).
   * @param y - Coordenada Y en píxeles donde se dibujará la marca (tick).
   * @param horizontal - Indica si la marca es para el eje horizontal (X) o vertical (Y), lo que determina la orientación de la marca.
   */
  private drawTick(x: number, y: number, horizontal: boolean): void {
    const size = this.config.tickSizePx;

    if (horizontal) {
      this.lineDrawer.draw({ x, y: y - size }, { x, y: y + size });
    } else {
      this.lineDrawer.draw({ x: x - size, y }, { x: x + size, y });
    }
  }
}

/**
 * @class FunctionPlotter
 * @classdesc
 *   Encargado de representar funciones matemáticas sobre el sistema de coordenadas.
 *
 *   Utiliza el modelo de coordenadas para transformar valores matemáticos a píxeles.
 */
export class FunctionPlotter {
  /**
   * @constructor
   * @description Inicializa el FunctionPlotter con el canvas y el modelo de coordenadas.
   * @param canvas - Instancia de CanvasManager para dibujar en el canvas.
   * @param model - Instancia de CoordinateSystemModel para obtener el origen y la escala.
   */
  constructor(
    private readonly canvas: CanvasManager,
    private readonly model: CoordinateSystemModel,
  ) { }

  /**
   * @method plot
   * @description Dibuja la gráfica de una función matemática sobre el sistema de coordenadas.
   * Recorre cada píxel horizontal del canvas, calcula el valor matemático correspondiente, lo transforma a coordenadas de píxeles y dibuja la línea resultante.
   * Maneja casos especiales como discontinuidades o asíntotas para evitar líneas erráticas en la gráfica.
   * @param func - Función matemática a representar, que implementa la interfaz MathFunction.
   */
  plot(func: MathFunction): void {
    const context = this.canvas.getContext();
    const width = this.canvas.getWidth();
    const height = this.canvas.getHeight();
    const origin = this.model.getOrigin();
    const scaleX = this.model.getPixelsPerUnitX();
    const scaleY = this.model.getPixelsPerUnitY();

    context.save();
    context.strokeStyle = 'red';
    context.lineWidth = 2;
    context.beginPath();

    let prevMathY: number | null = null;
    let prevPixelY: number | null = null;
    const pointsPerPixel = 5;
    const step = 1 / pointsPerPixel;

    for (let pixelX = 0; pixelX <= width; pixelX += step) {
      const mathX = (pixelX - origin.x) / scaleX;
      const mathY = func.evaluate(mathX);
      const pixelY = origin.y - mathY * scaleY;

      if (!Number.isFinite(mathY)) {
        prevMathY = null;
        prevPixelY = null;
        continue;
      }

      if (prevMathY !== null && prevPixelY !== null) {
        const threshold = (height / scaleY) * 2;
        const isAsymptote = Math.abs(mathY - prevMathY) > threshold &&
          Math.sign(mathY) !== Math.sign(prevMathY);

        if (isAsymptote) {
          const direction = Math.sign(prevMathY);
          const virtualMaxY = direction > 0 ? -1000 : height + 1000;
          context.lineTo(pixelX - 0.5, virtualMaxY);

          const virtualMinY = direction > 0 ? height + 1000 : -1000;
          context.moveTo(pixelX, virtualMinY);
          context.lineTo(pixelX, pixelY);
        } else {
          context.lineTo(pixelX, pixelY);
        }
      } else {
        context.moveTo(pixelX, pixelY);
      }

      prevMathY = mathY;
      prevPixelY = pixelY;
    }

    context.stroke();
    context.restore();
  }
}
