const express = require("express");
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");

const app = express();
const port = 8080;

// Crear y configurar livereload
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "../docs"));

// Middleware para recargar en cambios
app.use(connectLivereload());

// Servir archivos estáticos desde docs
app.use(express.static(path.join(__dirname, "../docs")));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Recargar cuando haya cambios en archivos
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});