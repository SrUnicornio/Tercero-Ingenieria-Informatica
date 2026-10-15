#ifndef __GVNS_H__
#define __GVNS_H__

#include "localSearch.h"

class GeneralVariableNeighborhoodSearch : public MultistartSearch {
 public:
  using Route = RouteBuilder::Route;
  using MultistartSearch::MultistartSearch;
  GeneralVariableNeighborhoodSearch(std::unique_ptr<DistanceService> calculator,
                                    int kmax = 5, std::vector<Route> collection_routes = {},
                                    int local_search_iterations = 5)
      : MultistartSearch(std::move(calculator), std::move(collection_routes),
                         local_search_iterations), kmax_(kmax) {}

  std::vector<Route> solve(const ProblemInstance& instance) override;
  
  std::string get_time_string(double time) const {
    int hours = static_cast<int>(time / 60);
    int mins = static_cast<int>(time) % 60;
    int secs = static_cast<int>(time * 60) % 60;

    // Format the time string 00h 00min 00s
    std::ostringstream oss;
    oss << std::setw(2) << std::setfill('0') << hours << "h " << std::setw(2)
        << std::setfill('0') << mins << "min " << std::setw(2)
        << std::setfill('0') << secs << "s";
    return oss.str();
  }

 protected:
  int kmax_;

  // Métodos de perturbación (shake)
  void perturb_by_route_merge(std::vector<Route>& solution, int k,
                              const ProblemInstance& instance);
  void perturb_by_random_swaps(std::vector<Route>& solution, int k,
                               const ProblemInstance& instance);
  void perturb_by_route_split(std::vector<Route>& solution, int k,
                              const ProblemInstance& instance);

  // Helpers
  void repair_solution(std::vector<Route>& solution,
                       const ProblemInstance& instance);

  void update_route_metrics(Route& route, const ProblemInstance& instance);

};

#endif  // __GVNS_H__