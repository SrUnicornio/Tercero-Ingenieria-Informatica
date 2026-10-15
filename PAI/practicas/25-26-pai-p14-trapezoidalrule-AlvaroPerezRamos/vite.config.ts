/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file vite.config.ts
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since  May 2026
 * @description Configuración de Vite para P14 - Trapezoidal Rule Calculator.
 *   En desarrollo (vite) el base es '/' para que los assets se sirvan
 *   desde la raíz sin prefijo.
 *   En producción (vite build) se usa el nombre del repositorio para que
 *   las rutas funcionen correctamente en GitHub Pages.
 */

import {resolve} from 'path';
import {defineConfig} from 'vite';

/**
 * Configuración de Vite para el proyecto P14 — Trapezoidal Rule Calculator.
 */
export default defineConfig(({command}) => ({
  base: command === 'build'
    ? '/25-26-pai-p14-trapezoidalrule-AlvaroPerezRamos/'
    : '/',

  build: {
    /** Directorio de salida del bundle de producción. */
    outDir: 'dist',

    rollupOptions: {
      input: {
        /** Página raíz — portal de índice del proyecto. */
        projectIndexPage: resolve(__dirname, './index.html'),

        /**
         * Página de la aplicación Trapezoidal Rule Calculator.
         */
        trapezoidPage: resolve(
            __dirname,
            './src/exercises/home-work/trapezoid/' +
            'alvaro-perez-ramos-trapezoid.html',
        ),

        /** Página del diagrama UML de clases. */
        umlDiagramPage: resolve(
            __dirname,
            './src/exercises/home-work/uml/uml.html',
        ),

        /** Página de documentación generada por TypeDoc. */
        documentationPage: resolve(
            __dirname,
            './src/exercises/home-work/docs/index.html',
        ),

        /** Página reservada para el ejercicio de evaluación. */
        evaluationExercisePage: resolve(
            __dirname,
          './src/exercises/evaluation-exercise1-8-puzle/alvaro-perez-ramos-8-puzle.html'
        ),
      },
    },
  },

  test: {
    environment: 'jsdom',
    globals: true,
    include: [
      'src/exercises/home-work/test/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: [
        'src/exercises/home-work/trapezoid/**/*.ts',
      ],
    },
  },
}));
