#include "../include/solution.h"

Solution::Solution(const std::vector<Point>& selected_points)
    : selected_points_(selected_points) {
  for (const auto& point : selected_points_) {
    point_names_.push_back(point.getName());
  }
}

void Solution::addPoint(const Point& point) {
  selected_points_.push_back(point);
  point_names_.push_back(point.getName());
}

std::ostream& operator<<(std::ostream& os, const Solution& solution) {
  os << "Solution with " << solution.size() << " points:\n";
  for (const auto& point : solution.getSelectedPoints()) {
    os << point.getName() << ": ";
    for (double coord : point.getCoordinates()) {
      os << coord << " ";
    }
    os << "\n";
  }
  return os;
}