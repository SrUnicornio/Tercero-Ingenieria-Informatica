/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Inteligencia Artificial
 * Curso: 3º
 * Práctica 2: Búsqueda A*
 * Autor: Álvaro Pérez Ramos
 * Correo: alu010157.04042@ull.edu.es
 * Fecha: 18/09/2024
 * Archivo astar.cc: Desarrollo de los métodos de la clase y funciones de la clase AStarSolver
 */
#include "astar.h"
#include "heuristic.h"
#include <algorithm>
#include <cstdlib>
#include <iomanip> // Para std::setw y std::left
#include <iostream>
#include <random> // Añadido para generación de números aleatorios

/**
 * @brief Método para obtener las direcciones posibles
 * @return Vector de estructuras DirectionInfo que contienen la dirección, el desplazamiento y el coste asociado
 */
std::vector<DirectionInfo2> AStarSolver::getPossibleDirections2() const
{
  return {
      {Direction::NW, {-1, -1}, 7.0}, // Arriba-Izquierda
      {Direction::N, {-1, 0}, 5.0},   // Arriba
      {Direction::NE, {-1, 1}, 7.0},  // Arriba-Derecha
      {Direction::S, {1, 0}, 5.0},    // Abajo
      {Direction::SW, {1, -1}, 7.0},  // Abajo-Izquierda
      {Direction::W, {0, -1}, 5.0},   // Izquierda
      {Direction::SE, {1, 1}, 7.0},   // Abajo-Derecha
      {Direction::E, {0, 1}, 5.0}     // Derecha
  };
}

/**
 * @brief Registra la información de la iteración actual del algoritmo A*
 * @param iteration Número de la iteración actual
 * @param heuristic_value Valor de la heurística h(n) para el nodo actual
 * @param g_cost Costo acumulado g(n) hasta el nodo actual
 * @param f_cost Valor de f(n) = g(n) + h(n) para el nodo actual
 * @param path_current Camino actual desde el inicio hasta el nodo actual
 * @param generated_nodes Nodos generados en la iteración actual
 * @param directions_path_current Direcciones tomadas en el camino actual
 * @param directions_generated_this_iter Direcciones generadas en la iteración actual
 */
void AStarSolver::logIteration2(int iteration,
                               double heuristic_value, double g_cost, double f_cost,
                               const std::vector<Position> &path_current,
                               const std::vector<Position> &generated_nodes,
                               const std::vector<Direction> &directions_path_current,
                               const std::vector<Direction> &directions_generated_this_iter)
{
  output_info_ << "\nIteración: " << iteration << std::endl;
  output_info_ << "h(n): " << heuristic_value;
  output_info_ << "\tg(n) = " << g_cost;
  output_info_ << "\tf(n) = " << f_cost << std::endl;

  output_info_ << "Camino actual: Inicio ";
  // Escribir las direcciones al archivo de iteración
  for (const auto &dir : directions_path_current)
  {
    output_info_ << directionToString(dir) << " ";
  }
  output_info_ << std::endl;

  // Escribir las direcciones generadas en Laberinto_info.txt
  output_info_ << "Direcciones generadas en esta iteración: ";
  if (!directions_generated_this_iter.empty())
  {
    for (const auto &dir : directions_generated_this_iter)
    {
      output_info_ << directionToString(dir) << " ";
    }
  }
  else
  {
    output_info_ << "Ninguna";
  }
  output_info_ << std::endl;
  // Crear una copia del laberinto para marcar el camino y los nodos generados
  laberinto_.printLaberinto(output_info_, path_current, generated_nodes);
}

/**
 * @brief Método principal para ejecutar el algoritmo A*
 * @param path Vector que almacenará el camino encontrado desde el inicio hasta el fin
 * @param directions_path Vector que almacenará las direcciones tomadas en el camino
 */
