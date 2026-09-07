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
 * Archivo node.h: Declaracion de la clase nodo
 */
#ifndef __NODE_H__
#define __NODE_H__

#include "position.h"

struct Node {
  Position pos;
  int g; // Costo desde el inicio hasta este nodo
  int f; // f(n) = g(n) + h(n)

  bool operator<(const Node &other) const {
    return f > other.f; // Para que la cola de prioridad sea de mínimo f(n)
  }
};

struct Node2
{
  Position pos;
  double g; // Costo desde el inicio hasta este nodo
  double f; // f(n) = g(n) + h(n)

  bool operator<(const Node2 &other) const
  {
    return f > other.f; // Para que la cola de prioridad sea de mínimo f(n)
  }
};

#endif // __NODE_H__