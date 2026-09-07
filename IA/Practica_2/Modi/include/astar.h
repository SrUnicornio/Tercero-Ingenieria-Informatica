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
 * Archivo astar.h: Declaracion de la clase A* y funciones auxiliares de reconstruccion de caminos
 */
#ifndef __ASTAR_H__
#define __ASTAR_H__

#include "direction.h"
#include "laberinto.h"
#include "position.h"
#include "node.h"
#include <map>
#include <queue>
#include <vector>

class AStarSolver
{
public:
  // Constructor
  AStarSolver(const Laberinto &laberinto, const Position &start, const Position &end, std::ofstream &output_info)
      : laberinto_(laberinto), start_(start), end_(end), output_info_(output_info), W_(3), W2_{3.50} {}
  
  // Método para ejecutar el algoritmo A*
  void solve(std::vector<Position> &path, std::vector<Direction> &directions_path);
  void solve2(std::vector<Position> &path, std::vector<Direction> &directions_path);

private:
  // Métodos auxiliares
  std::vector<DirectionInfo> getPossibleDirections() const;
  std::vector<DirectionInfo2> getPossibleDirections2() const;
  std::vector<Position> getNeighbors(const Position &current) const;
  bool isTraversable(const Position &pos) const;
  void logIteration(int iteration,
                    int heuristic_value, int g_cost, int f_cost,
                    const std::vector<Position> &path_current,
                    const std::vector<Position> &generated_nodes,
                    const std::vector<Direction> &directions_path_current,
                    const std::vector<Direction> &directions_generated_this_iter);
  void logIteration2(int iteration,
                                  double heuristic_value, double g_cost, double f_cost,
                                  const std::vector<Position> &path_current,
                                  const std::vector<Position> &generated_nodes,
                                  const std::vector<Direction> &directions_path_current,
                                  const std::vector<Direction> &directions_generated_this_iter);

  // Datos miembros
  const Laberinto &laberinto_;
  Position start_;
  Position end_;
  std::ofstream &output_info_;
  int W_;
  double W2_;
};

std::vector<Position> reconstruct_path(const std::map<Position, Position, ComparePosition> &came_from, Position current);
std::vector<Direction> reconstruct_directions(
    const std::map<Position, Position, ComparePosition> &came_from,
    const std::map<Position, Direction, ComparePosition> &direction_taken,
    Position current);

#endif // __ASTAR_H__
