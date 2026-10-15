/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file summaryReporter.h
 * @brief Definition of the SummaryReporter class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */

#ifndef __SUMMARY_REPORTER_H__
#define __SUMMARY_REPORTER_H__

#include <chrono>
#include <iomanip>
#include <map>
#include <string>
#include <vector>

#include "problemInstance.h"
#include "transportRouteBuilder.h"


class SummaryReporter {
 public:
  /**
   * @brief Structure to hold the statistics of an instance
   */
  struct InstanceStats {
    int instance_number;
    int collection_vehicles;
    int transport_vehicles;
    double collection_time;
    double transport_time;
    double total_distance;
    double total_demand;
    double total_waste;
    double execution_time;  // in seconds
  };

  /**
   * @brief Record statistics for a processed instance
   */
  void record_instance(
      const std::vector<RouteBuilder::Route>& collection_routes,
      const std::vector<TransportRouteBuilder::TransportRoute>&
          transport_routes,
      double execution_time);

  /**
   * @brief Generate and print the summary report
   */
  void generate_summary_report(std::ostream& os = std::cout) const;

 private:
  std::vector<InstanceStats> instances_stats_;

  /**
   * @brief Helper function to format time
   */
  std::string format_time(double minutes) const;

  /**
   * @brief Helper function to calculate averages
   */
  static void calculate_averages(
      const std::vector<InstanceStats>& stats, double& avg_collection_vehicles,
      double& avg_transport_vehicles, double& avg_collection_time,
      double& avg_transport_time, double& avg_total_distance,
      double& avg_total_demand, double& avg_total_waste,
      double& avg_execution_time);
};

#endif  // __SUMMARY_REPORTER_H__
