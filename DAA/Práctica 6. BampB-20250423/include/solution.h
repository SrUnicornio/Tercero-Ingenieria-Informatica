/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Diseño y Análisis de Algoritmos
 * Práctica 6: Maximum Diversity Problem
 *
 * @file solution.h
 * @brief Contains the Solution class for the Maximum Diversity Problem
 *
 * @author 
 * @date 24 APR 2025
 */

#ifndef SOLUTION_H_
#define SOLUTION_H_

#include <string>
#include <vector>

#include "point.h"
#include "problem.h"

/**
 * @class Solution
 * @brief Represents a solution to the Maximum Diversity Problem
 */
class Solution {
 public:
  Solution() = default;
  explicit Solution(const std::vector<Point>& selected_points);

  void addPoint(const Point& point);
  const std::vector<Point>& getSelectedPoints() const {
    return selected_points_;
  }

  std::vector<Point>& getSelectedPoints() { return selected_points_; }
  const std::vector<std::string>& getPointNames() const { return point_names_; }
  size_t size() const { return selected_points_.size(); }

  friend std::ostream& operator<<(std::ostream& os, const Solution& solution);

 private:
  std::vector<Point> selected_points_;
  std::vector<std::string> point_names_;
};

/**
 * @brief Overloads the << operator to print the solution.
 * @param os The output stream to print the solution to.
 * @param solution The solution to be printed.
 * @return The output stream.
 */
std::ostream& operator<<(std::ostream& os, const Solution& solution);

#endif  // SOLUTION_H_