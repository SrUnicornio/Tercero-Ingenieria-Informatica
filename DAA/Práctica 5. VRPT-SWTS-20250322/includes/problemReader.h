/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file problemReader.h
 * @brief Definition of the ProblemReader class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
// problemReader.h
#ifndef __PROBLEM_READER_H__
#define __PROBLEM_READER_H__

#include <fstream>
#include <iostream>
#include <string>
#include <vector>

#include "parameters.h"
#include "problemInstance.h"

/**
 * @brief File reader utility class
 */
class ProblemReader {
 public:
  /**
   * @brief Read a problem instance from a file
   * @param filename - Name of the file to read
   * @return ProblemInstance - Problem instance read from the file
   */
  static ProblemInstance read_from_file(const std::string& filename);

  /**
   * @brief Read multiple problem instances from a directory
   * @param dir - Directory containing the problem files
   * @return std::vector<ProblemInstance> - Vector of problem instances read
   * from the directory
   */
  static std::vector<ProblemInstance> read_from_directory(
      const std::string& dir, std::vector<std::string>& filenames);

 private:
  /**
   * @brief Read parameters from a file
   * @param file - Input file stream
   * @return ProblemParameters - Problem parameters read from the file
   */
  static ProblemParameters read_parameters(std::ifstream& file);

  /**
   * @brief Read tolerances from a file
   * @param file - Input file stream
   * @return Tolerances - Tolerances read from the file
   */
  static Tolerances read_tolerances(std::ifstream& file);

  /**
   * @brief Read collection zones from a file
   * @param file - Input file stream
   * @return std::vector<CollectionZone> - Vector of collection zones read from
   * the file
   */
  static std::vector<CollectionZone> read_zones(std::ifstream& file);
};

#endif  // __PROBLEM_READER_H__
