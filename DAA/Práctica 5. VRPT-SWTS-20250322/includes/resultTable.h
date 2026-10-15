#ifndef RESULTTABLE_H_
#define RESULTTABLE_H_

#include <algorithm>
#include <iomanip>
#include <iostream>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>

class ResultTable {
 public:
  explicit ResultTable(const std::vector<std::string>& headers)
      : headers_(headers), column_widths_(headers.size(), 0) {
    update_column_widths(headers);
  }

  void add_row(const std::vector<std::string>& row) {
    if (row.size() != headers_.size()) {
      throw std::invalid_argument("Row size " + std::to_string(row.size()) +
                                  " doesn't match header size " +
                                  std::to_string(headers_.size()));
    }
    rows_.push_back(row);
    update_column_widths(row);
  }

  bool is_empty() const { return headers_.size() == 0; }
  std::string to_string() const {
    auto sorted_rows = get_sorted_rows();
    std::stringstream ss;
    print_table(ss, sorted_rows);
    return ss.str();
  }

 private:
  std::vector<std::string> headers_;
  std::vector<std::vector<std::string>> rows_;
  std::vector<size_t> column_widths_;

  void update_column_widths(const std::vector<std::string>& row) {
    for (size_t i = 0; i < row.size(); ++i) {
      column_widths_[i] = std::max(column_widths_[i], row[i].length());
    }
  }

  std::vector<std::vector<std::string>> get_sorted_rows() const {
    auto sorted_rows = rows_;

    // Encontrar el índice de la columna [LRC] si existe
    int lrc_index = -1;
    for (size_t i = 0; i < headers_.size(); ++i) {
      if (headers_[i] == "[LRC]" || headers_[i] == "kmax") {
        lrc_index = i;
        break;
      }
    }

    std::sort(
        sorted_rows.begin(), sorted_rows.end(),
        [lrc_index, this](const auto& a, const auto& b) {
          // Primero ordenar por Instance (columna 0)
          try {
            int instance_a = std::stoi(a[0]);
            int instance_b = std::stoi(b[0]);
            if (instance_a != instance_b) {
              return instance_a < instance_b;
            }
          } catch (const std::exception&) {
            if (a[0] != b[0]) {
              return a[0] < b[0];
            }
          }

          // Si hay columna [LRC], ordenar por ella como segundo criterio
          if (lrc_index != -1 && lrc_index < static_cast<int>(a.size())) {
            try {
              int lrc_a = std::stoi(a[lrc_index]);
              int lrc_b = std::stoi(b[lrc_index]);
              if (lrc_a != lrc_b) {
                return lrc_a < lrc_b;
              }
            } catch (const std::exception&) {
              if (a[lrc_index] != b[lrc_index]) {
                return a[lrc_index] < b[lrc_index];
              }
            }
          }
          
          // Si todo es igual, mantener el orden original
          return false;
        });

    return sorted_rows;
  }

  void print_table(std::ostream& os,
                   const std::vector<std::vector<std::string>>& rows) const {
    print_divider(os);
    print_row(os, headers_);
    print_divider(os);

    for (const auto& row : rows) {
      print_row(os, row);
    }

    print_divider(os);
  }

  void print_divider(std::ostream& os) const {
    os << "+";
    for (size_t width : column_widths_) {
      os << std::string(width + 2, '-') << "+";
    }
    os << "\n";
  }

  void print_row(std::ostream& os, const std::vector<std::string>& row) const {
    os << "|";
    for (size_t i = 0; i < row.size(); ++i) {
      os << " " << std::setw(column_widths_[i]) << row[i] << " |";
    }
    os << "\n";
  }
};

#endif  // RESULTTABLE_H_