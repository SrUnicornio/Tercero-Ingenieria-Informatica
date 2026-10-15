/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file mainFunctions.cc
 * @brief Implementation of main functions for the VRPT-SWTS problem
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#include "../includes/mainFunctions.h"

/**
 * @brief Print help message
 */
void print_help(std::ostream& os) {
  os << "Usage:\n"
     << "  ./program -s <input_file> [options]\n\n"
     << "Options:\n"
     << "  -b | --batch  <directory>  Process all files in directory\n"
     << "  -s | --single <input_file> Process a single file\n"
     << "  -h | --help                Show this help message\n\n"
     << "Optional options:\n"
     << "  -o | --output <output_file>   Specify output file for results\n"
     << "  -i | --information  Show detailed information during processing\n";
}

/**
 * @brief Process output stream based on arguments
 */
coutOrFile process_output_stream(int argc, char* argv[]) {
  std::ostream* output_stream = &std::cout;
  std::unique_ptr<std::ofstream> file_stream;

  for (int i = 1; i < argc; ++i) {
    std::string arg = argv[i];
    if (arg == "-o" || arg == "--output") {
      if (i + 1 >= argc) {
        throw std::runtime_error("Error: Missing filename after " + arg);
      }
      file_stream = std::make_unique<std::ofstream>(argv[i + 1]);
      if (!file_stream->is_open()) {
        throw std::runtime_error("Error: Could not open output file: " +
                                 std::string(argv[i + 1]));
      }
      output_stream = file_stream.get();
      break;
    }
  }

  return {output_stream, std::move(file_stream)};
}

/**
 * Print demand report
 * @param zones - Collection zones
 * @param capacity_vehicle - Total capacity of the vehicle
 */
void print_demand_report(const ProblemInstance& instance, std::ostream& os) {
  auto zones = instance.CollectionZones();
  double summary_demand = 0;
  os << "\n=== Collection Vehicle ===\n";
  os << "Max collection time: "
     << instance.parameters().collection_vehicle.maxDuration() << " min\n";
  os << "Vehicle capacity: "
     << instance.parameters().collection_vehicle.capacity() << " kg\n";
  os << "Vehicle speed: " << instance.parameters().collection_vehicle.speed()
     << " km/h\n";

  os << "========================================\n";
  os << "\n=== Transport Vehicle ===\n";
  os << "Max transport time: "
     << instance.parameters().transport_vehicle.maxDuration() << " min\n";
  os << "Vehicle capacity: "
     << instance.parameters().transport_vehicle.capacity() << " kg\n";
  os << "Vehicle speed: " << instance.parameters().transport_vehicle.speed()
     << " km/h\n";
  os << "========================================\n";
  os << "\n=== Collection Zones ===\n";

  // imprimir de a 4 las zonas
  for (size_t i = 0; i < zones.size(); ++i) {
    if (i < 9) {
      os << "Zone 0" << zones[i].getId() << ": " << zones[i].getDemand()
         << " kg";
    } else {
      os << "Zone " << zones[i].getId() << ": " << zones[i].getDemand()
         << " kg";
    }
    if ((i + 1) % 4 == 0) {
      os << "\n";
    } else {
      os << " | ";
    }
    summary_demand += zones[i].getDemand();
  }
  os << "========================================\n";
  os << "Total demand: " << summary_demand << " kg\n";
  os << "Total number of zones: " << zones.size() << "\n";
  os << "========================================\n";
}

/**
 * @brief Extract instance number from filename
 */
int extract_instance_number(const std::string& filename) {
  size_t instance_pos = filename.find("instance");
  if (instance_pos == std::string::npos) return 0;

  size_t dot_pos = filename.find(".", instance_pos);
  if (dot_pos == std::string::npos) return 0;

  std::string number_str =
      filename.substr(instance_pos + 8, dot_pos - (instance_pos + 8));
  try {
    return std::stoi(number_str);
  } catch (...) {
    return 0;
  }
}

