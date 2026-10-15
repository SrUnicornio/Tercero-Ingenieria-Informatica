/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file transportRouteBuilder.cc
 * @brief Implementation of the TransportRouteBuilder class
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#include <algorithm>
#include <map>
#include <numeric>

#include "../includes/transportRouteBuilder.h"

int TransportRouteBuilder::select_best_vehicle(
    const std::vector<TransportRoute>& vehicles, const TransportTask& task,
    const ProblemInstance& instance) {
  const auto& params = instance.parameters();
  const auto& distances = instance.distances();
  const size_t num_zones = instance.CollectionZones().size();

  int best_vehicle = -1;
  double best_insertion_cost = std::numeric_limits<double>::max();

  for (size_t i = 0; i < vehicles.size(); ++i) {
    const auto& vehicle = vehicles[i];

    // Get last stop and arrival time
    int last_stop = vehicle.path.back();
    double last_arrival = vehicle.total_time;

    // Calculate insertion cost (time to reach SWTS from last stop)
    double travel_time = distance_calculator_->get_distance(
                             last_stop, task.swts_id, distances, num_zones) /
                         params.transport_vehicle.speed() * 60;

    // Check conditions (a)-(c):
    // (a) Time window: vehicle can arrive before task's arrival time
    // (b) Capacity constraint
    // (c) Total route duration constraint
    if (travel_time <= (task.arrival_time - last_arrival) &&
        (vehicle.total_waste + task.waste_amount <=
         params.transport_vehicle.capacity())) {
      // Calculate return time to landfill for duration check
      double return_time = distance_calculator_->get_distance(
                               task.swts_id, -1, distances, num_zones) /
                           params.transport_vehicle.speed() * 60;
      double total_route_time = vehicle.total_time + travel_time + return_time;

      if (total_route_time > params.transport_vehicle.maxDuration()) {
        throw std::runtime_error(
            "Route exceeds maximum time limit. Adjust parameters.");
      }
      // Check if total route time is within vehicle's max duration
      if (total_route_time <= params.transport_vehicle.maxDuration()) {
        // Cost is simply the travel time (could be modified with other factors)
        double insertion_cost = travel_time;

        if (insertion_cost < best_insertion_cost) {
          best_insertion_cost = insertion_cost;
          best_vehicle = i;
        }
      }
    }
  }

  return best_vehicle;
}

void TransportRouteBuilder::build_routes(const ProblemInstance& instance) {
  // Obtener rutas de recolección
  const auto& collection_routes = collection_routes_;
  const auto& params = instance.parameters();
  const auto& distances = instance.distances();
  const size_t num_zones = instance.CollectionZones().size();

  // 1. Extraer tareas y acumular residuos por SWTS
  auto tasks = extract_tasks(collection_routes, instance);
  if (tasks.empty()) {
    throw std::runtime_error(
        "No transport tasks found. Check the collection routes.");
  }

  // Calcular residuos totales por SWTS
  std::map<int, double> swts_waste;
  for (const auto& task : tasks) {
    swts_waste[task.swts_id] += task.waste_amount;
  }

  // 2. Ordenar tareas por tiempo de llegada
  std::sort(tasks.begin(), tasks.end(),
            [](const TransportTask& a, const TransportTask& b) {
              return a.arrival_time < b.arrival_time;
            });

  // 3. Inicializar variables
  std::vector<TransportRoute> transport_routes;
  double min_waste = std::numeric_limits<double>::max();
  for (const auto& task : tasks) {
    if (task.waste_amount < min_waste) {
      min_waste = task.waste_amount;
    }
  }

  // 4. Procesar cada tarea
  for (const auto& task : tasks) {
    bool assigned = false;

    // Usar select_best_vehicle para encontrar vehículo óptimo
    int best_vehicle_idx =
        select_best_vehicle(transport_routes, task, instance);

    if (best_vehicle_idx != -1) {
      auto& route = transport_routes[best_vehicle_idx];
      int last_stop = route.path.back();

      // Si ya estamos en este SWTS, no movemos el vehículo
      if (last_stop == task.swts_id) {
        route.total_waste += task.waste_amount;
        assigned = true;
      } else {
        // Calcular tiempo de viaje (si no estamos ya en el SWTS)
        double travel_time =
            distance_calculator_->get_distance(last_stop, task.swts_id,
                                               distances, num_zones) /
            params.transport_vehicle.speed() * 60;

        // Verificar restricciones
        if (travel_time <= (task.arrival_time - route.total_time) &&
            (route.total_waste + task.waste_amount <=
             params.transport_vehicle.capacity())) {
          route.path.push_back(task.swts_id);
          route.total_distance += distance_calculator_->get_distance(
              route.path[route.path.size() - 2], task.swts_id, distances,
              num_zones);
          route.total_waste += task.waste_amount;
          route.total_time += travel_time;
          assigned = true;
        }
      }

      // Verificar si necesita ir al vertedero
      if (assigned && route.total_waste >=
                          (params.transport_vehicle.capacity() - min_waste)) {
        double dist = distance_calculator_->get_distance(route.path.back(), -1,
                                                         distances, num_zones);
        route.path.push_back(-1);
        route.total_distance += dist;
        route.total_time += dist / params.transport_vehicle.speed() * 60;
      }
    }

    if (!assigned) {
      // Crear nueva ruta de transporte
      TransportRoute new_route;
      new_route.path.push_back(-1);  // Comienza en vertedero

      // Solo mover si no estamos ya en el SWTS destino
      if (-1 != task.swts_id) {
        new_route.path.push_back(task.swts_id);
        new_route.total_distance = distance_calculator_->get_distance(
            -1, task.swts_id, distances, num_zones);
        new_route.total_time =
            new_route.total_distance / params.transport_vehicle.speed() * 60;
      }

      new_route.total_waste = task.waste_amount;
      transport_routes.push_back(new_route);
    }
  }

  // 5. Asegurar que todas las rutas terminan en el vertedero
  for (auto& route : transport_routes) {
    if (route.path.back() != -1) {
      // Solo mover si no estamos ya en el vertedero
      if (route.path.back() != -1) {
        double dist = distance_calculator_->get_distance(route.path.back(), -1,
                                                         distances, num_zones);
        route.path.push_back(-1);
        route.total_distance += dist;
        route.total_time += dist / params.transport_vehicle.speed() * 60;
      }
    }
  }

  // 6. Guardar rutas
  routes_ = std::move(transport_routes);
}

