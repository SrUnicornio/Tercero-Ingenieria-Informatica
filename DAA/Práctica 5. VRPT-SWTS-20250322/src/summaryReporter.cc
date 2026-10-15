
/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file summaryReporter.cc
 * @brief Implementation of the SummaryReporter class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */ \
#include<algorithm>
#include <numeric>

#include "../includes/summaryReporter.h"

void SummaryReporter::record_instance(
    const std::vector<RouteBuilder::Route>& collection_routes,
    const std::vector<TransportRouteBuilder::TransportRoute>& transport_routes,
    double execution_time) {
  InstanceStats stats;
  stats.instance_number = instances_stats_.size() + 1;
  stats.collection_vehicles = collection_routes.size();
  stats.transport_vehicles = transport_routes.size();
  stats.execution_time = execution_time;

  // Calculate collection stats
  stats.collection_time = 0.0;
  stats.total_distance = 0.0;
  stats.total_demand = 0.0;

  for (const auto& route : collection_routes) {
    stats.collection_time += route.total_time;
    stats.total_distance += route.total_distance;
    stats.total_demand += route.total_demand;
  }

  // Calculate transport stats
  stats.transport_time = 0.0;
  stats.total_waste = 0.0;

  for (const auto& route : transport_routes) {
    stats.transport_time += route.total_time;
    stats.total_distance += route.total_distance;
    stats.total_waste += route.total_waste;
  }

  instances_stats_.push_back(stats);
}

void SummaryReporter::generate_summary_report(
    std::ostream& os) const {
  if (instances_stats_.empty()) {
    os << "\nNo instances processed to generate summary.\n";
    return;
  }

  // Calculate averages
  double avg_collection_vehicles, avg_transport_vehicles;
  double avg_collection_time, avg_transport_time;
  double avg_total_distance, avg_total_demand, avg_total_waste;
  double avg_execution_time;

  calculate_averages(instances_stats_, avg_collection_vehicles,
                     avg_transport_vehicles, avg_collection_time,
                     avg_transport_time, avg_total_distance, avg_total_demand,
                     avg_total_waste, avg_execution_time);

  // Print summary report
  os << "\n=============================================\n";
  os << "          RESUMEN GENERAL DE EJECUCIÓN\n";
  os << "=============================================\n\n";

  os << "Número total de instancias procesadas: "
            << instances_stats_.size() << "\n\n";

  os << "FASE DE RECOLECCIÓN:\n";
  os << "---------------------------------------------\n";
  os << std::left << std::setw(36) << "Vehículos promedio:" << std::fixed
            << std::setprecision(2) << avg_collection_vehicles << "\n";
  os << std::left << std::setw(35)
            << "Tiempo promedio:" << format_time(avg_collection_time) << "\n";
  os << std::left << std::setw(35)
            << "Demanda promedio recolectada:" << avg_total_demand
            << " unidades\n";
  os << std::left << std::setw(35)
            << "Distancia promedio recorrida:" << avg_total_distance
            << " km\n\n";

  os << "FASE DE TRANSPORTE:\n";
  os << "---------------------------------------------\n";
  os << std::left << std::setw(36)
            << "Vehículos promedio:" << avg_transport_vehicles << "\n";
  os << std::left << std::setw(35)
            << "Tiempo promedio:" << format_time(avg_transport_time) << "\n";
  os << std::left << std::setw(35)
            << "Residuos promedio transportados:" << avg_total_waste
            << " kg\n\n";

  os << "GLOBAL:\n";
  os << "---------------------------------------------\n";
  os << std::left << std::setw(35)
            << "Tiempo promedio de ejecución:" << std::setprecision(4)
            << avg_execution_time << " segundos\n";
  os << "=============================================\n";
}

std::string SummaryReporter::format_time(double minutes) const {
  int hours = static_cast<int>(minutes) / 60;
  int mins = static_cast<int>(minutes) % 60;
  int secs = static_cast<int>(minutes * 60) % 60;

  // Format the time string 00h 00min 00s
  std::ostringstream oss;
  oss << std::setw(2) << std::setfill('0') << hours << "h " << std::setw(2)
      << std::setfill('0') << mins << "min " << std::setw(2)
      << std::setfill('0') << secs << "s";
  return oss.str();
}

void SummaryReporter::calculate_averages(
    const std::vector<InstanceStats>& stats, double& avg_collection_vehicles,
    double& avg_transport_vehicles, double& avg_collection_time,
    double& avg_transport_time, double& avg_total_distance,
    double& avg_total_demand, double& avg_total_waste,
    double& avg_execution_time) {
  avg_collection_vehicles = 0.0;
  avg_transport_vehicles = 0.0;
  avg_collection_time = 0.0;
  avg_transport_time = 0.0;
  avg_total_distance = 0.0;
  avg_total_demand = 0.0;
  avg_total_waste = 0.0;
  avg_execution_time = 0.0;

  for (const auto& stat : stats) {
    avg_collection_vehicles += stat.collection_vehicles;
    avg_transport_vehicles += stat.transport_vehicles;
    avg_collection_time += stat.collection_time;
    avg_transport_time += stat.transport_time;
    avg_total_distance += stat.total_distance;
    avg_total_demand += stat.total_demand;
    avg_total_waste += stat.total_waste;
    avg_execution_time += stat.execution_time;
  }

  size_t count = stats.size();
  avg_collection_vehicles /= count;
  avg_transport_vehicles /= count;
  avg_collection_time /= count;
  avg_transport_time /= count;
  avg_total_distance /= count;
  avg_total_demand /= count;
  avg_total_waste /= count;
  avg_execution_time /= count;
}
