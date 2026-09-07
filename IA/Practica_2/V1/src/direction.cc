/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Inteligencia Artifical
 * Curso: 3º
 * Práctica 2: Busqueda A*
 * Autor: Álvaro Pérez Ramos
 * Correo: alu0101574042@ull.edu.es
 * Fecha: 18/09/2024
 * Archivo direction.cc: Implementacion de direction
 */
#include "direction.h"

/**
 * @brief Convierte en cadena de tacto las coordenadas
 * @param dir direcion actual
 * @return la cadena asociadda a ña direccion
 */
std::string directionToString(Direction dir) {
  switch (dir) {
  case Direction::N:
    return "N";
  case Direction::NE:
    return "NE";
  case Direction::E:
    return "E";
  case Direction::SE:
    return "SE";
  case Direction::S:
    return "S";
  case Direction::SW:
    return "SW";
  case Direction::W:
    return "W";
  case Direction::NW:
    return "NW";
  default:
    return "?";
  }
}