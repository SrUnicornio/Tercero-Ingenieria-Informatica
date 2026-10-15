/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Diseño y Análisis de Algoritmos
 * Práctica 6: Maximum Diversity Problem
 *
 * @file problem.h
 * @brief Contains the Problem class for the Maximum Diversity Problem
 *
 * @author 
 * @date 24 APR 2025
 */

#ifndef PROBLEM_H_
#define PROBLEM_H_

#include <fstream>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>

#include "point.h"

/**
 * @class Problem
 * @brief Represents an instance of the Maximum Diversity Problem
 */
class Problem {
 public:
  Problem() = default;
  Problem(const std::string& filename, int sub_dimension);

  size_t getSize() const { return elements_.size(); }
  size_t getDimension() const { return dimension_; }
  size_t getSubDimension() const { return sub_dimension_; }
  const std::vector<Point>& getElements() const { return elements_; }
  const Point& getElement(size_t index) const { return elements_[index]; }

  friend std::ostream& operator<<(std::ostream& os, const Problem& problem);

 private:
  void loadFromFile(const std::string& filename);

  std::vector<Point> elements_;
  size_t size_ = 0;
  size_t dimension_ = 0;
  size_t sub_dimension_ = 0;
};

#endif  // PROBLEM_H_
