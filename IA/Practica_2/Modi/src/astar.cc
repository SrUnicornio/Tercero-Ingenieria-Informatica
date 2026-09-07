#include "astar.h"
/**
 * @brief Obtiene las casillas vecinas transitables desde la posición actual
 * @param current Posición actual en el laberinto
 * @return Vector de posiciones vecinas transitables
 */
std::vector<Position> AStarSolver::getNeighbors(const Position &current) const
{
  std::vector<Position> neighbors;
  for (const auto &dir_info : getPossibleDirections())
  {
    Position next = {current.first + dir_info.offset.first, current.second + dir_info.offset.second};
    if (isTraversable(next))
    {
      neighbors.emplace_back(next);
    }
  }
  return neighbors;
}

/**
 * @brief Verifica si una posición es transitable dentro del laberinto
 * @param pos Posición a verificar
 * @return true si la posición es transitable, false en caso contrario
 */
bool AStarSolver::isTraversable(const Position &pos) const
{
  if (pos.first < 0 || pos.first >= laberinto_.getRows() ||
      pos.second < 0 || pos.second >= laberinto_.getCols())
  {
    return false;
  }
  int cell = laberinto_.getLaberinto()[pos.first][pos.second];
  return (cell == 0 || cell == 4);
}