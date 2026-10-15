/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Programación de Aplicaciones Interactivas
 *
 * @file dev-server.js
 * @description Servidor Express para desarrollo que:
 *  - Sirve la página índice desde /public
 *  - Sirve los ejercicios directamente desde la raíz (/)
 *  - Sirve los ficheros compilados desde /dist
 *  - Sirve el diagrama UML bajo /uml
 *  - Integra LiveReload para recarga automática
 *
 * IMPORTANTE:
 * Los HTML de ejercicios son accesibles como:
 *   http://IP:PORT/archivo.html
 *
 * @author Álvaro Pérez Ramos
 * @since 30 MAR 2026
 */

import express from 'express';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

import livereload from 'livereload';
import connectLivereload from 'connect-livereload';
import console from 'console';

/**
 * Resolución de __dirname en módulos ES.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Aplicación Express.
 */
const app = express();

/**
 * Configuración del servidor.
 */
const PORT = 8080;
const HOST = '0.0.0.0';

/**
 * Rutas base del proyecto.
 */
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const SRC = path.join(ROOT, 'src');
const EXERCISES = path.join(SRC, 'exercises');
const DIST = path.join(ROOT, 'dist');

/**
 * Submódulos reales según tu estructura
 */
const HOME_WORK = path.join(EXERCISES, 'home-work');
const HANGMAN = path.join(HOME_WORK, 'hangman');
const UML = path.join(HOME_WORK, 'uml');
const DOCS = path.join(HOME_WORK, 'docs');

const EVALUATION = path.join(EXERCISES, 'evaluation-exercise1-title');

/**
 * ---------------------------------------------------------
 * LiveReload
 * ---------------------------------------------------------
 */
const liveReloadServer = livereload.createServer({
  exts: ['html', 'css', 'js'],
  ignore: [
    '**/node_modules/**',
    '**/.git/**',
  ],
});

/**
 * Directorios observados para recarga automática.
 */
liveReloadServer.watch([
  PUBLIC,
  DIST,
  EXERCISES,
  HANGMAN,
  UML,
  EVALUATION,
  DOCS,
]);

/**
 * Middleware LiveReload.
 */
app.use(connectLivereload());

/**
 * ---------------------------------------------------------
 * Archivos estáticos
 * ---------------------------------------------------------
 */

/**
 * 1. Página índice (public)
 */
app.use(express.static(PUBLIC));

/**
 * 2. JavaScript compilado desde TypeScript
 */
app.use(express.static(DIST));

/**
 * 3. Ejercicios accesibles desde raíz
 */
app.use('/', express.static(EXERCISES));

/**
 * 4. UML
 */
app.use(express.static(UML));

/**
 * 5. HANGMAN animation (home-work)
 */
app.use(express.static(HANGMAN));

/**
 * 6. Documentación
 */
app.use("/docs", express.static(DOCS));

/**
 * 7. Evaluación
 */
app.use("/evaluation", express.static(EVALUATION));

/**
 * ---------------------------------------------------------
 * Rutas explícitas
 * ---------------------------------------------------------
 */

/**
 * Ruta raíz → index.html
 */
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC, 'index.html'));
});

/**
 * ---------------------------------------------------------
 * Utilidades
 * ---------------------------------------------------------
 */

/**
 * Obtiene la dirección IPv4 local.
 * @returns {string}
 */
function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return 'localhost';
}

/**
 * ---------------------------------------------------------
 * Arranque del servidor
 * ---------------------------------------------------------
 */
app.listen(PORT, HOST, () => {
  const ip = getLocalIP();

  console.log('\nServidor iniciado correctamente\n');
  console.log(`Acceso local: http://localhost:${PORT}`);
  console.log(`Acceso red:    http://${ip}:${PORT}\n`);
});

/**
 * Fuerza recarga tras conexión LiveReload.
 */
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh('/');
  }, 100);
});