GraspResult execute_grasp(const ProblemInstance& instance, std::ostream& os,
                          bool information, bool use_greedy, int lrc) {
  GraspResult best_result;
  best_result.best_routes.clear();
  best_result.best_distance = std::numeric_limits<double>::max();
  best_result.best_time = std::numeric_limits<double>::max();

  os << "\n=== " << (use_greedy ? "Greedy" : "GRASP") << " Routes Report ===\n";

  int iterations = use_greedy ? 1 : DEFAULT_GRASP_ITERATIONS;
  int lrc_size = use_greedy ? 1 : lrc;
  int randomness = use_greedy ? 0 : 1;

  // Vector para almacenar las líneas de la tabla

  ResultTable table(
      {"Iteration", "Trucks", "Subroutes", "Total Time", "Demand", "LRC Size"});

  int noMejora = 0;
  for (int i = 0; i < iterations; ++i) {
    GraspConstructor grasp_builder(std::make_unique<EuclideanDistanceService>(),
                                   lrc_size, randomness);
    grasp_builder.build_routes(instance);
    auto current_routes = grasp_builder.get_routes();
    if (current_routes.empty()) {
      throw std::runtime_error("Error: No routes found");
    }

    TransportRouteBuilder transport_builder(
        std::make_unique<EuclideanDistanceService>(), current_routes);
    transport_builder.build_routes(instance);
    auto transport_routes = transport_builder.get_routes();
    if (transport_routes.empty()) {
      throw std::runtime_error("Error: No transport routes found");
    }

    // Cálculo de métricas
    auto metrics = calculate_metrics(current_routes, transport_routes);

    double total_transport_time = 0.0;
    for (const auto& route : transport_routes) {
      total_transport_time += route.total_time;
    }

    if (metrics.total_distance < best_result.best_distance &&
        metrics.total_time < best_result.best_time) {
      best_result.best_distance = metrics.total_distance;
      best_result.best_time = metrics.total_time;
      best_result.best_routes = current_routes;
      best_result.transport_routes = transport_routes;
      best_result.transport_time_str =
          grasp_builder.get_time_string(total_transport_time);
      best_result.best_time_str =
          grasp_builder.get_time_string(best_result.best_time);
    } else {
      noMejora++;
      if (noMejora > 100) {
        os << "No improvement in the last 100 iterations. Stopping GRASP.\n";
        break;
      }
    }

    // Guardar línea de la tabla para esta iteración (solo GRASP)

    // Añadir a la tabla
    table.add_row({std::to_string(i + 1), std::to_string(current_routes.size()),
                   std::to_string(metrics.subroutes),
                   grasp_builder.get_time_string(metrics.total_time),
                   std::to_string(metrics.total_demand),
                   std::to_string(lrc_size)});

    // Imprimir estadísticas
    if (information) {
      use_greedy
          ? print_greedy_info(grasp_builder, transport_builder, instance, os)
          : print_iteration_info(i, grasp_builder, transport_builder, instance,
                                 os);
    } else {
      os << (use_greedy ? "\nGreedy Routes Report: \n" : "");
      use_greedy ? grasp_builder.print_statistics(current_routes, os) : void();
      os << (use_greedy ? "========================================\n" : "");
      os << (use_greedy ? "Transport Routes Report:\n" : "");
      use_greedy ? transport_builder.print_statistics(transport_routes, os)
                 : void();
    }
  }

  // Imprimir tabla
  if (!use_greedy && information) {
    os << table.to_string();
    os << "\n=========================================\n";
  }

  return best_result;
}

void print_best_grasp_report(const GraspResult& best_grasp, std::ostream& os) {
  os << "\nBest GRASP Routes Report:\n";
  os << "========================================\n";
  os << "Best GRASP Distance: " << best_grasp.best_distance << "\n";
  os << "Best GRASP Time: " << best_grasp.best_time_str << "\n";
  os << "Best GRASP Routes:\n";
  for (const auto& route : best_grasp.best_routes) {
    os << "Route: ";
    for (int stop : route.path) {
      if (stop == -1)
        os << "D ";
      else if (stop <= -2)
        os << "T" << (-stop - 1) << " ";  // T0, T1, T2, etc.
      else
        os << stop + 1 << " ";  // +1 to match input file numbering
    }
    os << "\n";
  }

  // toatal time transport
  int total_demand = 0;
  double total_distance = 0;
  for (const auto& route : best_grasp.transport_routes) {
    total_demand += route.total_waste;
    total_distance += route.total_distance;
  }

  os << "==============================\n";
  os << "Transport Routes Report:\n";
  os << "========================================\n";
  os << "Total time: " << best_grasp.transport_time_str << "\n";
  os << "Total distance: " << total_distance << " km\n";
  os << "Total demand: " << total_demand << " kg\n";
  os << "Total vehicles: " << best_grasp.transport_routes.size() << "\n";
  os << "Total routes: " << best_grasp.transport_routes.size() << "\n";
  os << "Trasnport routes: \n";
  for (const auto& route : best_grasp.transport_routes) {
    os << "Route: ";
    for (int stop : route.path) {
      if (stop == -1)
        os << "L ";
      else if (stop <= -2)
        os << "T" << (-stop - 1) << " ";  // T0, T1, T2, etc.
      else
        os << stop + 1 << " ";  // +1 to match input file numbering
    }
    os << "\n";
  }
  os << "========================================\n";
}

