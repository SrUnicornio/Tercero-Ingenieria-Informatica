#ifndef __POINT_H__
#define __POINT_H__

#include <vector>
#include <string>
#include <stdexcept>
#include <cmath>

/**
 * @class Point
 * @brief Represents a point in K-dimensional space
 */
class Point {
 public:
  Point() = default;
  explicit Point(const std::vector<double>& coordinates)
      : coordinates_(coordinates) {}
  Point(const std::string& name, const std::vector<double>& coordinates)
      : name_(name), coordinates_(coordinates) {}

  size_t getDimension() const { return coordinates_.size(); }
  const std::vector<double>& getCoordinates() const { return coordinates_; }
  const std::string& getName() const { return name_; }
  double getCoordinate(size_t index) const { return coordinates_[index]; }

  double distanceTo(const Point& other) const {
    if (coordinates_.size() != other.coordinates_.size()) {
      throw std::runtime_error("Points have different dimensions");
    }
    double sum = 0.0;
    for (size_t i = 0; i < coordinates_.size(); ++i) {
      double diff = coordinates_[i] - other.coordinates_[i];
      sum += diff * diff;
    }
    return std::sqrt(sum);
  }

 private:
  std::string name_;
  std::vector<double> coordinates_;
};

#endif  // __POINT_H__