#ifndef __BBNODE_H__
#define __BBNODE_H__

#include <vector>

#include "point.h"

class BBNode {
 public:
  BBNode() : level(0), total_distance(0.0), bound(0.0) {}
  BBNode(size_t level, const std::vector<bool>& included, double total_distance,
         double bound)
      : level(level),
        included(included),
        total_distance(total_distance),
        bound(bound) {}

  size_t level;
  std::vector<bool> included;  // Indica qué puntos están incluidos
  double total_distance;       // Diversidad acumulada
  double bound;                // Cota superior
};

#endif  // __BBNODE_H__