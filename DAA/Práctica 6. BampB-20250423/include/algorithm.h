/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Diseño y Análisis de Algoritmos
 * Práctica 6: Maximum Diversity Problem
 *
 * @file algorithm.h
 * @brief Base class for algorithms solving the Maximum Diversity Problem
 *
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 24 APR 2025
 */

#ifndef ALGORITHM_H_
#define ALGORITHM_H_

#include <chrono>

#include "problem.h"
#include "solution.h"

/**
 * @class Algorithm
 * @brief Abstract base class for Maximum Diversity Problem algorithms
 */
class Algorithm {
 public:
  Algorithm() : execution_time_(0) {}
  virtual ~Algorithm() = default;

  virtual Solution Run(const Problem& problem) = 0;
  double getExecutionTime() const { return execution_time_; }

  static double CalculateTotalDistance(const Solution& solution);
  static double CalculateDistanceToCentroid(const Solution& solution);

 protected:
  void startTimer();
  void stopTimer();

  std::chrono::time_point<std::chrono::high_resolution_clock> start_time_;
  double execution_time_;
};

#endif  // ALGORITHM_H_