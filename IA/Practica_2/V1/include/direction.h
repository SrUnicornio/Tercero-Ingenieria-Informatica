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
 * Archivo direction.h: Declaracion del enum class Directrion para establecer un nombre y del struct Direction info para almacenar el camino seguido
 */
#ifndef DIRECTION_H
#define DIRECTION_H

#include <string>
#include "position.h"

enum class Direction {
  N,
  NE,
  E,
  SE,
  S,
  SW,
  W,
  NW
};

// Estructura para almacenar información de dirección
struct DirectionInfo {
  Direction dir;
  Position offset;
  int cost;
};

struct DirectionInfo2
{
  Direction dir;
  Position offset;
  double cost;
};

// Función para convertir la dirección a una cadena
std::string directionToString(Direction dir);

#endif // DIRECTION_H
