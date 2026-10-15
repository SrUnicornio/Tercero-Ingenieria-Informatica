/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file food-drink-source.ts
 * @description Fuente de palabras para la categoría Comida y Bebida.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {WordCategory} from '../../interfaces/game-state.js';

/**
 * Fuente de palabras para la categoría Comida y Bebida.
 */
export class FoodDrinkSource extends WordCategory {
  override readonly label = 'Comida y Bebida';

  private readonly words: readonly string[] = [
    // --- PRIMEROS PLATOS (50) ---
    'Ajoblanco', 'Alcachofas con jamón', 'Arroz a la cubana', 'Arroz al horno', 'Arroz a banda',
    'Berenjenas rellenas', 'Brocheta de verduras', 'Caldo de pollo', 'Canelones de carne', 'Crema de calabacín',
    'Crema de calabaza', 'Crema de champiñones', 'Crema de espárragos', 'Crema de verduras', 'Croquetas de jamón',
    'Ensalada campera', 'Ensalada César', 'Ensalada de pasta', 'Ensalada de quinoa', 'Ensalada mixta',
    'Ensaladilla rusa', 'Espaguetis boloñesa', 'Espaguetis carbonara', 'Espárragos trigueros', 'Espinacas con garbanzos',
    'Fideuá de marisco', 'Garbanzos con espinacas', 'Gazpacho andaluz', 'Gnocchis al pesto', 'Guisantes con jamón',
    'Hummus de garbanzos', 'Judías blancas con chorizo', 'Judías verdes con patatas', 'Lasaña de verduras', 'Lentejas con chorizo',
    'Macarrones con tomate', 'Menestra de verduras', 'Paella valenciana', 'Parrillada de verduras', 'Pasta con tomate',
    'Pastel de cabracho', 'Pimientos rellenos', 'Pisto manchego', 'Puré de patatas', 'Salmorejo cordobés',
    'Sopa de ajo', 'Sopa de cebolla', 'Sopa de marisco', 'Sopa de picadillo', 'Vichyssoise',

    // --- SEGUNDOS PLATOS (50) ---
    'Albóndigas en salsa', 'Bacalao al pil-pil', 'Bacalao a la vizcaína', 'Boquerones fritos', 'Cachopo asturiano',
    'Calamares a la romana', 'Calamares en su tinta', 'Callos a la madrileña', 'Carne con tomate', 'Chuletas de cordero',
    'Chuletón de buey', 'Cochinillo asado', 'Conejo al ajillo', 'Cordero asado', 'Corvina a la plancha',
    'Dorada al horno', 'Emperador a la plancha', 'Entrecot de ternera', 'Escalope de pollo', 'Estofado de ternera',
    'Filete de pavo', 'Filete de ternera', 'Fricandó de ternera', 'Galtas de cerdo', 'Hamburguesa completa',
    'Huevo frito con patatas', 'Lubina a la sal', 'Lomo de cerdo', 'Lomo con ajos', 'Merluza a la romana',
    'Merluza a la vasca', 'Merluza a la plancha', 'Milanesa de pollo', 'Moussaka', 'Ossobuco',
    'Pato a la naranja', 'Pechuga de pollo asada', 'Perdiz estofada', 'Pescaíto frito', 'Pollo al chilindrón',
    'Pollo al curry', 'Pollo asado', 'Pulpo a la gallega', 'Rabas de calamar', 'Rabo de toro',
    'Rosada a la plancha', 'Salmón al horno', 'Sepia a la plancha', 'Solomillo al whisky', 'Trucha a la navarra',

    // --- POSTRES (50) ---
    'Arroz con leche', 'Bizcocho de yogur', 'Brazo de gitano', 'Brownie de chocolate', 'Buñuelos de viento',
    'Canutillos de crema', 'Cheesecake', 'Clafoutis de cereza', 'Copa de chocolate', 'Crema catalana',
    'Creme brulee', 'Crepe de chocolate', 'Cuajada con miel', 'Donuts glaseados', 'Ensalada de frutas',
    'Flan de huevo', 'Flan de queso', 'Fresas con nata', 'Fruta del tiempo', 'Galletas de avena',
    'Gelatina de fresa', 'Goxua', 'Helado de chocolate', 'Helado de fresa', 'Helado de nata',
    'Helado de vainilla', 'Hojaldre de manzana', 'Leche frita', 'Macedonia', 'Mousse de chocolate',
    'Mousse de limón', 'Natillas con galleta', 'Pajarete', 'Panacota', 'Panna cotta',
    'Pantxineta', 'Pudin de pan', 'Peras al vino', 'Pestiños con miel', 'Profiteroles',
    'Queso con membrillo', 'Red Velvet', 'Sorbete de limón', 'Souffle de chocolate', 'Tarta de manzana',
    'Tarta de queso', 'Tarta de Santiago', 'Tiramisu', 'Torrijas', 'Yogur natural',

    // --- BEBIDAS (50) ---
    'Agua con gas', 'Agua mineral', 'Batido de chocolate', 'Batido de fresa', 'Batido de vainilla',
    'Bloody Mary', 'Caipiriña', 'Café con leche', 'Café solo', 'Cava Brut',
    'Cerveza artesana', 'Cerveza con limón', 'Cerveza negra', 'Cerveza sin alcohol', 'Champaña',
    'Clara de cerveza', 'Coctel de frutas', 'Cognac', 'Coca-Cola', 'Daikiri',
    'Gin-tonic', 'Granizado de limón', 'Horchata de chufa', 'Infusión de poleo', 'Infusión de manzanilla',
    'Jugo de piña', 'Limonada casera', 'Margarita', 'Martini', 'Mojito',
    'Mosto blanco', 'Mosto tinto', 'Pacharan', 'Piña colada', 'Rebusco',
    'Refresco de limón', 'Refresco de naranja', 'Ron con cola', 'Sangría', 'Sidra natural',
    'Smoothie de frutas', 'Te frío', 'Te negro', 'Te rojo', 'Te verde',
    'Tinto de verano', 'Vermut rojo', 'Vino blanco', 'Vino rosado', 'Vino tinto',
  ];

  override getWord(): string {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }
}

export const foodDrinkSource = new FoodDrinkSource();
