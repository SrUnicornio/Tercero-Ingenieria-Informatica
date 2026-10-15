/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hangman-canvas-renderer.ts
 * @description Implementación del renderer del ahorcado usando la Canvas API.
 *   Todo el cuerpo se calcula a partir de un único punto de anclaje
 *   (el extremo inferior de la cuerda), lo que garantiza que cabeza,
 *   torso y extremidades estén siempre alineados independientemente
 *   del tamaño del canvas.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {RenderConfig, DEFAULT_RENDER_CONFIG} from '../../interfaces/render-config.js';
import {HangmanRenderer, HANGMAN_STAGE_COUNT} from './hangman-renderer.js';

/** Cantidad de segmentos del cuerpo que se dibujan según los fallos. */
const MAX_BODY_PARTS = HANGMAN_STAGE_COUNT - 1;

/**
 * Renderer que dibuja el patíbulo y el cuerpo del ahorcado en un canvas 2D.
 */
export class HangmanCanvasRenderer extends HangmanRenderer {
  /** Contexto de renderizado 2D. */
  private readonly context: CanvasRenderingContext2D;

  /**
   * @param canvas Elemento HTML sobre el que se realiza el dibujo.
   * @param config Configuración de estilos visuales.
   * @throws {Error} Si no se puede obtener el contexto 2D del canvas.
   */
  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly config: RenderConfig = DEFAULT_RENDER_CONFIG,
  ) {
    super();
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context not available');
    }
    this.context = context;
  }

  /**
   * Ejecuta el ciclo de renderizado completo: limpieza, patíbulo y cuerpo.
   * @param failedAttempts Número de errores cometidos por el usuario.
   */
  public override render(failedAttempts: number): void {
    this.synchronizeCanvasDimensions();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const geometry = this.calculateBodyGeometry();
    this.drawGallows(geometry);
    this.drawCharacterBody(Math.min(failedAttempts, MAX_BODY_PARTS), geometry);
  }

  /**
   * Ajusta el tamaño del buffer de dibujo al tamaño real del elemento en el DOM.
   * @private
   */
  private synchronizeCanvasDimensions(): void {
    this.canvas.width = this.canvas.offsetWidth || 400;
    this.canvas.height = this.canvas.offsetHeight || 530;
  }

  /**
   * Calcula todos los puntos clave de la escena basándose en las dimensiones
   * actuales del lienzo y el padding configurado.
   * @returns Objeto con la geometría completa del sistema.
   * @private
   */
  private calculateBodyGeometry(): BodyGeometry {
    const {padding} = this.config;
    const width = this.canvas.width;
    const height = this.canvas.height;

    const gallowsColumnX = width * 0.25;
    const gallowsBeamY = padding;
    const gallowsBeamEndX = width * 0.65;
    const ropeLength = height * 0.12;

    const nooseAnchorY = gallowsBeamY + ropeLength;

    const headRadius = Math.min(width, height) * 0.07;
    const headCenterY = nooseAnchorY + headRadius;

    const torsoLength = height * 0.20;
    const shoulderLineY = headCenterY + headRadius;
    const hipLineY = shoulderLineY + torsoLength;

    return {
      canvasPadding: padding,
      gallowsColumnX,
      gallowsBeamY,
      gallowsBeamEndX,
      nooseAnchorY,
      headRadius,
      headCenterX: gallowsBeamEndX,
      headCenterY,
      shoulderLineY,
      hipLineY,
      armSpanLength: width * 0.11,
      legSpanLength: height * 0.16,
      legStanceWidth: height * 0.16 * 0.6,
    };
  }

  /**
   * Dibuja la estructura de madera y la soga.
   * @param geo Geometría calculada del sistema.
   * @private
   */
  private drawGallows(geo: BodyGeometry): void {
    const h = this.canvas.height;
    const w = this.canvas.width;

    this.drawSegment(geo.canvasPadding, h - geo.canvasPadding,
        w - geo.canvasPadding, h - geo.canvasPadding,
    );
    this.drawSegment(geo.gallowsColumnX, h - geo.canvasPadding,
        geo.gallowsColumnX, geo.gallowsBeamY,
    );
    this.drawSegment(geo.gallowsColumnX, geo.gallowsBeamY,
        geo.gallowsBeamEndX, geo.gallowsBeamY,
    );
    this.drawSegment(geo.headCenterX, geo.gallowsBeamY,
        geo.headCenterX, geo.nooseAnchorY,
    );
  }

  /**
   * Itera sobre las partes del cuerpo y las dibuja secuencialmente.
   * @param partsToDraw Número de partes a mostrar.
   * @param geo Geometría calculada del sistema.
   * @private
   */
  private drawCharacterBody(partsToDraw: number, geo: BodyGeometry): void {
    const drawingSequence: Array<(g: BodyGeometry) => void> = [
      (g) => this.drawHead(g),
      (g) => this.drawTorso(g),
      (g) => this.drawLimb(g, 'arm', 1),
      (g) => this.drawLimb(g, 'arm', -1),
      (g) => this.drawLimb(g, 'leg', 1),
      (g) => this.drawLimb(g, 'leg', -1),
    ];

    for (let i = 0; i < partsToDraw; i++) {
      drawingSequence[i](geo);
    }
  }

  /**
   * Dibuja la cabeza del personaje.
   * @param geo Geometría calculada.
   * @private
   */
  private drawHead(geo: BodyGeometry): void {
    this.prepareStroke();
    this.context.arc(geo.headCenterX, geo.headCenterY,
        geo.headRadius, 0, Math.PI * 2,
    );
    this.context.stroke();
  }

  /**
   * Dibuja el torso desde la línea de hombros hasta la cadera.
   * @param geo Geometría calculada.
   * @private
   */
  private drawTorso(geo: BodyGeometry): void {
    this.drawSegment(geo.headCenterX, geo.shoulderLineY,
        geo.headCenterX, geo.hipLineY,
    );
  }

  /**
   * Dibuja una extremidad (brazo o pierna) simétricamente.
   * @param geo Geometría calculada.
   * @param type Tipo de extremidad.
   * @param side Multiplicador de dirección (1 derecha, -1 izquierda).
   * @private
   */
  private drawLimb(geo: BodyGeometry, type: 'arm' | 'leg', side: number): void {
    const isArm = type === 'arm';
    const startY = isArm ? geo.shoulderLineY : geo.hipLineY;
    const lengthY = isArm ? geo.armSpanLength : geo.legSpanLength;
    const offsetX = isArm ? geo.armSpanLength : geo.legStanceWidth;

    this.drawSegment(
        geo.headCenterX,
        startY,
        geo.headCenterX + (side * offsetX),
        startY + lengthY,
    );
  }

  /**
   * Configura las propiedades de línea del contexto.
   * @private
   */
  private prepareStroke(): void {
    this.context.strokeStyle = this.config.strokeColor;
    this.context.lineWidth = this.config.lineWidth;
    this.context.lineCap = 'round';
    this.context.beginPath();
  }

  /**
   * Traza una línea recta entre dos puntos coordenados.
   * @param x1 Inicio X.
   * @param y1 Inicio Y.
   * @param x2 Fin X.
   * @param y2 Fin Y.
   * @private
   */
  private drawSegment(x1: number, y1: number, x2: number, y2: number): void {
    this.prepareStroke();
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  }
}

