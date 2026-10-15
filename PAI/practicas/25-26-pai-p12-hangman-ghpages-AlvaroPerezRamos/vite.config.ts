import { resolve } from 'path';
import { defineConfig } from 'vite';

/**
 * Configuración de Vite para el proyecto P12 - Hangman.
 *
 * En desarrollo (`vite`) el base es '/' para que los assets
 * se sirvan desde la raíz sin prefijo.
 * En producción (`vite build`) se usa el nombre del repositorio
 * para que las rutas funcionen correctamente en GitHub Pages.
 */
export default defineConfig(({ command }) => ({
  base: command === 'build'
    ? '/25-26-pai-p12-hangman-ghpages-AlvaroPerezRamos/'
    : '/',

  build: {
    /** Directorio de salida del bundle de producción. */
    outDir: 'dist',

    rollupOptions: {
      input: {
        /**
         * Página raíz — portal de índice del proyecto.
         */
        projectIndexPage: resolve(__dirname, './index.html'),

        /**
         * Página de la aplicación Hangman.
         */
        hangmanGamePage: resolve(
          __dirname,
          './src/exercises/home-work/hangman/alvaro-perez-ramos-hangman.html',
        ),

        /**
         * Página del diagrama UML de clases.
         */
        umlDiagramPage: resolve(
          __dirname,
          './src/exercises/home-work/uml/uml.html',
        ),

        /*
         * Página de documentación generada por TypeDoc.
         */
        documentationPage: resolve(
          __dirname,
          './src/exercises/home-work/docs/index.html',
        ),

        /**
         * Página reservada para el ejercicio de evaluación.
         */
        evaluationExercisePage: resolve(
          __dirname,
          './src/exercises/evaluation-exercise1-title/' +
          'alvaro-perez-ramos-evaluation.html',
        ),
      },
    },
  },
}));