std::vector<TransportRouteBuilder::TransportTask>
TransportRouteBuilder::extract_tasks(
    const std::vector<RouteBuilder::Route>& collection_routes,
    const ProblemInstance& instance) {
  std::vector<TransportTask> tasks;
  const auto& zones = instance.CollectionZones();
  const auto& distances = instance.distances();
  const size_t num_zones = zones.size();
  const double vehicle_speed = instance.parameters().collection_vehicle.speed();

  for (const auto& route : collection_routes) {
    double accumulated_time = 0.0;
    double current_demand = 0.0;

    for (size_t i = 1; i < route.path.size(); i++) {
      int from = route.path[i - 1];
      int to = route.path[i];

      // Calcular distancia y tiempo entre paradas
      double distance =
          distance_calculator_->get_distance(from, to, distances, num_zones);
      double time = distance / vehicle_speed * 60;
      accumulated_time += time;

      // Si llegamos a una SWTS (cualquier ID negativo <= -2), es una tarea de
      // transporte
      if (to <= -2) {
        TransportTask task;
        task.swts_id = to;
        task.arrival_time = accumulated_time;
        task.waste_amount = current_demand;

        tasks.push_back(task);
        current_demand = 0.0;
      } else if (to >= 0) {
        // Es una zona de recolección, sumar a la demanda actual
        current_demand += zones[to].getDemand();
      }
    }
  }

  return tasks;
}

void TransportRouteBuilder::print_report(const ProblemInstance& instance,
                                         std::ostream& os) const {
  const auto& routes = get_routes();
  const auto& params = instance.parameters();

  os << "\n=== Transport Vehicle Routes Report ===\n\n";
  os << "Configuration:\n";
  os << "  Transport Vehicles: " << params.max_vehicles << "\n";
  os << "  Vehicle Capacity: " << params.transport_vehicle.capacity()
            << " kg\n";
  os << "  Max Route Duration: "
            << params.transport_vehicle.maxDuration() / 60.0 << " hours\n";
  os << "  Vehicle Speed: " << params.transport_vehicle.speed()
            << " km/h\n\n";

  os << std::setw(6) << "Route" 
     << std::setw(14) << "SWTS Visits"
     << std::setw(12) << "Distance" 
     << std::setw(12) << "Time"
     << std::setw(16) << "Waste" 
     << std::setw(12) << "Path\n";
  os << std::string(80, '-') << "\n";

  for (size_t i = 0; i < routes.size(); ++i) {
    const auto& route = routes[i];
    int swts_visits =
        std::count_if(route.path.begin(), route.path.end(), [](int stop) {
          return stop <= -2;
        });  // Modificado para contar todas las SWTS

    os << std::setw(6) << i + 1 
       << std::setw(10) << swts_visits
       << std::setw(12) << std::fixed << std::setprecision(2) << route.total_distance << " km" << std::setw(5) << " "
       << std::setw(12) << format_time(route.total_time)
       << std::setw(9) << std::setprecision(0) << route.total_waste << " kg" << std::setw(5) << " ";

    for (int stop : route.path) {
      if (stop == -1)
        os << "L ";
      else if (stop <= -2)  // Para todas las estaciones de transferencia
        os << "T" << (-stop - 1) << " ";
    }
    os << "\n";
  }

  print_statistics(routes, os);
}

void TransportRouteBuilder::print_statistics(
    const std::vector<TransportRoute>& routes,
    std::ostream& os) const {
  // Calculate summary statistics
  double total_distance = 0.0;
  double total_waste = 0.0;
  double total_time = 0.0;
  int total_swts_visits = 0;

  for (const auto& route : routes) {
    total_distance += route.total_distance;
    total_waste += route.total_waste;
    total_time += route.total_time;
    total_swts_visits +=
        std::count_if(route.path.begin(), route.path.end(),
                      [](int stop) { return stop == -2 || stop == -3; });
  }

  os << "\nSummary:\n";
  os << "  Total routes: " << routes.size() << "\n";
  os << "  Total distance: " << total_distance << " km\n";
  os << "  Total waste transported: " << total_waste << " kg\n";
  os << "  Total time: " << format_time(total_time) << "\n";
  os << "  Total SWTS visits: " << total_swts_visits << "\n";
}
