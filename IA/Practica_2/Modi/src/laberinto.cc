/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Inteligencia Artificial
 * Curso: 3º
 * Práctica 2: Búsqueda A*
 * Autor: Álvaro Pérez Ramos
 * Correo: alu0101574042@ull.edu.es
 * Fecha: 18/09/2024
 * Archivo Laberinto.cc: Implementación de la clase Laberinto que maneja el laberinto y sus operaciones
 */
#include "laberinto.h"
#include <algorithm>
#include <string>

/**
 * @brief Constructor de la clase Laberinto.
 *
 * Inicializa el laberinto con el número de filas y columnas especificadas.
 * Reserva memoria dinámica para almacenar la matriz que representa el laberinto.
 *
 * @param row Número de filas del laberinto.
 * @param col Número de columnas del laberinto.
 */
Laberinto::Laberinto(int row, int col) : rows_(row), cols_(col) {
  laberinto_ = new int *[row];
  for (int i = 0; i < row; i++) {
    laberinto_[i] = new int[col];
  }
}

/**
 * @brief Imprime el estado actual del laberinto en un archivo de salida.
 *
 * Este método muestra el laberinto en una representación visual, marcando el camino encontrado y los nodos generados durante la iteración del algoritmo A*.
 * Los elementos visuales utilizados son:
 * - "█" para paredes.
 * - "*" para el camino.
 * - "X" para los nodos generados.
 * - "S" para el inicio.
 * - "E" para el fin.
 *
 * @param output_file Flujo de salida de archivos donde se imprimirá el laberinto.
 * @param path Vector de posiciones que representan el camino encontrado desde el inicio hasta el fin.
 * @param generated_nodes Vector de posiciones que representan los nodos generados en la iteración actual del algoritmo A*.
 */
void Laberinto::printLaberinto(std::ofstream &output_file,
                               const std::vector<Position> &path,
                               const std::vector<Position> &generated_nodes) const
{
  output_file << getRows() << "x" << getCols() << std::endl;
  std::string wall = "█";
  for (int i = 0; i < getRows(); i++)
  {
    for (int j = 0; j < getCols(); j++)
    {
      bool isPath = false;
      for (const auto &pos : path)
      {
        if (i == pos.first && j == pos.second)
        {
          isPath = true;
          break;
        }
      }

      bool isGenerated = false;
      for (const auto &gen : generated_nodes)
      {
        if (i == gen.first && j == gen.second)
        {
          isGenerated = true;
          break;
        }
      }

      if (isPath)
      {
        if (getLaberinto()[i][j] != 3 && getLaberinto()[i][j] != 4)
        { // No sobreescribir inicio o fin
          output_file << "*";
          continue;
        }
      }

      if (isGenerated)
      {
        if (getLaberinto()[i][j] != 3 && getLaberinto()[i][j] != 4)
        { // No sobreescribir inicio o fin
          output_file << "X";
          continue;
        }
      }

      switch (getLaberinto()[i][j])
      {
      case 0:
        output_file << " ";
        break; // empty
      case 1:
        output_file << wall;
        break; // wall
      case 2:
        output_file << "*";
        break; // path
      case 3:
        output_file << "S";
        break; // start
      case 4:
        output_file << "E";
        break; // end
      default:
        output_file << "?";
        break; // unknown
      }
    }
    output_file << std::endl;
  }
}
