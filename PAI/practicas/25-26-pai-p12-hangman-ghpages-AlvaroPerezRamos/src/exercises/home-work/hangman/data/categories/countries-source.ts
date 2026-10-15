/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file countries-source.ts
 * @description Fuente de palabras para la categoría Países.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {WordCategory} from '../../interfaces/game-state.js';

/**
 * Fuente de palabras para la categoría Países.
 */
export class CountriesSource extends WordCategory {
  override readonly label = 'Países';

  private readonly words: readonly string[] = [
    // --- EUROPA ---
    'Albania', 'Alemania', 'Andorra', 'Armenia', 'Austria', 'Azerbaiyán', 'Bélgica', 'Bielorrusia',
    'Bosnia y Herzegovina', 'Bulgaria', 'Chipre', 'Ciudad del Vaticano', 'Croacia', 'Dinamarca',
    'Eslovaquia', 'Eslovenia', 'España', 'Estonia', 'Finlandia', 'Francia', 'Georgia', 'Grecia',
    'Hungría', 'Irlanda', 'Islandia', 'Italia', 'Kazajistán', 'Kosovo', 'Letonia', 'Liechtenstein',
    'Lituania', 'Luxemburgo', 'Macedonia del Norte', 'Malta', 'Moldavia', 'Mónaco', 'Montenegro',
    'Noruega', 'Países Bajos', 'Polonia', 'Portugal', 'Reino Unido', 'República Checa', 'Rumanía',
    'Rusia', 'San Marino', 'Serbia', 'Suecia', 'Suiza', 'Ucrania',

    // --- ASIA ---
    'Afganistán', 'Arabia Saudita', 'Baréin', 'Bangladés', 'Brunéi', 'Bután', 'Camboya', 'Catar',
    'China', 'Corea del Norte', 'Corea del Sur', 'Emiratos Árabes Unidos', 'Filipinas', 'India',
    'Indonesia', 'Irak', 'Irán', 'Israel', 'Japón', 'Jordania', 'Kirguistán', 'Kuwait', 'Laos',
    'Líbano', 'Malasia', 'Maldivas', 'Mongolia', 'Myanmar', 'Nepal', 'Omán', 'Pakistán', 'Palestina',
    'Singapur', 'Siria', 'Sri Lanka', 'Tailandia', 'Taiwán', 'Tayikistán', 'Timor Oriental',
    'Turkmenistán', 'Turquía', 'Uzbekistán', 'Vietnam', 'Yemen',

    // --- ÁFRICA ---
    'Angola', 'Argelia', 'Benín', 'Botsuana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Camerún',
    'Chad', 'Comoras', 'Costa de Marfil', 'Egipto', 'Eritrea', 'Etiopía', 'Gabón', 'Gambia',
    'Ghana', 'Guinea', 'Guinea-Bisáu', 'Guinea Ecuatorial', 'Kenia', 'Lesoto', 'Liberia', 'Libia',
    'Madagascar', 'Malaui', 'Malí', 'Marruecos', 'Mauricio', 'Mauritania', 'Mozambique', 'Namibia',
    'Níger', 'Nigeria', 'República Centroafricana', 'República del Congo', 'República Democrática del Congo',
    'Ruanda', 'Sahara Occidental', 'Santo Tomé y Príncipe', 'Senegal', 'Seychelles', 'Sierra Leona',
    'Somalia', 'Sudáfrica', 'Sudán', 'Sudán del Sur', 'Suazilandia', 'Tanzania', 'Togo', 'Túnez',
    'Uganda', 'Yibuti', 'Zambia', 'Zimbabue',

    // --- AMÉRICA DEL NORTE ---
    'Canadá', 'Estados Unidos', 'México',

    // --- AMÉRICA CENTRAL Y CARIBE ---
    'Antigua y Barbuda', 'Bahamas', 'Barbados', 'Belice', 'Costa Rica', 'Cuba', 'Dominica',
    'El Salvador', 'Granada', 'Guatemala', 'Haití', 'Honduras', 'Jamaica', 'Nicaragua', 'Panamá',
    'República Dominicana', 'San Cristóbal y Nieves', 'San Vicente y las Granadinas', 'Santa Lucía',
    'Trinidad y Tobago',

    // --- AMÉRICA DEL SUR ---
    'Argentina', 'Bolivia', 'Brasil', 'Chile', 'Colombia', 'Ecuador', 'Guyana', 'Paraguay',
    'Perú', 'Surinam', 'Uruguay', 'Venezuela',

    // --- OCEANÍA ---
    'Australia', 'Fiyi', 'Islas Marshall', 'Islas Salomón', 'Kiribati', 'Micronesia', 'Nauru',
    'Nueva Zelanda', 'Palaos', 'Papúa Nueva Guinea', 'Samoa', 'Tonga', 'Tuvalu', 'Vanuatu',
  ];

  override getWord(): string {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }
}

export const countriesSource = new CountriesSource();
