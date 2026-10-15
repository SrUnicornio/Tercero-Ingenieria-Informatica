/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file grasp.cc
 * @brief Implementation of the GraspConstructor class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#include "../includes/grasp.h"

#include <algorithm>
#include <numeric>

void GraspConstructor::build_routes(const ProblemInstance& instance) {
  const auto& zones = instance.CollectionZones();
  const auto& distances = instance.distances();
  const auto& params = instance.parameters();
  const double vehicle_speed = params.collection_vehicle.speed();
  const double vehicle_capacity = params.collection_vehicle.capacity();
  const double max_route_time = params.collection_vehicle.maxDuration();

  std::vector<Route> routes;
  std::vector<bool> zone_assigned(zones.size(), false);
  int unassigned_zones = zones.size();

  while (unassigned_zones > 0) {
    Route current_route;
    double remaining_capacity = vehicle_capacity;
    double remaining_time = max_route_time;

    while (true) {
      // Find all candidate zones
      int last_stop = current_route.path.back();
      std::vector<CandidateZone> candidates;

      for (size_t i = 0; i < zones.size(); ++i) {
        if (!zone_assigned[i]) {
          double dist = distance_calculator_->get_distance(
              last_stop, static_cast<int>(i), distances, zones.size());
          candidates.push_back(
              {static_cast<int>(i), dist, zones[i].getDemand()});
        }
      }

      if (candidates.empty()) break;

      // Sort candidates by distance (ascending)
      std::sort(candidates.begin(), candidates.end(),
                [](const CandidateZone& a, const CandidateZone& b) {
                  return a.distance < b.distance;
                });

      // Get Limited Restricted Candidate list (LRC)
      auto lrc = get_lrc(candidates);
      if (lrc.empty()) break;

      // Select candidate based on randomness parameter
      const CandidateZone* selected = nullptr;
      if (randomness_ == 0) {
        // Greedy deterministic - always select first candidate
        selected = &lrc[0];
      } else {
        // GRASP random - select random candidate from LRC
        std::uniform_int_distribution<size_t> dist(0, lrc.size() - 1);
        selected = &lrc[dist(rng)];
      }

      // Calculate time to zone, SWTS, and depot
      double time_to_zone = (selected->distance / vehicle_speed) * 60 +
                            zones[selected->zone_id].getTimeRecolection();
      int closest_swts = distance_calculator_->get_closest_swts(
          selected->zone_id, distances, zones.size());
      double time_to_swts =
          (distance_calculator_->get_distance(selected->zone_id, closest_swts,
                                              distances, zones.size()) /
           vehicle_speed) *
          60;
      double time_to_depot = (distance_calculator_->get_distance(
                                  closest_swts, -1, distances, zones.size()) /
                              vehicle_speed) *
                             60;
      double total_time_needed = time_to_zone + time_to_swts + time_to_depot;

      if (total_time_needed > max_route_time) {
        throw std::runtime_error(
            "Route exceeds maximum time limit. Adjust parameters.");
      }

      if (selected->demand <= remaining_capacity &&
          total_time_needed <= remaining_time) {
        current_route.path.push_back(selected->zone_id);
        current_route.total_distance += selected->distance;
        current_route.total_demand += selected->demand;
        current_route.total_time += time_to_zone;
        remaining_capacity -= selected->demand;
        remaining_time -= time_to_zone;
        zone_assigned[selected->zone_id] = true;
        unassigned_zones--;
      } else if (total_time_needed <= remaining_time) {
        closest_swts = distance_calculator_->get_closest_swts(
            last_stop, distances, zones.size());
        double dist_to_swts = distance_calculator_->get_distance(
            last_stop, closest_swts, distances, zones.size());
        double time_to_swts = (dist_to_swts / vehicle_speed) * 60;

        current_route.path.push_back(closest_swts);
        current_route.total_distance += dist_to_swts;
        current_route.total_time += time_to_swts;
        remaining_time -= time_to_swts;
        remaining_capacity = vehicle_capacity;
        current_route.subroutes++;
      } else {
        break;
      }
    }

    // Step 3: Finalize route (Algorithm 1 lines 26-31)
    if (current_route.path.back() != -1) {  // If not already at depot
      // If last stop isn't a SWTS, go to closest SWTS first
      if (current_route.path.back() != -2 && current_route.path.back() != -3) {
        int closest_swts = distance_calculator_->get_closest_swts(
            current_route.path.back(), distances, zones.size());
        double dist_to_swts = distance_calculator_->get_distance(
            current_route.path.back(), closest_swts, distances, zones.size());
        double time_to_swts = (dist_to_swts / vehicle_speed) * 60;

        current_route.path.push_back(closest_swts);
        current_route.total_distance += dist_to_swts;
        current_route.total_time += time_to_swts;
      }
      // Return to depot
      double dist_to_depot = distance_calculator_->get_distance(
          current_route.path.back(), -1, distances, zones.size());
      double time_to_depot = (dist_to_depot / vehicle_speed) * 60;

      current_route.path.push_back(-1);
      current_route.total_distance += dist_to_depot;
      current_route.total_time += time_to_depot;
    }
    
    routes.push_back(current_route);
  }

  routes_ = std::move(routes);
}

std::vector<GraspConstructor::CandidateZone> GraspConstructor::get_lrc(
    const std::vector<CandidateZone>& candidates) const {
  if (candidates.empty()) return {};

  // Calculate threshold: min_dist + α * (max_dist - min_dist)
  // For simplicity, we'll use the lrc_size to get top N candidates
  size_t n = std::min(static_cast<size_t>(lrc_size_), candidates.size());

  std::vector<CandidateZone> lrc(candidates.begin(), candidates.begin() + n);
  return lrc;
}

void GraspConstructor::print_report(const ProblemInstance& instance,
                                    std::ostream& os) const {
  const auto routes = get_routes();

  os << std::setw(6) << "Route" 
     << std::setw(12) << "Zones" 
     << std::setw(12) << "Distance" 
     << std::setw(12) << "Time" 
     << std::setw(14) << "Demand"
     << std::setw(16) << "Subroutes"
     << "  Path\n";
  os << std::string(80, '-') << "\n";

  for (size_t i = 0; i < routes.size(); ++i) {
    const auto& route = routes[i];
    os << std::setw(6) << i + 1 
       << std::setw(12) << route.path.size() - 2 - route.subroutes  // exclude depot and SWTS
       << std::setw(9) << std::fixed << std::setprecision(2) << route.total_distance << " km" << std::setw(3) << " "
       << std::setw(12) << format_time(route.total_time)
       << std::setw(12) << std::setprecision(0) << route.total_demand
       << std::setw(12) << route.subroutes << "  ";

    for (int stop : route.path) {
      if (stop == -1)
        os << "D ";
      else if (stop <= -2)  // Para todas las estaciones de transferencia
        os << "T" << (-stop - 1) << " ";  // T0, T1, T2, etc.
      else
        os << stop + 1 << " ";  // +1 to match input file numbering
    }
    os << "\n";
  }

  print_statistics(routes, os);
}
