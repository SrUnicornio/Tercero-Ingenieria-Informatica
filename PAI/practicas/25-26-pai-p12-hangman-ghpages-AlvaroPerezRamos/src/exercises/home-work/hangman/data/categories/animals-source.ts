/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file animals-source.ts
 * @description Fuente de palabras para la categoría Animales.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {WordCategory} from '../../interfaces/game-state.js';

/**
 * Fuente de palabras para la categoría Animales.
 * Encapsula el diccionario completo como miembro privado de la clase.
 */
export class AnimalsSource extends WordCategory {
  override readonly label = 'Animales';

  private readonly words: readonly string[] = [
    // --- MAMÍFEROS (50) ---
    'Alce', 'Alpaca', 'Ardilla', 'Armadillo', 'Babuino', 'Ballena', 'Bisonte', 'Búfalo', 'Burro', 'Caballo',
    'Camello', 'Canguro', 'Caracal', 'Castor', 'Cebra', 'Cerdo', 'Chimpancé', 'Ciervo', 'Coatí', 'Comadreja',
    'Conejo', 'Coyote', 'Delfín', 'Dromedario', 'Elefante', 'Erizo', 'Foca', 'Gato', 'Gibón', 'Gorila',
    'Guepardo', 'Hámster', 'Hiena', 'Hipopótamo', 'Humano', 'Jabalí', 'Jaguar', 'Jirafa', 'Koala', 'Lémur',
    'León', 'Leopardo', 'Llama', 'Lobo', 'Mandril', 'Mapache', 'Marmota', 'Morsa', 'Nutria', 'Oso',

    // --- ANIMALES ACUÁTICOS (50) ---
    'Almeja', 'Anémona', 'Anguila', 'Atún', 'Bacalao', 'Barracuda', 'Beluga', 'Bogavante', 'Bonito', 'Caballito de mar',
    'Calamar', 'Cangrejo', 'Carabela portuguesa', 'Caracol de mar', 'Lamprea', 'Centolla', 'Pez payaso', 'Coral', 'Dorada', 'Erizo de mar',
    'Esponja', 'Estrella de mar', 'Gambón', 'Jibia', 'Langosta', 'Lenguado', 'Cangrejo herradura', 'Lubina', 'Manatí', 'Mantarraya',
    'Medusa', 'Mejillón', 'Merluza', 'Morena', 'Narval', 'Nautilus', 'Orca', 'Ostra', 'Pepino de mar', 'Pez espada',
    'Pez globo', 'Pez linterna', 'Pez martillo', 'Pulpo', 'Raya', 'Rodaballo', 'Salmón', 'Sardina', 'Tiburón', 'Trucha',

    // --- AVES (50) ---
    'Abejaruco', 'Águila', 'Albatros', 'Avestruz', 'Búho', 'Buitre', 'Canario', 'Carbonero', 'Cernícalo', 'Cisne',
    'Codorniz', 'Colibrí', 'Cóndor', 'Cormorán', 'Cuervo', 'Emú', 'Faisán', 'Flamenco', 'Fragata', 'Frailecillo',
    'Fumarel', 'Gaviota', 'Gallina', 'Gallo', 'Ganso', 'Garza', 'Golondrina', 'Guacamayo', 'Halcón', 'Hornero',
    'Jilguero', 'Kakapo', 'Kiwi', 'Lechuza', 'Loro', 'Mirlo', 'Ñandú', 'Paloma', 'Pato', 'Pavo',
    'Pelícano', 'Periquito', 'Petirrojo', 'Pingüino', 'Quebrantahuesos', 'Quetzal', 'Tucán', 'Verderón', 'Urraca', 'Vencejo',

    // --- REPTILES Y ANFIBIOS (50) ---
    'Agama', 'Anaconda', 'Áspid', 'Basilisco', 'Boa', 'Caimán', 'Camaleón', 'Cascabel', 'Cobra', 'Cocodrilo',
    'Culebra', 'Dragón de Komodo', 'Eslizón', 'Falsa coral', 'Gavial', 'Gecko', 'Heloderma', 'Hidrofida', 'Iguana', 'Jarretera',
    'Mamba negra', 'Mabuya', 'Monstruo de Gila', 'Tortuga mapa', 'Pancora', 'Pitón', 'Culebra lisa', 'Rana dardo', 'Ranita de San Antonio', 'Salamandra',
    'Serpiente coral', 'Skink', 'Taipán', 'Tejú', 'Tortuga carey', 'Tortuga de Florida', 'Tortuga Galápagos', 'Tortuga laúd', 'Tritón', 'Tuátara',
    'Víbora áspid', 'Culebra de agua', 'Uromastyx', 'Varano', 'Víbora', 'Víbora cornuda', 'Víbora de foseta', 'Serpiente real', 'Lagarto ocelado', 'Culebra bastarda',

    // --- INSECTOS Y ARÁCNIDOS (50) ---
    'Abeja', 'Abejorro', 'Avispa', 'Avispón', 'Báculo', 'Chinche', 'Cigarra', 'Cochinilla', 'Cocuyo', 'Ciervo volante',
    'Escarabajo', 'Escorpión', 'Esfinge', 'Escolopendra', 'Fásmido', 'Grillo', 'Hormiga', 'Hormiga león', 'Insecto palo', 'Insecto hoja',
    'Jicote', 'Langosta', 'Libélula', 'Licena', 'Luciérnaga', 'Mantis religiosa', 'Mariposa', 'Mariquita', 'Mayate', 'Mira',
    'Mosca', 'Mosquito', 'Ninfálido', 'Ortóptero', 'Oruga', 'Palomilla', 'Escarabajo pelotero', 'Piojo', 'Polilla', 'Pulga', 'Pulgón',
    'Saltamontes', 'Tábano', 'Taltuza', 'Tarántula', 'Termita', 'Tijereta', 'Torito', 'Vaquita de San Antonio', 'Zancudo',
  ];

  override getWord(): string {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }
}

export const animalsSource = new AnimalsSource();
