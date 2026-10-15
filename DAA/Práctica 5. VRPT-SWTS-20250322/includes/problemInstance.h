/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file problemInstance.h
 * @brief Definition of the ProblemInstance class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#ifndef __PROBLEM_INSTANCE_H__
#define __PROBLEM_INSTANCE_H__

#include <iostream>
#include <vector>

#include "parameters.h"
#include "collectionZone.h"
/**
 * @brief Distance matrix type
 */
using DistanceMatrix = std::vector<std::vector<double>>;

/**
 * @brief Problem instance data
 */
class ProblemInstance {
 public:
  /**
   * @brief Default constructor for ProblemInstance
   */
  ProblemInstance() = default;
  /**
   * @brief Construct a new Problem Instance object
   * @param params - Problem parameters
   * @param CollectionZones - Collection zones
   */
  ProblemInstance(ProblemParameters params,
                  std::vector<CollectionZone> CollectionZones)
      : params_(std::move(params)), zones_(std::move(CollectionZones)) {
    calculate_distance_matrix();
  }

  /**
   * @brief Get the problem parameters
   * @return const ProblemParameters& - Problem parameters
   * @note This function returns a reference to the problem parameters
   */
  const ProblemParameters& parameters() const noexcept { return params_; }

  /**
   * @brief Get the collection zones
   * @return const std::vector<CollectionZone>& - Collection zones
   * @note This function returns a reference to the collection zones
   */
  const std::vector<CollectionZone>& CollectionZones() const noexcept {
    return zones_;
  }

  /**
   * @brief Get the distance matrix
   * @return const DistanceMatrix& - Distance matrix
   * @note This function returns a reference to the distance matrix
   */
  const DistanceMatrix& distances() const noexcept { return distance_matrix_; }

  /**
   * @brief Print the distance matrix
   * @param os - Output stream
   * @note This function prints the distance matrix to the output stream
   */
  void print_distance_matrix(std::ostream& os = std::cout) const;

 private:
  /**
   * @brief Calculate the distance matrix
   * @note This function calculates the distance matrix using the collection
   * zones
   */
  void calculate_distance_matrix();

  ProblemParameters params_;
  std::vector<CollectionZone> zones_;
  DistanceMatrix distance_matrix_;
};

#endif  // __PROBLEM_INSTANCE_H__
