#include "../include/result-table.h"

/**
 * @brief Adds a row to the table.
 * @param row The row to be added.
 */
void ResultTable::add_row(const std::vector<std::string>& row) {
  if (row.size() != headers_.size()) {
    throw std::invalid_argument("Row size " + std::to_string(row.size()) +
                                " doesn't match header size " +
                                std::to_string(headers_.size()));
  }
  rows_.push_back(row);
  update_column_widths(row);
}

/**
 * @brief Adds a new row to the table with a string representation.
 * @param row The string representation of the row to be added.
 */
void ResultTable::add_row(const std::string& row) {
  std::istringstream iss(row);
  std::string token;
  std::vector<std::string> row_vector;
  while (std::getline(iss, token, ' ')) {
    row_vector.push_back(token);
  }
  rows_.push_back

  (row_vector);
  update_column_widths(row_vector);
}

/**
 * @brief Removes a row from the table.
 * @param row The string representation of the row to be removed.
 */
void ResultTable::remove_row(std::string row) {
  auto it = std::remove_if(
      rows_.begin(), rows_.end(),
      [&row](const std::vector<std::string>& r) { return r[0] == row; });
  if (it != rows_.end()) {
    rows_.erase(it, rows_.end());
  } else {
    throw std::invalid_argument("Row not found: " + row);
  }
}

/**
 * @brief Converts the table to a string representation.
 * @return The string representation of the table.
 */
std::string ResultTable::to_string() const {
  auto sorted_rows = get_sorted_rows();
  std::stringstream ss;
  print_table(ss, sorted_rows);
  return ss.str();
}

/**
 * @brief Updates the column widths based on the current rows in the table.
 */
void ResultTable::update_column_widths(const std::vector<std::string>& row) {
  for (size_t i = 0; i < row.size(); ++i) {
    column_widths_[i] = std::max(column_widths_[i], row[i].length());
  }
}

/**
 * @brief Sorts the rows of the table based on the first column and, if
 * applicable, the [LRC] column.
 * @return A vector of sorted rows.
 */
std::vector<std::vector<std::string>> ResultTable::get_sorted_rows() const {
  auto sorted_rows = rows_;

  // Índices relevantes
  int m_index = -1;
  int lrc_index = -1;
  int iter_index = -1;

  for (size_t i = 0; i < headers_.size(); ++i) {
    std::string h = headers_[i];
    if (h == "m" || h == "[m]") m_index = i;
    if (h == "Iterations" || h == "[Iterations]") iter_index = i;
    if (h == "[LRC]") lrc_index = i;
  }

  std::sort(sorted_rows.begin(), sorted_rows.end(),
            [&](const auto& a, const auto& b) {
              // 1. Por nombre de archivo (columna 0)
              if (a[0] != b[0]) return a[0] < b[0];

              // 2. Por subdimensión m
              if (m_index != -1) {
                try {
                  int m_a = std::stoi(a[m_index]);
                  int m_b = std::stoi(b[m_index]);
                  if (m_a != m_b) return m_a < m_b;
                } catch (...) {
                  if (a[m_index] != b[m_index]) return a[m_index] < b[m_index];
                }
              }

              // 3. Por iteraciones
              if (iter_index != -1) {
                try {
                  int it_a = std::stoi(a[iter_index]);
                  int it_b = std::stoi(b[iter_index]);
                  if (it_a != it_b) return it_a < it_b;
                } catch (...) {
                  if (a[iter_index] != b[iter_index])
                    return a[iter_index] < b[iter_index];
                }
              }

              // 4. Por índice LRC
              if (lrc_index != -1) {
                try {
                  int lrc_a = std::stoi(a[lrc_index]);
                  int lrc_b = std::stoi(b[lrc_index]);
                  if (lrc_a != lrc_b) return lrc_a < lrc_b;
                } catch (...) {
                  if (a[lrc_index] != b[lrc_index])
                    return a[lrc_index] < b[lrc_index];
                }
              }

              // Mantener orden original si todo es igual
              return false;
            });

  return sorted_rows;
}

/**
 * @brief Prints the table to the specified output stream.
 * @param os The output stream to print the table to.
 * @param rows The rows to be printed.
 */
void ResultTable::print_table(
    std::ostream& os, const std::vector<std::vector<std::string>>& rows) const {
  print_divider(os);
  print_row(os, headers_);
  print_divider(os);

  for (const auto& row : rows) {
    print_row(os, row);
  }

  print_divider(os);
}

/**
 * @brief Prints the headers of the table to the specified output stream.
 * @param os The output stream to print the headers to.
 */
void ResultTable::print_divider(std::ostream& os) const {
  os << "+";
  for (size_t width : column_widths_) {
    os << std::string(width + 2, '-') << "+";
  }
  os << "\n";
}

/**
 * @brief Prints a row of the table to the specified output stream.
 * @param os The output stream to print the row to.
 * @param row The row to be printed.
 */
void ResultTable::print_row(std::ostream& os,
                          const std::vector<std::string>& row) const {
  os << "|";
  for (size_t i = 0; i < row.size(); ++i) {
    os << " " << std::setw(column_widths_[i]) << row[i] << " |";
  }
  os << "\n";
}