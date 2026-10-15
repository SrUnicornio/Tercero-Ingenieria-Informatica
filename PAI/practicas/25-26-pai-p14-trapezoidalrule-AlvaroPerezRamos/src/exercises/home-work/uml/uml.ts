/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file uml.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  April 2026
 * @description Renderiza los cuatro diagramas Mermaid del proyecto P13.
 *   Cada fichero .mmd se importa con `?raw` (Vite) para incluirse en el
 *   bundle y funcionar en GitHub Pages sin fetch en tiempo de ejecución.
 *
 *   Las tabs del HTML permiten alternar entre los cuatro diagramas sin
 *   recargar la página. Cada vez que el usuario selecciona una tab, el
 *   contenedor se limpia y se renderiza el diagrama correspondiente.
 */

// @ts-ignore — import desde CDN sin tipos
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11.13.0/+esm';

import fullSource from './trapezoid.mmd?raw';
import modelSource from './trapezoid-model.mmd?raw';
import viewSource from './trapezoid-view.mmd?raw';
import controllerSource from './trapezoid-controller.mmd?raw';

/** Mapa clave-diagrama → fuente Mermaid. */
const DIAGRAM_SOURCES: Record<string, string> = {
  full: fullSource,
  model: modelSource,
  view: viewSource,
  controller: controllerSource,
};

/**
 * @function renderDiagram
 * @description Limpia el contenedor y renderiza el diagrama Mermaid indicado.
 * @param diagramKey Clave del diagrama a renderizar ('full' | 'model' | 'view' | 'controller').
 */
async function renderDiagram(diagramKey: string): Promise<void> {
  const container = document.getElementById('uml-container');
  if (!container) throw new Error('Contenedor #uml-container no encontrado');

  const source = DIAGRAM_SOURCES[diagramKey];
  if (!source) throw new Error(`Diagrama desconocido: ${diagramKey}`);

  // Mermaid necesita un id único por render; si reutilizamos el mismo id
  // con un nodo ya existente en el DOM lanza error. Lo cambiamos en cada llamada.
  const renderId = `uml-diagram-${diagramKey}-${Date.now()}`;
  const {svg} = await mermaid.render(renderId, source);
  container.innerHTML = svg;
}

/**
 * @function initTabs
 * @description Añade listeners a las tabs del HTML para alternar diagramas.
 *   Gestiona la clase `is-active` de Bulma para resaltar la tab seleccionada.
 */
function initTabs(): void {
  const tabList = document.getElementById('uml-tabs');
  if (!tabList) return;

  tabList.addEventListener('click', async (event: Event) => {
    const clickedTab = (event.target as HTMLElement).closest<HTMLElement>('li[data-diagram]');
    if (!clickedTab) return;

    // Actualizar estado visual de las tabs
    tabList.querySelectorAll('li').forEach((tab) => tab.classList.remove('is-active'));
    clickedTab.classList.add('is-active');

    const diagramKey = clickedTab.dataset['diagram'] ?? 'full';
    await renderDiagram(diagramKey);
  });
}

/**
 * @function initUml
 * @description Punto de entrada: inicializa Mermaid, renderiza el diagrama
 *   completo por defecto y activa el sistema de tabs.
 */
async function initUml(): Promise<void> {
  mermaid.initialize({startOnLoad: false, theme: 'default'});
  await renderDiagram('full');
  initTabs();
}

initUml();