void print_best_local_search_report(
    const std::vector<RouteBuilder::Route>& local_search_result,
    std::ostream& os) {
  // total time y demand
  double total_time = 0;
  int total_demand = 0;
  for (const auto& route : local_search_result) {
    total_time += route.total_time;
    total_demand += route.total_demand;
  }

  os << "\nLocal Search Result:\n";
  os << "========================================\n";
  os << "Total Time: " << std::floor(total_time / 60) << "h "
     << static_cast<int>(total_time) % 60 << " min "
     << static_cast<int>((total_time / 60) * 60) % 60 << " s\n";
  os << "Total Demand: " << total_demand << " kg\n";
  os << "Best Local Search Distance: "
     << local_search_result.back().total_distance << "\n";
  os << "Best Local Search Routes:\n";
  for (const auto& route : local_search_result) {
    os << "Route: ";
    for (int stop : route.path) {
      if (stop == -1)
        os << "D ";
      else if (stop <= -2)
        os << "T" << (-stop - 1) << " ";  // T0, T1, T2, etc.
      else
        os << stop + 1 << " ";  // +1 to match input file numbering
    }
    os << route.total_distance << " km\n";
  }
  os << "========================================\n";
  os << "Local Search Time: "
     << std::floor(local_search_result.back().total_time / 60) << "h "
     << static_cast<int>(local_search_result.back().total_time) % 60
     << " min\n";
  os << "========================================\n";
}

void print_gvns_report(const std::vector<RouteBuilder::Route>& gvns_result,
                       std::ostream& os) {
  // total time y demand
  double total_time = 0;
  int total_demand = 0;
  for (const auto& route : gvns_result) {
    total_time += route.total_time;
    total_demand += route.total_demand;
  }

  os << "\nGVNS Result:\n";
  os << "========================================\n";
  os << "Total Time: " << std::floor(total_time / 60) << "h "
     << static_cast<int>(total_time) % 60 << " min "
     << static_cast<int>((total_time / 60) * 60) % 60 << " s\n";
  os << "Total Demand: " << total_demand << " kg\n";
  os << "Best GVNS Distance: " << gvns_result.back().total_distance << "\n";
  os << "Best GVNS Routes:\n";
  for (const auto& route : gvns_result) {
    os << "Route: ";
    for (int stop : route.path) {
      if (stop == -1)
        os << "D ";
      else if (stop <= -2)
        os << "T" << (-stop - 1) << " ";  // T0, T1, T2, etc.
      else
        os << stop + 1 << " ";  // +1 to match input file numbering
    }
    os << route.total_distance << " km\n";
  }
}

