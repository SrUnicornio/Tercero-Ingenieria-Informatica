/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Diseño y Análisis de Algoritmos
 * Práctica 6: Maximum Diversity Problem
 *
 * @file grasp.h
 * @brief Contains the GRASP algorithm for the Maximum Diversity Problem
 *
 * @author 
 * @date 24 APR 2025
 */

#ifndef GRASP_H_
#define GRASP_H_

#include <random>

#include "algorithm.h"

/**
 * @class GRASP
 * @brief GRASP algorithm for the Maximum Diversity Problem
 */
class GRASP : public Algorithm {
 public:
  GRASP(int lrc_size, int max_iterations)
      : lrc_size_(lrc_size), max_iterations_(max_iterations) {}

  Solution Run(const Problem& problem) override;

 private:
  Solution ConstructivePhase(const Problem& problem);

  int lrc_size_;
  int max_iterations_;
  std::mt19937 rng_{std::random_device{}()};
};

#endif  // GRASP_H_
