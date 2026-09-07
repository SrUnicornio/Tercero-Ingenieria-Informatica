#include "astar.h"
#include <algorithm>

/**
 * @brief Reconstruye el camino desde el inicio hasta el nodo actual utilizando el mapa `came_from`
 * @param came_from Mapa que asocia cada posición con su predecesor
 * @param current Posición actual desde la cual se reconstruirá el camino
 * @return Vector de posiciones que representan el camino desde el inicio hasta `current`
 */
std::vector<Position> reconstruct_path(const std::map<Position, Position, ComparePosition> &came_from, Position current)
{
  std::vector<Position> path;
  while (!(current.first == came_from.at(current).first && current.second == came_from.at(current).second))
  {
    path.push_back(current);
    current = came_from.at(current);
  }
  path.push_back(current); // Añadir el inicio
  std::reverse(path.begin(), path.end());
  return path;
}

/**
 * @brief Reconstruye las direcciones tomadas en el camino desde el inicio hasta el nodo actual
 * @param came_from Mapa que asocia cada posición con su predecesor
 * @param direction_taken Mapa que asocia cada posición con la dirección tomada para llegar a ella
 * @param current Posición actual desde la cual se reconstruirá el camino de direcciones
 * @return Vector de direcciones que representan el camino desde el inicio hasta `current`
 */
std::vector<Direction> reconstruct_directions(
    const std::map<Position, Position, ComparePosition> &came_from,
    const std::map<Position, Direction, ComparePosition> &direction_taken,
    Position current)
{
  std::vector<Direction> directions_path;
  while (!(current.first == came_from.at(current).first && current.second == came_from.at(current).second))
  {
    directions_path.push_back(direction_taken.at(current));
    current = came_from.at(current);
  }
  std::reverse(directions_path.begin(), directions_path.end());
  return directions_path;
}