void process_instance(const ProblemInstance& instance,
                      const std::string& filename, SummaryReporter& reporter,
                      std::ostream& os, bool information,
                      ResultTable& greedy_table, ResultTable& grasp_table,
                      ResultTable& gvns_table) {
  auto instance_start = std::chrono::high_resolution_clock::now();

  os << "\n========================================\n";
  os << "\nProcessing file: " << filename << "\n";
  os << "========================================\n";

  print_demand_report(instance, os);

  int instance_num = extract_instance_number(filename);
  std::string prefix = "map_data" + std::to_string(instance_num);
  DataVisualizer::generate_map_data(instance, prefix);

  if (information) {
    os << "\n========================================\n";
    os << "Distance Matrix:\n";
    instance.print_distance_matrix(os);
    os << "========================================\n";
  }

  // Procesamiento Greedy
  auto greedy_start = std::chrono::steady_clock::now();
  auto greedy_result = execute_grasp(instance, os, information, true);
  auto greedy_end = std::chrono::steady_clock::now();
  auto greedy_time = std::chrono::duration_cast<std::chrono::microseconds>(
                         greedy_end - greedy_start)
                         .count();
  os << "Greedy Execution Time: " << greedy_time << " microseconds\n";
  os << "========================================\n";

  if (!greedy_table.is_empty()) {
    int total_demand = 0;
    for (const auto& route : greedy_result.best_routes) {
      total_demand += route.total_demand;
    }
    greedy_table.add_row(
        {std::to_string(instance_num),
         std::to_string(instance.CollectionZones().size()),
         std::to_string(greedy_result.best_routes.size()),
         std::to_string(greedy_result.transport_routes.size()),
         greedy_result.best_time_str, greedy_result.transport_time_str,
         std::to_string(greedy_result.best_distance),
         std::to_string(total_demand), std::to_string(greedy_time)});
  }

  std::string prefix2 = "map_data_solve_greedy" + std::to_string(instance_num);
  DataVisualizer::generate_map_data_solution(instance, prefix2,
                                             greedy_result.best_routes,
                                             greedy_result.transport_routes);

  // Procesamiento GRASP
  std::vector<GraspResult> grasp_results;
  for (size_t lrc_index = 0; lrc_index < DEFAULT_LRC_SIZE.size(); ++lrc_index) {
    int lrc_size = DEFAULT_LRC_SIZE[lrc_index];

    for (int execution = 1; execution <= 3; ++execution) {
      auto grasp_start = std::chrono::steady_clock::now();
      auto best_grasp =
          execute_grasp(instance, os, information, false, lrc_size);
      if (best_grasp.best_routes.empty()) {
        throw std::runtime_error("Error: No routes found in GRASP");
      }
      auto grasp_end = std::chrono::steady_clock::now();
      auto grasp_time = std::chrono::duration_cast<std::chrono::microseconds>(
                            grasp_end - grasp_start)
                            .count();

      os << "GRASP Execution Time: " << grasp_time << " microseconds\n";
      print_best_grasp_report(best_grasp, os);

      if (!grasp_table.is_empty()) {
        int total_demand = 0;
        for (const auto& route : best_grasp.best_routes) {
          total_demand += route.total_demand;
        }

        grasp_table.add_row(
            {std::to_string(instance_num),
             std::to_string(instance.CollectionZones().size()),
             std::to_string(lrc_size),
             std::to_string(execution),  // Número de ejecución (1, 2, 3)
             std::to_string(best_grasp.best_routes.size()),
             std::to_string(best_grasp.transport_routes.size()),
             best_grasp.best_time_str, best_grasp.transport_time_str,
             std::to_string(best_grasp.best_distance),
             std::to_string(total_demand), std::to_string(grasp_time)});
      }
      grasp_results.push_back(best_grasp);

      std::string prefix3 = "map_data_solve_grasp" +
                            std::to_string(instance_num) + "_" +
                            std::to_string(lrc_size) + "_" +
                            std::to_string(execution);
      DataVisualizer::generate_map_data_solution(
          instance, prefix3, best_grasp.best_routes,
          best_grasp.transport_routes);
    }
  }

  for (const auto& best_grasp : grasp_results) {
    // Búsqueda local
    auto local_search_start = std::chrono::steady_clock::now();
    MultistartSearch local_search(std::make_unique<EuclideanDistanceService>(),
                                  best_grasp.best_routes,
                                  DEFAULT_GRASP_ITERATIONS);
    auto local_search_result = local_search.solve(instance);
    if (local_search_result.empty()) {
      throw std::runtime_error("Error: No routes found in Local Search");
    }
    auto local_search_end = std::chrono::steady_clock::now();
    auto local_search_time =
        std::chrono::duration_cast<std::chrono::microseconds>(
            local_search_end - local_search_start)
            .count();
            print_best_local_search_report(local_search_result, os);
    os << "Local Search Execution Time: " << local_search_time
       << " microseconds\n";
    os << "========================================\n";
  }

  // Procesamiento GVNS
  bool visualizate = true;
  for (size_t i = 0; i < DEFAULT_KMAX_SIZE.size(); ++i) {
    int kmax = DEFAULT_KMAX_SIZE[i];
    
    for (int execution = 1; execution <= 3; ++execution) {          
      GeneralVariableNeighborhoodSearch gvns(
          std::make_unique<EuclideanDistanceService>(), kmax,
          greedy_result.best_routes, DEFAULT_GRASP_ITERATIONS);
      auto gvns_start = std::chrono::steady_clock::now();
      auto gvns_result = gvns.solve(instance);
      if (gvns_result.empty()) {
        throw std::runtime_error("Error: No routes found in GVNS");
      }
      auto gvns_end = std::chrono::steady_clock::now();
      auto gvns_time = std::chrono::duration_cast<std::chrono::microseconds>(
                          gvns_end - gvns_start)
                          .count();
      print_gvns_report(gvns_result, os);
      os << "GVNS Execution Time: " << gvns_time << " microseconds\n";
      os << "========================================\n";

      if (!gvns_table.is_empty()) {
        int total_demand = 0;
        double total_time = 0;
        double total_distance = 0;
        for (const auto& route : gvns_result) {
          total_demand += route.total_demand;
          total_time += route.total_time;
          total_distance += route.total_distance;
        }

        gvns_table.add_row(
            {std::to_string(instance_num),
             std::to_string(instance.CollectionZones().size()),
             std::to_string(kmax),
             std::to_string(execution),  // Número de ejecución (1, 2, 3)
             std::to_string(gvns_result.size()),
             std::to_string(greedy_result.transport_routes.size()),
             gvns.get_time_string(total_time), greedy_result.transport_time_str,
             std::to_string(total_distance), std::to_string(total_demand),
             std::to_string(gvns_time)});
      }

      if (visualizate) {
        std::string prefix5 = "map_data_solve_gvns" +
                              std::to_string(instance_num) + "_" +
                              std::to_string(kmax) + "_" +
                              std::to_string(execution);
        DataVisualizer::generate_map_data_solution(
            instance, prefix5, gvns_result,
            greedy_result.transport_routes);
        visualizate = false;
      }
    }
  }
  
  auto instance_end = std::chrono::high_resolution_clock::now();
  double instance_time =
      std::chrono::duration<double>(instance_end - instance_start).count();

  reporter.record_instance(greedy_result.best_routes,
                           greedy_result.transport_routes, instance_time);
}

