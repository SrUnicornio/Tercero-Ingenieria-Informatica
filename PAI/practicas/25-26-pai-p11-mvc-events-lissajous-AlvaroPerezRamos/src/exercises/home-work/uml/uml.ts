/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas
 *
 * @file uml.ts
 * @description Carga el diagrama Mermaid desde lissajous.mmd
 * y lo renderiza en la página uml.html.
 *
 * @author Álvaro Pérez Ramos
 * @since 18 MAR 2026
 */

// eslint-disable-next-line max-len
// @ts-ignore
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.13.0/+esm';

/**
 * @function initUml
 * @description Obtiene el diagrama desde lissajous.mmd y lo renderiza
 * con Mermaid en el contenedor #uml-container.
 * @returns {Promise<void>}
 */
async function initUml(): Promise<void> {
  mermaid.initialize({ startOnLoad: false, theme: 'default' });
  const response = await fetch('/lissajous.mmd');
  const container = document.getElementById('uml-container');
  if (!container) {
    throw new Error('Contenedor #uml-container no encontrado');
  }
  const diagram = await response.text();

  const { svg } = await mermaid.render('uml-diagram', diagram);
  container.innerHTML = svg;
}

initUml();