/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file dataVisualizer.h
 * @brief Definition of the DataVisualizer class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#ifndef __DATA_VISUALIZER_H__
#define __DATA_VISUALIZER_H__

#include <iostream>
#include <string>

#include "problemInstance.h"
#include "routeBuilder.h"
#include "transportRouteBuilder.h"

/**
 * @brief Data visualization generator
 */
class DataVisualizer {
 public:
  /**
   * @brief Generate map data for the problem instance
   * @param instance - Problem instance to generate data for
   * @param filename_prefix - Prefix for the output files
   */
  static void generate_map_data(
      const ProblemInstance& instance,
      const std::string& filename_prefix = "map_data");

  /**
   * @brief Generate map data solution for the problem instance
   * @param instance - Problem instance to generate data for
   * @param filename_prefix - Prefix for the output files
   * @param routes - Routes to visualize
   * 
   */
    static void generate_map_data_solution(
        const ProblemInstance& instance,
        const std::string& filename_prefix = "map_data_solution",
        const std::vector<RouteBuilder::Route>& routes = {},
        const std::vector<TransportRouteBuilder::TransportRoute>& transport_routes = {});
};

#endif  // __DATA_VISUALIZER_H__
