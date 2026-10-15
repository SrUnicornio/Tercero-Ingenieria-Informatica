#include "../include/program-arguments.h"

ProgramOptions ArgumentParser::parse() {
  if (argc < 2) {
    options.help = true;
    return options;
  }

  for (int i = 1; i < argc; ++i) {
    std::string arg = argv[i];
    if (arg == "--batch" || arg == "-b") {
      handle_batch(i);
    } else if (arg == "--single" || arg == "-s") {
      handle_single(i);
    } else if (arg == "--dimension" || arg == "-d") {
      handle_dimension(i);
    } else if (arg == "--output" || arg == "-o") {
      handle_output(i);
    } else if (arg == "--verbose" || arg == "-v") {
      handle_verbose();
    } else if (arg == "--help" || arg == "-h") {
      handle_help();
    } else {
      throw std::runtime_error("Error: Unknown argument: " + arg);
    }
  }

  validate_options();
  return options;
}

void ArgumentParser::handle_batch(int& i) {
  if (batch_set)
    throw std::runtime_error("Error: --batch/-b specified multiple times.");
  batch_set = true;
  options.batch_mode = true;
  options.batch_directory = read_next_arg(i, "directory after --batch/-b");
}

void ArgumentParser::handle_single(int& i) {
  if (single_set)
    throw std::runtime_error("Error: --single/-s specified multiple times.");
  single_set = true;
  options.single_file_mode = true;
  options.input_file = read_next_arg(i, "input file after --single/-s");
}

void ArgumentParser::handle_dimension(int& i) {
  if (dimension_set)
    throw std::runtime_error("Error: --dimension/-d specified multiple times.");
  dimension_set = true;
  try {
    options.dimension =
        std::stoi(read_next_arg(i, "dimension after --dimension/-d"));
  } catch (const std::invalid_argument&) {
    throw std::runtime_error("Error: Invalid dimension value.");
  }
  
  if (options.dimension <= 1) { // Assuming dimension must be greater than 1
    throw std::runtime_error("Error: Dimension must be greater than 1.");
  }
}

void ArgumentParser::handle_output(int& i) {
  if (output_set)
    throw std::runtime_error("Error: --output/-o specified multiple times.");
  output_set = true;
  options.output_file = read_next_arg(i, "output file after --output/-o");
}

void ArgumentParser::handle_verbose() {
  if (verbose_set)
    throw std::runtime_error("Error: --verbose/-v specified multiple times.");
  verbose_set = true;
  options.verbose = true;
}

void ArgumentParser::handle_help() {
  if (help_set)
    throw std::runtime_error("Error: --help/-h specified multiple times.");
  help_set = true;
  options.help = true;
}

std::string ArgumentParser::read_next_arg(int& i,
                                          const std::string& missing_message) {
  if (i + 1 >= argc) {
    throw std::runtime_error("Error: Missing " + missing_message);
  }
  return argv[++i];
}

void ArgumentParser::validate_options() {
  if (options.batch_mode && options.single_file_mode) {
    throw std::runtime_error(
        "Error: Cannot use both --batch and --single mode.");
  }
  if (!options.batch_mode && !options.single_file_mode && !options.help) {
    throw std::runtime_error(
        "Error: Either --batch or --single must be specified.");
  }
  if (!options.help) {
    if (options.dimension == -1) {
      throw std::runtime_error(
          "Error: Dimension (--dimension) must be specified.");
    }
  }
}

std::string ArgumentParser::normalize_algorithm_name(const std::string& name) {
  std::string normalized;
  for (char c : name) {
    if (c != '-') {
      normalized += std::tolower(c);
    }
  }
  if (normalized == "localsearch") return "ls";
  return normalized;
}