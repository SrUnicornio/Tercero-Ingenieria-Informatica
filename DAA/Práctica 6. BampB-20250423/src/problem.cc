#include <fstream>
#include <iomanip>
#include <sstream>
#include <stdexcept>

#include "../include/problem.h"

Problem::Problem(const std::string& filename, int sub_dimension)
    : sub_dimension_(sub_dimension) {
  loadFromFile(filename);
}

void Problem::loadFromFile(const std::string& filename) {
  std::ifstream file(filename);
  if (!file.is_open()) {
    throw std::runtime_error("Error: file not found.");
  }

  // Read the first line to get the size and dimension
  file >> size_ >> dimension_;

  // Read the elements from the file
  for (int i = 0; i < size_; i++) {
    std::stringstream point_name;
    point_name << "Point_" << std::setw(2) << std::setfill('0') << (i + 1);

    std::vector<double> coordinates;
    for (int j = 0; j < dimension_; j++) {
      std::string number;
      if (!(file >> number)) {
        throw std::runtime_error("Error reading element " + std::to_string(i) +
                                 " dimension " + std::to_string(j));
      }

      // Replace comma with dot if necessary
      if (number.find(',') != std::string::npos) {
        number.replace(number.find(','), 1, ".");
      }

      coordinates.push_back(std::stod(number));
    }

    elements_.emplace_back(point_name.str(), coordinates);
  }

  file.close();

  if (sub_dimension_ <= 0 || sub_dimension_ > elements_.size()) {
    throw std::runtime_error("Invalid sub-dimension: " +
                             std::to_string(sub_dimension_));
  }
}

std::ostream& operator<<(std::ostream& os, const Problem& problem) {
  os << "Problem with " << problem.getSize() << " points of dimension "
     << problem.getDimension() << "\n";
  for (const auto& point : problem.getElements()) {
    os << point.getName() << ": ";
    for (double coord : point.getCoordinates()) {
      os << coord << " ";
    }
    os << "\n";
  }
  return os;
}
