/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas
 *
 * @file brands-source.ts
 * @description Fuente de palabras para la categoría Marcas y Empresas.
 *
 * @author Álvaro Pérez Ramos <alu0101574042@ull.edu.es>
 * @since April 2026
 */

import {WordCategory} from '../../interfaces/game-state.js';

/**
 * Fuente de palabras para la categoría Marcas y Empresas.
 */
export class BrandsSource extends WordCategory {
  override readonly label = 'Marcas y Empresas';

  private readonly words: readonly string[] = [
    // --- COCHES ---
    'Ferrari', 'Lamborghini', 'Porsche', 'Rolls-Royce', 'Bugatti',
    'Mercedes-Benz', 'BMW', 'Audi', 'Tesla', 'Volkswagen',
    'Maserati', 'Aston Martin', 'Bentley', 'McLaren', 'Jaguar',
    'Alfa Romeo', 'Chevrolet', 'Ford', 'Toyota', 'Nissan',
    'Hyundai', 'Mitsubishi', 'Subaru', 'Volvo', 'Lexus',
    'Land Rover', 'Jeep', 'Cadillac', 'Suzuki', 'Mazda',

    // --- ROPA / MODA ---
    'Gucci', 'Louis Vuitton', 'Chanel', 'Prada', 'Versace',
    'Balenciaga', 'Zara', 'Hermes', 'Burberry', 'Calvin Klein',
    'Valentino', 'Fendi', 'Saint Laurent', 'Givenchy', 'Armani',
    'Lacoste', 'Tommy Hilfiger', 'Levis', 'Massimo Dutti', 'Bershka',
    'Pull and Bear', 'Stradivarius', 'H&M', 'Mango', 'Primark',
    'Guess', 'Diesel', 'Ralph Lauren', 'Desigual', 'Victoria Secret',

    // --- PERFUMES ---
    'Dior', 'Givenchy', 'Yves Saint Laurent', 'Giorgio Armani', 'Thierry Mugler',
    'Carolina Herrera', 'Hugo Boss', 'Jean Paul Gaultier', 'Dolce Gabbana', 'Tom Ford',
    'Lancome', 'Estee Lauder', 'Chanel Number Five', 'Paco Rabanne', 'Kenzo',
    'Narciso Rodriguez', 'Jo Malone', 'Byredo', 'Le Labo', 'Diptyque',
    'Guerlain', 'Bvlgari', 'Hermetica', 'Montale', 'Creed',
    'Loewe', 'Issey Miyake', 'Chloe', 'Cacharel', 'Valentino',

    // --- TECNOLOGÍA  ---
    'Apple', 'Samsung', 'Microsoft', 'Google', 'Sony',
    'Intel', 'Nvidia', 'IBM', 'Oracle', 'Huawei',
    'Amazon', 'Meta', 'Netflix', 'Xiaomi', 'Oppo',
    'Lenovo', 'Asus', 'Acer', 'Dell', 'HP',
    'Logitech', 'Nintendo', 'Panasonic', 'LG', 'Toshiba',
    'Adobe', 'Salesforce', 'Cisco', 'Qualcomm', 'AMD',

    // --- ALIMENTACIÓN ---
    'Coca-Cola', 'Nestle', 'Danone', 'Kellogs', 'Ferrero',
    'Pepsi', 'Mondelez', 'Unilever', 'Kraft', 'Mars',
    'Pringles', 'Heineken', 'Starbucks', 'McDonalds', 'Burger King',
    'Nutella', 'Kinder', 'Oreo', 'Milka', 'KitKat',
    'Lays', 'Doritos', 'Red Bull', 'Monster', 'Nespresso',

    // --- DEPORTE ---
    'Nike', 'Adidas', 'Puma', 'New Balance', 'Under Armour',
    'Reebok', 'Asics', 'Skechers', 'Converse', 'Vans',
    'Salomon', 'The North Face', 'Patagonia', 'Columbia', 'Mizuno',
    'Umbro', 'Kappa', 'Fila', 'Lululemon', 'Oakley',
    'Billabong', 'Quiksilver', 'Speedo', 'Arena', 'Wilson',

    // --- LUJO / JOYERÍA ---
    'Rolex', 'Cartier', 'Tiffany', 'Bulgari', 'Swarovski',
    'Omega', 'Tag Heuer', 'Patek Philippe', 'Audemars Piguet', 'Hublot',
    'Chopard', 'Van Cleef Arpels', 'Montblanc', 'Graff', 'Harry Winston',
    'Mikimoto', 'Boucheron', 'Piaget', 'Breitling', 'Tudor',
    'Longines', 'Hamilton', 'Tissot', 'Pandora', 'Tous',
  ];

  override getWord(): string {
    return this.words[Math.floor(Math.random() * this.words.length)];
  }
}

export const brandsSource = new BrandsSource();
