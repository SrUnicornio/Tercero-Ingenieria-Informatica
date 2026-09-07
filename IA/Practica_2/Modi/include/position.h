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
 * Archivo position.h: Declaracion de la tipo de dato Position y comparacionposition
 */
#ifndef __POSITION_H__
#define __POSITION_H__

#include <map>
#include <utility>

typedef std::pair<int, int> Position;

// Comparador para Position en mapas
struct ComparePosition {
  bool operator()(const Position &a, const Position &b) const {
    if (a.first != b.first)
      return a.first < b.first;
    return a.second < b.second;
  }
};

#endif // __POSITION_H__