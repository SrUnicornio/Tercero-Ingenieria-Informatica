/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Diseño y Análisis de Algoritmos
 * Práctica 6: Maximum Diversity Problem
 *
 * @file greedy.h
 * @brief Contains the Greedy algorithm for the Maximum Diversity Problem
 *
 * @author 
 * @date 24 APR 2025
 */

#ifndef GREEDY_H_
#define GREEDY_H_

#include "algorithm.h"

/**
 * @class Greedy
 * @brief Greedy algorithm for the Maximum Diversity Problem
 */
class Greedy : public Algorithm {
 public:
  Solution Run(const Problem& problem) override;
};

#endif  // GREEDY_H_
