/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Curso: 3º
 * Diseño y Análisis de Algoritmos
 * Práctica 5: VRPT-SWTS
 *
 * @file vehicle.h
 * @brief Definition of the Vehicle class and its derived classes
 * @author Álvaro Pérez Ramos - alu0101574042@ull.edu.es
 * @date 22/03/2025
 */
#ifndef __VEHICLE_H__
#define __VEHICLE_H__

#include <string>

/**
 * @brief Abstrac class to represent vehicles
 */
class Vehicle {
 public:
  /**
   * @brief Default constructor for Vehicle
   */
  Vehicle() = default;
  /**
   * @brief Construct a new Vehicle object
   * @param maxDuration - Maximum duration of the vehicle on the road
   * @param capacity - Capacity of the vehicle
   * @param speed - Speed of the vehicle
   */
  Vehicle(int maxDuration, int capacity, int speed)
      : maxDuration_(maxDuration), capacity_(capacity), speed_(speed) {}

  /**
   * @brief Get the maximum duration of the vehicle
   * @return int - Maximum duration of the vehicle
   */
  int maxDuration() const { return maxDuration_; }

  /**
   * @brief Get the capacity of the vehicle
   * @return int - Capacity of the vehicle
   */
  int capacity() const { return capacity_; }

  /**
   * @brief Get the speed of the vehicle
   * @return int - Speed of the vehicle
   */
  int speed() const { return speed_; }

  /**
   * @brief Get the type of the vehicle
   * @return std::string - Type of the vehicle
   */
  virtual std::string type() const = 0;

 private:
  int maxDuration_;
  int capacity_;
  int speed_;
};

/**
 * @brief Class to represent Collection vehicles
 */
class CollectionVehicles : public Vehicle {
 public:
  /**
   * @brief Default constructor for CollectionVehicles
   */
  CollectionVehicles() = default;

  /**
   * @brief Construct a new Collection Vehicles object
   * @param maxDuration - Maximum duration of the vehicle on the road
   * @param capacity - Capacity of the Collection vehicle (CV)
   * @param speed - Speed of the Collection vehicle (CV)
   */
  CollectionVehicles(int maxDuration, int capacity, int speed)
      : Vehicle(maxDuration, capacity, speed) {}
};

/**
 * @brief Collection vehicle specialization
 */
class CollectionVehicle : public Vehicle {
 public:
  CollectionVehicle() = default;
  CollectionVehicle(int maxDuration, int capacity, int speed)
      : Vehicle(maxDuration, capacity, speed) {}
  /**
   * @brief Get the type of the vehicle
   * @return std::string - Type of the vehicle
   */
  std::string type() const override { return "Collection"; }
};

/**
 * @brief Transport vehicle specialization
 */
class TransportVehicle : public Vehicle {
 public:
  TransportVehicle() = default;
  TransportVehicle(int maxDuration, int capacity, int speed)
      : Vehicle(maxDuration, capacity, speed) {}
  std::string type() const override { return "Transport"; }
};

#endif  // __VEHICLE_H__