void AStarSolver::solve2(std::vector<Position> &path, std::vector<Direction> &directions_path)
{
  // Definir las direcciones posibles
  std::vector<DirectionInfo2> directions = getPossibleDirections2();

  // Usar vector en lugar de priority_queue para la lista abierta
  std::vector<Node2> open_list;
  std::map<Position, Position, ComparePosition> came_from;        // Mapea cada nodo al nodo de donde vino
  std::map<Position, int, ComparePosition> g_cost;                // Costo acumulado hasta cada nodo
  std::map<Position, bool, ComparePosition> closed_set;           // Lista cerrada (usando bool para eficiencia)
  std::map<Position, Direction, ComparePosition> direction_taken; // Dirección tomada para llegar a cada nodo

  // Inicializar el nodo de inicio
  double initial_heuristic = heuristicEuclidean(start_, end_, W2_);
  open_list.emplace_back(Node2{start_, 0.0, initial_heuristic});
  came_from[start_] = start_;
  g_cost[start_] = 0.0;
  // No hay dirección tomada para el nodo de inicio
  // direction_taken[start_] remains undefined
  bool foundEnd = false;
  int iteration = 1;

  // Inicializar generador de números aleatorios
  std::random_device rd;
  std::mt19937 gen(rd());

  while (!open_list.empty() && !foundEnd)
  {
    // Ordenar la lista abierta por f_cost en orden ascendente
    std::sort(open_list.begin(), open_list.end(),
              [](const Node2 &a, const Node2 &b) -> bool
              {
                return a.f < b.f;
              });

    // Determinar cuántos nodos considerar (hasta 3)
    int nodes_to_consider = std::min(3, static_cast<int>(open_list.size()));

    // Extraer los primeros tres nodos con los mejores f_cost
    std::vector<Node2> top_nodes(open_list.begin(), open_list.begin() + nodes_to_consider);

    // Seleccionar uno de los tres nodos de manera aleatoria
    std::uniform_int_distribution<> dist(0, top_nodes.size() - 1);
    int selected_index = dist(gen);
    Node2 current_node = top_nodes[selected_index];
    Position current = current_node.pos;

    // Eliminar el nodo seleccionado de la lista abierta
    auto it = std::find_if(open_list.begin(), open_list.end(),
                           [&](const Node2 &node)
                           { return node.pos == current; });
    if (it != open_list.end())
    {
      open_list.erase(it);
    }

    // Saltar si el nodo ya ha sido procesado
    if (closed_set.find(current) != closed_set.end())
    {
      continue;
    }

    // Registrar el nodo actual como inspeccionado
    closed_set[current] = true;

    // Determinar la dirección por la cual se llegó al nodo actual
    std::string inspected_direction;
    if (came_from.at(current) != current)
    {
      inspected_direction = directionToString(direction_taken.at(current));
    }
    else
    {
      inspected_direction = "Inicio"; // Nodo de inicio
    }

    // Reconstruir el camino hasta el nodo actual
    std::vector<Position> path_current = reconstruct_path(came_from, current);
    std::vector<Direction> directions_path_current = reconstruct_directions(came_from, direction_taken, current);

    // Lista de nodos generados en esta iteración (para marcar con 'X')
    std::vector<Position> generated_nodes_this_iter;
    std::vector<Direction> directions_generated_this_iter;

    // Explorar adyacentes
    for (const auto &dir_info : directions)
    {
      Position direction_offset = dir_info.offset;
      int move_cost = static_cast<int>(dir_info.cost);
      Position next = {current.first + direction_offset.first, current.second + direction_offset.second};

      // Verificar límites del laberinto y si es transitable
      if (isTraversable(next))
      {
        double tentative_g = g_cost[current] + move_cost;

        // Si el nodo no ha sido visitado o se encontró un camino con menor costo
        if (g_cost.find(next) == g_cost.end() || tentative_g < g_cost[next])
        {
          g_cost[next] = tentative_g;
          double f_cost = tentative_g + heuristicEuclidean(next, end_, W2_);
          open_list.emplace_back(Node2{next, tentative_g, f_cost});
          came_from[next] = current;
          direction_taken[next] = dir_info.dir; // Registrar la dirección tomada para llegar a 'next'

          // Agregar a la lista de direcciones generadas
          directions_generated_this_iter.emplace_back(dir_info.dir);

          // Agregar a la lista de nodos generados para esta iteración
          // Solo si no es el nodo de inicio o fin
          if (laberinto_.getLaberinto()[next.first][next.second] == 0)
          {
            generated_nodes_this_iter.emplace_back(next);
          }
        }
      }
    }

    // Calcular heurística para el nodo actual
    int current_heuristic = heuristicEuclidean(current, end_, W2_);

    // Loguear información de la iteración
    logIteration(iteration, current_heuristic, g_cost[current], current_node.f,
                 path_current, generated_nodes_this_iter, directions_path_current, directions_generated_this_iter);

    iteration++;

    // Verificar si hemos llegado al final
    if (current == end_)
    {
      path = reconstruct_path(came_from, end_);
      directions_path = reconstruct_directions(came_from, direction_taken, end_);
      foundEnd = true;
      break;
    }
  }

  if (foundEnd)
  {
    output_info_ << "\nCamino encontrado con costo total: " << g_cost[end_] << std::endl;
    std::vector<Position> final_path = reconstruct_path(came_from, end_);
    std::vector<Position> empty_generated; // No hay nodos generados al final
    laberinto_.printLaberinto(output_info_, final_path, empty_generated);

    // Reconstruir las direcciones del camino final
    std::vector<Direction> final_directions = reconstruct_directions(came_from, direction_taken, end_);

    // Escribir el camino final con direcciones
    output_info_ << "Camino final (direcciones): Inicio ";
    for (const auto &dir : final_directions)
    {
      output_info_ << directionToString(dir) << " ";
    }
    output_info_ << std::endl;
  }
  else
  {
    output_info_ << "\nNo se encontró un camino desde el inicio hasta el fin." << std::endl;
  }
}
