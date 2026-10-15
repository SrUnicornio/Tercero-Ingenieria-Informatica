/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file render-config.ts
* @description Configuración visual del renderer del canvas del ahorcado.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 */

/**
 * Parámetros visuales del renderer del canvas del ahorcado.
 *
 * @property strokeColor   - Color del trazo de la horca y el muñeco.
 * @property lineWidth     - Grosor de línea en píxeles.
 * @property padding       - Margen interior del canvas en píxeles.
 */
export interface RenderConfig {
  readonly strokeColor: string;
  readonly lineWidth: number;
  readonly padding: number;
}

/**
 * Configuración por defecto: trazo negro, grosor 4, padding 20.
 */
export const DEFAULT_RENDER_CONFIG: RenderConfig = {
  strokeColor: 'black',
  lineWidth: 4,
  padding: 20,
};
