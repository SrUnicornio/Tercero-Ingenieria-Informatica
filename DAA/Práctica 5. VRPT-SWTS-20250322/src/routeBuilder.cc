/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file routeBuilder.cc
 * @brief Implementation of the RouteBuilder class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#include "../includes/routeBuilder.h"

void RouteBuilder::print_statistics(const std::vector<Route>& routes,
                                  std::ostream& os) const {
  // Calculate summary statistics
  double total_distance = 0.0;
  double total_demand = 0.0;
  double total_time = 0.0;
  int total_subroutes = 0;

  for (const auto& route : routes) {
    total_distance += route.total_distance;
    total_demand += route.total_demand;
    total_time += route.total_time;
    total_subroutes += route.subroutes;
  }

  os << "\nSummary:\n";
  os << "  Total routes: " << routes.size() << "\n";
  os << "  Total distance: " << total_distance << " km\n";
  os << "  Total demand collected: " << total_demand << " kg\n";
  os << "  Total time: " << format_time(total_time) << "\n";
  os << "  Total subroutes: " << total_subroutes << "\n";
}

std::string RouteBuilder::format_time(double minutes) const {
  int hours = static_cast<int>(minutes) / 60;
  int mins = static_cast<int>(minutes) % 60;
  int secs = static_cast<int>(minutes * 60) % 60;

  // Format the time string 00h 00min 00s
  std::ostringstream oss;
  oss << std::setw(2) << std::setfill('0') << hours << "h "
      << std::setw(2) << std::setfill('0') << mins << "min "
      << std::setw(2) << std::setfill('0') << secs << "s";
  return oss.str();
}