void process_batch(const std::string& directory, SummaryReporter& reporter,
                   std::ostream& os, bool information) {
  std::vector<std::string> filenames;
  auto instances = ProblemReader::read_from_directory(directory, filenames);

  ResultTable greedy_table({"Instance", "Zones", "CV", "TV", "Collection Time",
                            "Transport Time", "Total Distance", "Total Demand",
                            "Execution Time (μs)"});

  ResultTable grasp_table({"Instance", "Zones", "[LRC]", "Ejecution", "CV",
                           "TV", "Collection Time", "Transport Time",
                           "Total Distance", "Total Demand",
                           "Execution Time (μs)"});

  ResultTable gvns_table({"Instance", "Zones", "kmax", "Ejecution", "CV", "TV",
                          "Collection Time", "Transport Time", "Total Distance",
                          "Total Demand", "Execution Time (μs)"});
  for (size_t i = 0; i < instances.size(); ++i) {
    process_instance(instances[i], filenames[i], reporter, os, information,
                     greedy_table, grasp_table, gvns_table);
  }

  os << "Greedy Routes Table:\n";
  os << "\n========================================\n";
  os << greedy_table.to_string();
  os << "\n========================================\n";

  os << "GRASP Routes Table:\n";
  os << "\n========================================\n";
  os << grasp_table.to_string();
  os << "\n========================================\n";

  os << "GVNS Routes Table:\n";
  os << "\n========================================\n";
  os << gvns_table.to_string();
  os << "\n========================================\n";
}

void process_single_file(const std::string& filename, SummaryReporter& reporter,
                         std::ostream& os, bool information) {
  auto instance = ProblemReader::read_from_file(filename);
  ResultTable dummy_table({});
  process_instance(instance, filename, reporter, os, information, dummy_table,
                   dummy_table, dummy_table);
}

program_options process_arguments(int argc, char* argv[]) {
  program_options options;

  if (argc < 2) {
    options.help = true;
    throw std::runtime_error("Error: No input file specified");
  }

  for (int i = 1; i < argc; ++i) {
    std::string arg = argv[i];
    if (arg == "--batch" || arg == "-b") {
      options.batch_mode = true;
      if (i + 1 < argc) {
        options.batch_directory = argv[++i];
      } else {
        throw std::runtime_error("Error: Missing directory after " + arg);
      }
    } else if (arg == "--output" || arg == "-o") {
      if (i + 1 < argc) {
        options.output_file = argv[++i];
      } else {
        throw std::runtime_error("Error: Missing filename after " + arg);
      }
    } else if (arg == "--single" || arg == "-s") {
      options.single_file_mode = true;
      if (i + 1 < argc) {
        options.input_file = argv[++i];
      } else {
        throw std::runtime_error("Error: Missing filename after " + arg);
      }
    } else if (arg == "--help" || arg == "-h") {
      options.help = true;
    } else if (arg == "--information" || arg == "-i") {
      options.information = true;
    } else {
      throw std::runtime_error("Error: Unknown argument: " + arg);
    }
  }

  if (options.batch_mode && options.single_file_mode) {
    throw std::runtime_error(
        "Error: Cannot use both batch and single file mode");
  }

  return options;
}
