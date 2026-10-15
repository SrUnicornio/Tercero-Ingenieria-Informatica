#ifndef __BRANCH_BOUND_H__
#define __BRANCH_BOUND_H__

#include <algorithm>
#include <queue>
#include <vector>

#include "algorithm.h"
#include "greedy.h"

class BranchBound : public Algorithm {
 public:
  Solution Run(const Problem& problem) override;
  size_t getNodesGenerated() const { return nodes_generated_; }  // Nuevo método

 private:
  size_t nodes_generated_ = 0;
  struct Node {
    std::vector<bool> included;
    double current_diversity;
    double upper_bound;
    int level;
    int last_added;

    bool operator<(const Node& other) const {
      // Para maximización: nodos con mayor cota tienen mayor prioridad
      return upper_bound < other.upper_bound;
    }
  };

  double CalculateUpperBound(const Problem& problem, const Node& node) const;
  Solution BuildSolution(const Problem& problem, const Node& node) const;
  double ComputeDiversityContribution(const Problem& problem, int point_idx,
                                      const std::vector<bool>& included) const;
};

#endif  // __BRANCH_BOUND_H__