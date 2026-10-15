/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @author F. de Sande
 * @since Mar 25, 2023
 *        Updated Mar 21 2024
 * @description This code sets up a static file server in an Express.js application 
 *              by telling Express to serve static files from a specific directory on the file system.
 * @see {@link https://expressjs.com/en/starter/static-files.html}
 * @see {@link https://www.digitalocean.com/community/tutorials/nodejs-serving-static-files-in-express}
 * @see {@link https://github.com/nodejs/help/issues/2907#issuecomment-757446568}
 */

import express from 'express';
import fetch from 'node-fetch';       // To make http requests
import path from 'path';              // provides utilities for working with file and directory paths.
import { fileURLToPath } from 'url';  // Used to convert a file URL to a file path.
import { dirname } from 'path';       // The dirname function from the path module is used to get the directory name of a file path.

const app = express();

//set the port
app.set('port', 8080);

// define a route for fetching data
// When a GET request is made to the '/data' endpoint, the code inside the callback function will be executed. 
// The function uses node-fetch to make a request to an external API, then sends the response as JSON to the client.
app.get('/data', async (req, res) => {
  try {
    const URL = 'https://www.santacruzdetenerife.es/opendata/dataset/93b7d1bd-1b21-4f43-9316-671e2021f7fc/resource/0fa54a6d-35ef-41c1-ab1c-9af6efe0e9f0/download/canchas_deportivas.json';
    const response = await fetch(URL);
    const json = await response.json();
    res.json(json);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while fetching data.');
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Tell express that we want to use the www folder
// for our static assets
app.use(express.static(path.join(__dirname, '../www')));

// Start the server and listens for requests on the specified port
const SERVER = app.listen(app.get('port'), '0.0.0.0', function () {
  console.log('The server is running on http:localhost:' + app.get('port'));
});