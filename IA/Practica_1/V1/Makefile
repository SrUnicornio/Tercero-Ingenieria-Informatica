# The C++ compiler
CXX = g++

# The C++ compiler options
CXXFLAGS = -std=c++17 -Wall -Wextra

# The linker options (if any)
LDFLAGS =

# Directories for object files and executable
OBJDIR = obj
BINDIR = bin

# Object files
OBJ = $(OBJDIR)/AlgoritmosBusquedas.o $(OBJDIR)/BusquedaNoInformada_fun.o $(OBJDIR)/BusquedaNoInformada_main.o \
      $(OBJDIR)/CabecerasBusqueda.o $(OBJDIR)/InformacionBusquedas.o $(OBJDIR)/Node.o $(OBJDIR)/NodeGestor.o

# The executable
TARGET = $(BINDIR)/BusquedaNoInformada_main

# Build all
all: $(TARGET)

# Create the target executable by linking the object files
$(TARGET): $(OBJ) | $(BINDIR)
	$(CXX) $(CXXFLAGS) -o $(TARGET) $(OBJ) $(LDFLAGS)

# Rule to compile .cc files to .o, redirecting the .o files to the obj directory
$(OBJDIR)/%.o: %.cc | $(OBJDIR)
	$(CXX) $(CXXFLAGS) -c $< -o $@ 

# Create the object directory if it doesn't exist
$(OBJDIR):
	mkdir -p $(OBJDIR)

# Create the bin directory if it doesn't exist
$(BINDIR):
	mkdir -p $(BINDIR)

# Clean target to remove generated files, object directory, and executable directory
# find . -name '*.txt' ! -name 'Grafo[0-9]*.txt' -exec rm {} \;

.PHONY: clean
clean:
	rm -rf $(OBJDIR) $(BINDIR)
	rm -rf *~ basura
	find . -name '*~' -exec rm {} \;
	find . -name basura -exec rm {} \;
