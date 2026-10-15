/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Diseño y Análisis de Algoritmos
 * Práctica 6: Maximum Diversity Problem
 *
 * @file local-search.h
 * @brief Contains the Local Search algorithm for the Maximum Diversity Problem
 *
 * @author 
 * @date 24 APR 2025
 */

#ifndef LOCAL_SEARCH_H_
#define LOCAL_SEARCH_H_

#include "algorithm.h"

/**
 * @class LocalSearch
 * @brief Local Search algorithm for the Maximum Diversity Problem
 */
class LocalSearch : public Algorithm {
 public:
  explicit LocalSearch(int max_iterations) : max_iterations_(max_iterations) {}

  Solution Run(const Problem& problem) override;

 private:
  int max_iterations_;
};

#endif  // LOCAL_SEARCH_H_
