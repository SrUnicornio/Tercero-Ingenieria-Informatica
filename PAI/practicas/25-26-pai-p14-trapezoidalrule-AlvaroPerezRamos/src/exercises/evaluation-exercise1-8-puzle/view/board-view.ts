/**
 * Universidad de La Laguna — PAI P14
 * @file board-view.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since May 2026
 * @description Sub-vista del tablero. Gestiona dos modos:
 *   - Imagen completa (estado inicial): muestra Tigre.png.
 *   - Grid de piezas (tras Shuffle): grid CSS 3×3 superpuesto.
 *   Emite onTileClicked con el índice de la celda pulsada.
 */

import {PuzzleEvent} from '../observer/puzzle-event-publisher.js';
import {BLANK_TILE} from '../model/puzzle-model.js';

const IMG_BASE_PATH = `${import.meta.env.BASE_URL}img/puzzle/`;
const FULL_IMAGE_SRC = `${IMG_BASE_PATH}Tigre.png`;
const BLANK_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.85)';

const CSS_CLASSES = {
  FULL_IMAGE: 'puzzle-full-image',
  GRID: 'puzzle-grid',
  CELL: 'puzzle-cell',
  TILE_IMG: 'puzzle-tile-img',
  BLANK: 'puzzle-cell--blank',
} as const;

/**
 * @param tileId - Id de la pieza (1–8).
 * @param showNumbers - Si true usa TigreN.png, si false TigreN-H.png.
 */
function getTileImagePath(tileId: number, showNumbers: boolean): string {
  const suffix = showNumbers ? '' : '-H';
  return `${IMG_BASE_PATH}Tigre${tileId}${suffix}.png`;
}

/**
 * Gestiona la representación visual del tablero.
 * Emite onTileClicked cuando el usuario pulsa una celda del grid.
 */
export class BoardView {
  private readonly container: HTMLElement;
  private fullImage: HTMLImageElement | null = null;
  private gridElement: HTMLElement | null = null;
  private hasShuffled: boolean = false;

  /** Emitido cuando el usuario pulsa una celda. Payload: índice 0–8. */
  readonly onTileClicked = new PuzzleEvent<number>();

  /** @param containerId - ID del contenedor del puzzle en el DOM. */
  constructor(containerId: string) {
    this.container = this.getElement(containerId);
    this.renderFullImage();
  }

  /**
   * Reconstruye el grid completo (llamado tras Shuffle o movimiento).
   * La primera vez elimina la imagen completa.
   * @param board - Array de 9 posiciones (0=vacía, 1–8=pieza).
   * @param showNumbers - Si true muestra piezas con número.
   */
  render(board: readonly number[], showNumbers: boolean): void {
    if (!this.hasShuffled) {
      this.removeFullImage();
      this.hasShuffled = true;
    }
    this.renderGrid(board, showNumbers);
  }

  /**
   * Actualiza solo las imágenes del grid sin reconstruirlo.
   * No hace nada si el grid aún no existe.
   * @param board - Estado actual del tablero.
   * @param showNumbers - Nuevo estado del flag.
   */
  updateTileImages(
      board: readonly number[],
      showNumbers: boolean,
  ): void {
    if (!this.hasShuffled) return;
    this.renderGrid(board, showNumbers);
  }

  /**
   * Muestra la imagen completa del tigre. Llamado solo al inicio, antes de Shuffle.
   */
  private renderFullImage(): void {
    this.fullImage = document.createElement('img');
    this.fullImage.src = FULL_IMAGE_SRC;
    this.fullImage.alt = 'Imagen completa del tigre';
    this.fullImage.classList.add(CSS_CLASSES.FULL_IMAGE);
    this.container.appendChild(this.fullImage);
  }

  private removeFullImage(): void {
    if (this.fullImage) {
      this.fullImage.remove();
      this.fullImage = null;
    }
  }

  /**
   * Construye o reconstruye el grid superpuesto.
   * Registra el listener de click en cada celda con su índice.
   */
  private renderGrid(board: readonly number[], showNumbers: boolean): void {
    if (this.gridElement) {
      this.gridElement.remove();
    }
    this.gridElement = document.createElement('div');
    this.gridElement.classList.add(CSS_CLASSES.GRID);

    board.forEach((tileId, cellIndex) => {
      const cell = this.createCell(tileId, showNumbers);
      cell.addEventListener('click', () => {
        this.onTileClicked.trigger(cellIndex);
      });
      this.gridElement!.appendChild(cell);
    });

    this.container.appendChild(this.gridElement);
  }

  private createCell(tileId: number, showNumbers: boolean): HTMLElement {
    const cell = document.createElement('div');
    cell.classList.add(CSS_CLASSES.CELL);

    if (tileId === BLANK_TILE) {
      cell.classList.add(CSS_CLASSES.BLANK);
      cell.style.backgroundColor = BLANK_OVERLAY_COLOR;
    } else {
      const img = document.createElement('img');
      img.src = getTileImagePath(tileId, showNumbers);
      img.alt = `Pieza ${tileId}`;
      img.classList.add(CSS_CLASSES.TILE_IMG);
      cell.appendChild(img);
    }
    return cell;
  }

  private getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Elemento no encontrado: #${id}`);
    return element;
  }
}
