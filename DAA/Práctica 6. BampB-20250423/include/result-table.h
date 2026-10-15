/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Diseño y Análisis de Algoritmos
 * Práctica 6: Branch and Bound
 *
 * @file result-table.h
 * @brief This file contains the definition of the ResultTable class, which is
 * responsible for managing a table of results. It includes methods for
 * adding and removing rows, checking if the table is empty, and converting the
 * table to a string representation. The class also handles the formatting of
 * the table, including column widths and dividers. 
 * 
 * @author 
 * @date 24 APR 2025
 */

#ifndef RESULTTABLE_H_
#define RESULTTABLE_H_

#include <algorithm>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>

/**
 * @class ResultTable
 * @brief Class that represents a table of results.
 */
class ResultTable {
 public:

  /**
   * @brief Default constructor for the ResultTable class.
   */
  ResultTable() = default;

  /**
   * @brief Constructor for the ResultTable class that initializes the table
   *        with headers.
   * @param headers The headers for the table.
   */
  explicit ResultTable(const std::vector<std::string>& headers)
      : headers_(headers), column_widths_(headers.size(), 0) {
    update_column_widths(headers);
  }

  /**
   * @brief Destructor for the ResultTable class.
   */
  ~ResultTable() = default;

  /**
   * @brief Adds a row to the table.
   * @param row The row to be added.
   */
  void add_row(const std::vector<std::string>& row);

  /**
   * @brief Adds a new row to the table with a string representation.
   * @param row The string representation of the row to be added.
   */
  void add_row(const std::string& row);

  /**
   * @brief Removes a row from the table.
   * @param row The string representation of the row to be removed.
   */
  void remove_row(std::string row);

  /**
   * @brief Removes a row from the table.
   * @param row The row to be removed.
   */
  bool is_empty() const { return headers_.size() == 0; }

  /**
   * @brief Prints the table to the specified output stream.
   * @param os The output stream to print the table to.
   */
  friend std::ostream& operator<<(std::ostream& os, const ResultTable& table) {
    if (table.is_empty()) {
      os << "Table is empty." << std::endl;
      return os;
    }
    os << table.to_string();
    return os;
  }
  
  private:
  std::vector<std::string> headers_;
  std::vector<std::vector<std::string>> rows_;
  std::vector<size_t> column_widths_;
  
  /**
   * @brief Converts the table to a string representation.
   * @return The string representation of the table.
   */
  std::string to_string() const;

  /**
   * @brief Updates the column widths based on the current rows in the table.
   */
  void update_column_widths(const std::vector<std::string>& row);

  /**
   * @brief Updates the column widths based on the current rows in the table.
   */
  std::vector<std::vector<std::string>> get_sorted_rows() const;

  /**
   * @brief Prints the table to the specified output stream.
   * @param os The output stream to print the table to.
   * @param rows The rows to be printed.
   */
  void print_table(std::ostream& os,
                   const std::vector<std::vector<std::string>>& rows) const;

  /**
   * @brief Prints the headers of the table to the specified output stream.
   * @param os The output stream to print the headers to.
   */
  void print_divider(std::ostream& os) const;

  /**
   * @brief Prints a row of the table to the specified output stream.
   * @param os The output stream to print the row to.
   * @param row The row to be printed.
   */
  void print_row(std::ostream& os, const std::vector<std::string>& row) const;
};

#endif  // RESULTTABLE_H_