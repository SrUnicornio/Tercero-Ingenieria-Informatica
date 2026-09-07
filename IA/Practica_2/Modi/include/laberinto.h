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
 * Archivo laberinto.h: Declaracion de la clase Laberinto
 */
#ifndef __LABERINTO_H__
#define __LABERINTO_H__

#include <fstream>
#include <vector>
#include "position.h"

class Laberinto {
private:
  int rows_;
  int cols_;
  int **laberinto_;

public:
  // Constructor y destructor
  Laberinto(int row, int col);
  ~Laberinto() = default; // Uso de vector elimina la necesidad de un destructor personalizado

  // Getters
  int **getLaberinto() const { return laberinto_; }
  int getRows() const { return rows_; }
  int getCols() const { return cols_; }

  // Métodos
  void printLaberinto(std::ofstream &output_file,
                      const std::vector<Position> &path = {},
                      const std::vector<Position> &generated_nodes = {}) const;
};


#endif //__LABERINTO_H__