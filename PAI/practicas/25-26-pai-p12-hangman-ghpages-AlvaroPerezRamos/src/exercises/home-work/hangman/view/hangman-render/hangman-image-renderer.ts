/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file hangman-image-renderer.ts
 * @description Renderer del ahorcado basado en imágenes PNG.
 *   Muestra la imagen correspondiente al número de fallos (Hangman-0.png …
 *   Hangman-6.png). Si una imagen no puede cargarse, delega el renderizado
 *   en un HangmanCanvasRenderer sobre el mismo canvas, de forma que el juego
 *   siempre muestra algo coherente.
 *
 *   Ciclo de vida de una imagen:
 *     1. Se intenta cargar desde IMAGES_BASE_PATH.
 *     2. Si carga OK → se muestra en el <img> y el canvas queda oculto.
 *     3. Si falla    → se oculta el <img>, se muestra el canvas y se dibuja
 *                      con HangmanCanvasRenderer (fallback).
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {HangmanRenderer, HANGMAN_STAGE_COUNT} from './hangman-renderer.js';
import {HangmanCanvasRenderer} from './hangman-canvas-renderer.js';
import {DEFAULT_RENDER_CONFIG} from '../../interfaces/render-config.js';

/** Ruta base donde Vite sirve las imágenes estáticas del ahorcado.
 *  import.meta.env.BASE_URL es sustituido por Vite en build:
 *  - Desarrollo:  '/'
 *  - Producción:  '/25-26-pai-p12-hangman-ghpages-AlvaroPerezRamos/'
 */
const IMAGES_BASE_PATH = `${import.meta.env.BASE_URL}images/hangman/`;

/**
 * Renderer que alterna entre imagen PNG y canvas según disponibilidad.
 *
 * Uso esperado en el HTML:
 * ```html
 * <section id="section-canvas">
 *   <img id="hangmanImage" alt="Estado del ahorcado" />
 *   <canvas id="hangmanCanvas"></canvas>
 * </section>
 * ```
 *
 * Cuando la imagen carga correctamente, el canvas se oculta vía CSS
 * (`display: none`) y viceversa.
 */
export class HangmanImageRenderer extends HangmanRenderer {
  /** Elemento <img> donde se muestra la imagen PNG. */
  private readonly imageElement: HTMLImageElement;
  /** Canvas de respaldo, visible solo cuando la imagen no carga. */
  private readonly canvasFallback: HTMLCanvasElement;
  /** Renderer de canvas que se usa como fallback. */
  private readonly canvasRenderer: HangmanCanvasRenderer;
  /** Rutas a los siete PNGs, precalculadas al construir. */
  private readonly imagePaths: readonly string[];
  /** Último número de fallos renderizado; necesario para el fallback. */
  private lastFailedAttempts: number = 0;

  /**
   * @param imageElementId ID del elemento <img> del DOM.
   * @param canvasElementId ID del elemento <canvas> de respaldo.
   * @throws {Error} Si alguno de los dos elementos no existe o no es del tipo correcto.
   */
  constructor(imageElementId: string, canvasElementId: string) {
    super();

    const imageElement = document.getElementById(imageElementId);
    if (!(imageElement instanceof HTMLImageElement)) {
      throw new Error(
          `HangmanImageRenderer: <img id="${imageElementId}"> no encontrado.`,
      );
    }

    const canvasElement = document.getElementById(canvasElementId);
    if (!(canvasElement instanceof HTMLCanvasElement)) {
      throw new Error(
          `HangmanImageRenderer: <canvas id="${canvasElementId}"> no encontrado.`,
      );
    }

    this.imageElement = imageElement;
    this.canvasFallback = canvasElement;
    this.canvasRenderer = new HangmanCanvasRenderer(
        this.canvasFallback,
        DEFAULT_RENDER_CONFIG,
    );
    this.imagePaths = this.buildImagePaths();

    this.applyVisualScaling();
  }

  /**
   * Intenta mostrar la imagen PNG correspondiente al número de fallos.
   * Si la carga falla, muestra el canvas con el renderer de dibujo.
   * @param failedAttempts Número de intentos fallidos acumulados (0–6).
   */
  override render(failedAttempts: number): void {
    this.lastFailedAttempts = failedAttempts;
    const clampedIndex = Math.min(failedAttempts, HANGMAN_STAGE_COUNT - 1);

    const imageToLoad = new Image();
    imageToLoad.src = this.imagePaths[clampedIndex];

    imageToLoad.onload = () => {
      this.showImage(imageToLoad.src, clampedIndex);
    };

    imageToLoad.onerror = () => {
      this.showCanvasFallback();
    };
  }

  /**
   * Configura las propiedades CSS para que la imagen ocupe el máximo espacio
   * y no parezca pequeña frente al canvas.
   * @private
   */
  private applyVisualScaling(): void {
    this.imageElement.style.width = '100%';
    this.imageElement.style.height = '100%';
    this.imageElement.style.maxHeight = 'clamp(300px, 75vh, 680px)';
    this.imageElement.style.objectFit = 'contain';
  }

  // ── Métodos privados ─────────────────────────────────────────────────────

  /**
   * Muestra la imagen cargada y oculta el canvas.
   * @param imageSrc URL de la imagen ya cargada.
   * @param stageIndex Índice del estado (0–6), usado para el texto alternativo.
   */
  private showImage(imageSrc: string, stageIndex: number): void {
    this.imageElement.src = imageSrc;
    this.imageElement.alt = `Ahorcado — estado ${stageIndex} de 6`;
    this.imageElement.style.display = 'block';
    this.canvasFallback.style.display = 'none';
  }

  /**
   * Oculta la imagen, muestra el canvas y delega el dibujo al renderer de canvas.
   */
  private showCanvasFallback(): void {
    this.imageElement.style.display = 'none';
    this.canvasFallback.style.display = 'block';
    this.canvasRenderer.render(this.lastFailedAttempts);
  }

  /**
   * Construye el array de rutas a los siete PNGs (Hangman-0 … Hangman-6).
   * @returns Array de URLs ordenadas por índice de estado.
   */
  private buildImagePaths(): string[] {
    return Array.from(
        {length: HANGMAN_STAGE_COUNT},
        (_, stageIndex) => `${IMAGES_BASE_PATH}Hangman-${stageIndex}.png`,
    );
  }
}