/**
 * Representa el conjunto de coordenadas y dimensiones espaciales necesarias
 * para renderizar el patíbulo y el personaje de forma proporcional.
 *
 * @param canvasPadding Margen de seguridad desde los bordes del canvas.
 * @param gallowsColumnX Coordenada X del poste vertical del patíbulo.
 * @param gallowsBeamY Coordenada Y de la viga horizontal del patíbulo.
 * @param gallowsBeamEndX Coordenada X donde termina la viga horizontal.
 * @param nooseAnchorY Coordenada Y donde cuelga la soga (inicio de la cabeza).
 * @param headRadius Radio de la cabeza del personaje.
 * @param headCenterX Coordenada X del centro de la cabeza (alineada con la soga).
 * @param headCenterY Coordenada Y del centro de la cabeza.
 * @param shoulderLineY Coordenada Y de los hombros (articulación de los brazos).
 * @param hipLineY Coordenada Y de las caderas (base del torso y articulación de piernas).
 * @param armSpanLength Extensión diagonal total de los brazos.
 * @param legSpanLength Extensión diagonal total de las piernas.
 * @param legStanceWidth Factor de separación horizontal para las piernas.
 */
interface BodyGeometry {
  readonly canvasPadding: number;
  readonly gallowsColumnX: number;
  readonly gallowsBeamY: number;
  readonly gallowsBeamEndX: number;
  readonly nooseAnchorY: number;
  readonly headRadius: number;
  readonly headCenterX: number;
  readonly headCenterY: number;
  readonly shoulderLineY: number;
  readonly hipLineY: number;
  readonly armSpanLength: number;
  readonly legSpanLength: number;
  readonly legStanceWidth: number;
}
