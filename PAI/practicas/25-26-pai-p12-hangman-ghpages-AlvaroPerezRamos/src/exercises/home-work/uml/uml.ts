/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas
 *
 * @file uml.ts
 * @description Renderiza el diagrama Mermaid incrustado en el bundle.
 *   Se importa hangman.mmd como texto plano con `?raw` (característica de Vite)
 *   para que funcione tanto en desarrollo como en GitHub Pages sin rutas absolutas.
 *
 * @author Álvaro Pérez Ramos
 * @since April 2026
 */

// @ts-ignore — import desde CDN sin tipos
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.13.0/+esm';
// Vite incrusta el contenido del archivo como string en el bundle
import diagramSource from './hangman.mmd?raw';

/**
 * @function initUml
 * @description Renderiza el diagrama Mermaid en el contenedor #uml-container.
 * El contenido del .mmd se incluye en el bundle (no se hace fetch en tiempo de ejecución),
 * por lo que funciona correctamente en GitHub Pages y en cualquier servidor estático.
 * @returns {Promise<void>}
 */
async function initUml(): Promise<void> {
  mermaid.initialize({startOnLoad: false, theme: 'default'});
  const container = document.getElementById('uml-container');
  if (!container) {
    throw new Error('Contenedor #uml-container no encontrado');
  }
  const {svg} = await mermaid.render('uml-diagram', diagramSource);
  container.innerHTML = svg;
}

initUml();
