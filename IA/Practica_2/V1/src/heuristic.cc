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
 * Archivo heurintic.h: Implementacion de las heurísticas
 */
#include "heuristic.h"

/**
 * @brief Heuristica del camino de Manhatan
 * @param current posicion actual
 * @param end posicion de destino
 * @param W factor de camino
 * @return el valor de la heurística
 */
int heuristicManhattan(const Position &current, const Position &end, int W)
{
  return (std::abs(end.first - current.first) + std::abs(end.second - current.second)) * W;
}

/**
 * @brief Heuristica del camino de Euclidiana
 * @param current posicion actual
 * @param end posicion de destino
 * @param W factor de camino
 * @return el valor de la heurística
 */
double heuristicEuclidean(const Position &current, const Position &end, double W)
{
  double dx = static_cast<double>(end.second - current.second);
  double dy = static_cast<double>(end.first - current.first);
  return std::sqrt(dx * dx + dy * dy) * W;
}
