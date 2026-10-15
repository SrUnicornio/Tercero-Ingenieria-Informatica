/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Programación de Aplicaciones Interactivas 2021-2022
 *
 * @author F. de Sande
 * @since Feb 27 2024
 * @description El programa modela un sistema de gestión de medios de transporte
 *              El diseño viola uno de los principios SOLID
 */

class Transportation {
  constructor(private transporter: string, private volume: number) {
	  this.transporter = transporter;
	  this.volume = volume;
  }

  /**
   * @description Computes the price of the transportation
   * @returns The price of the transportation
   */
  computePrice(): number {
    switch (this.transporter) {
      case 'Truck':
  	    return (500 * this.volume);  
        break;
      case 'Ship':
  	    return (300 * this.volume);  
        break;
      case 'Plane':
        return (1000 * this.volume);
        break;
      default:
        throw new Error('Unsupported Transport media');
        break;
    }
  }
}

export function main(): void { 
  const truck = new Transportation('Truck', 100);
  const ship = new Transportation('Ship', 5000);
  const plane = new Transportation('Plane', 100);
  console.log('Trasnport price for truck: ' + truck.computePrice() + ' euros.'); 
  console.log('Trasnport price for ship: ' + ship.computePrice() + ' euros.');
  console.log('Trasnport price for plane: ' + plane.computePrice() + ' euros.');
}

main();
