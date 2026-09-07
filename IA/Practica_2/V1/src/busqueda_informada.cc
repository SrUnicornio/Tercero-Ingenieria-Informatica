/**
 * Universidad de La Laguna
 * Escuela Superior de Ingeniería y Tecnología
 * Grado en Ingeniería Informática
 * Asignatura: Inteligencia Artificial
 * Curso: 3º
 * Práctica 2: Búsqueda A*
 * Autor: Álvaro Pérez Ramos
 * Correo: alu0101574042@ull.edu.es
 * Fecha: 18/09/2024
 * Archivo busqueda_informada.cc: Implementación de funciones para cargar, manipular y gestionar laberintos
 */
#include "busqueda_informada.h"

/**
 * @brief Muestra el uso correcto del programa y verifica los argumentos de entrada.
 *
 * Si el número de argumentos no es 2, imprime un mensaje de uso y finaliza el programa.
 *
 * @param argc Número de argumentos de la línea de comandos.
 * @param argv Arreglo de argumentos de la línea de comandos.
 */
void Usage(int argc, char *argv[])
{
  if (argc != 2)
  {
    std::cerr << "Usage: " << argv[0] << " <filename>" << std::endl;
    exit(1);
  }
}

/**
 * @brief Carga un laberinto desde un archivo especificado.
 *
 * Lee el número de filas y columnas, y llena la matriz del laberinto con los valores del archivo.
 *
 * @param filename Nombre del archivo desde el cual cargar el laberinto.
 * @param laberinto Objeto Laberinto donde se almacenará la matriz cargada.
 * @param rows Referencia donde se almacenará el número de filas del laberinto.
 * @param cols Referencia donde se almacenará el número de columnas del laberinto.
 * @return true Si el laberinto se cargó correctamente.
 * @return false Si hubo un error al abrir el archivo o leer los datos.
 */
bool LoadLaberinto(const std::string &filename, Laberinto &laberinto, int &rows, int &cols)
{ 
  
  std::ifstream file(filename);
  if (!file.is_open())
  {
    std::cerr << "Error al abrir el archivo: " << filename << std::endl;
    return false;
  }

  file >> rows >> cols;
  laberinto = Laberinto(rows, cols);
  for (int i = 0; i < rows; i++)
  {
    for (int j = 0; j < cols; j++)
    {
      file >> laberinto.getLaberinto()[i][j];
    }
  }

  file.close();
  return true;
}

/**
 * @brief Escribe la representación del laberinto en un archivo.
 *
 * Utiliza el método printLaberinto de la clase Laberinto para escribir la matriz en el archivo.
 *
 * @param laberinto Objeto Laberinto que contiene la matriz a escribir.
 * @param filename Nombre del archivo donde se escribirá el laberinto.
 */
void WriteLaberintoToFile(const Laberinto &laberinto, const std::string &filename)
{
  std::ofstream output_file(filename);
  if (output_file.is_open())
  {
    laberinto.printLaberinto(output_file);
    output_file.close();
  }
  else
  {
    std::cerr << "Error al escribir en el archivo: " << filename << std::endl;
  }
}

/**
 * @brief Encuentra las posiciones de inicio y fin en el laberinto.
 *
 * Busca en la matriz del laberinto las posiciones marcadas como inicio (3) y fin (4).
 *
 * @param laberinto Objeto Laberinto en el que se buscarán las posiciones.
 * @param start Referencia donde se almacenará la posición de inicio.
 * @param end Referencia donde se almacenará la posición de fin.
 * @return true Si ambas posiciones se encontraron.
 * @return false Si no se encontró la posición de inicio o fin.
 */
bool FindStartAndEnd(const Laberinto &laberinto, Position &start, Position &end)
{
  bool start_found = false, end_found = false;
  int rows = laberinto.getRows();
  int cols = laberinto.getCols();

  for (int i = 0; i < rows && (!start_found || !end_found); i++)
  {
    for (int j = 0; j < cols && (!start_found || !end_found); j++)
    {
      if (laberinto.getLaberinto()[i][j] == 3)
      {
        if (start_found)
        {
          std::cerr << "Error: Hay más de una posición de inicio (3) en el laberinto." << std::endl;
          return false; // Más de una entrada
        }
        start = std::make_pair(i, j);
        start_found = true;
      }
      if (laberinto.getLaberinto()[i][j] == 4)
      {
        if (end_found)
        {
          std::cerr << "Error: Hay más de una posición de fin (4) en el laberinto." << std::endl;
          return false; // Más de una salida
        }
        end = std::make_pair(i, j);
        end_found = true;
      }
    }
  }

  if (!start_found || !end_found)
  {
    std::cerr << "El laberinto debe tener una posición de inicio (3) y una posición de fin (4)." << std::endl;
    return false;
  }

  return true;
}

/**
 * @brief Verifica si una posición en el laberinto es transitible.
 *
 * Comprueba que la posición esté dentro de los límites del laberinto.
 *
 * @param laberinto Objeto Laberinto que se está evaluando.
 * @param fila Índice de la fila a evaluar.
 * @param columna Índice de la columna a evaluar.
 * @return true Si la posición es transitible.
 * @return false Si la posición no es transitible (fuera de límites).
 */
bool EsPosicionTransitible(const Laberinto &laberinto, int fila, int columna)
{
  if (fila < 0 || fila >= laberinto.getRows() || columna < 0 || columna >= laberinto.getCols())
    return false;
  return true;
}

// Verifica si la posición está en los bordes del laberinto
bool EsPosicionEnBorde(int fila, int columna, int rows, int cols)
{
  return (fila == 0 || fila == rows - 1 || columna == 0 || columna == cols - 1);
}

/**
 * @brief Permite al usuario cambiar las posiciones de inicio y fin del laberinto.
 *
 * Solicita al usuario si desea cambiar las posiciones y, de ser así, pide las nuevas posiciones,
 * validando que sean transitibles.
 *
 * @param start Referencia a la posición de inicio del laberinto.
 * @param end Referencia a la posición de fin del laberinto.
 * @param laberinto Objeto Laberinto donde se realizarán los cambios.
 * @return true Si se han actualizado las posiciones correctamente.
 * @return false Si el usuario elige no cambiar las posiciones.
 */
bool CambiarPosiciones(Position &start, Position &end, Laberinto &laberinto)
{
  char opcion;
  std::cout << "¿Desea cambiar las posiciones de inicio y fin del laberinto? (y/n): ";
  std::cin >> opcion;

  if (opcion == 'y' || opcion == 'Y')
  {
    std::cout << "Tamaño del laberinto: " << laberinto.getRows() << "x" << laberinto.getCols() << std::endl;
    std::cout << "Posiciones actuales:\n";
    std::cout << "Inicio: (" << start.first + 1 << ", " << start.second + 1 << ")\n";
    std::cout << "Fin: (" << end.first + 1 << ", " << end.second + 1 << ")\n";

    int nueva_start_fila, nueva_start_col;
    int nueva_end_fila, nueva_end_col;

    // Solicitar nueva posición de inicio
    std::cout << "\nIngrese la nueva posición de inicio (fila y columna, separadas por espacio): ";
    std::cin >> nueva_start_fila >> nueva_start_col;

    // Ajustar índices (si las entradas son 1-based)
    nueva_start_fila -= 1;
    nueva_start_col -= 1;

    // Validar nueva posición de inicio
    while (!EsPosicionTransitible(laberinto, nueva_start_fila, nueva_start_col) ||
           !EsPosicionEnBorde(nueva_start_fila, nueva_start_col, laberinto.getRows(), laberinto.getCols()))
    {
      std::cerr << "\nPosición de inicio inválida. Debe estar dentro del laberinto, ser transitible y estar en los bordes.\n";
      std::cout << "\nIngrese la nueva posición de inicio (fila y columna, separadas por espacio): ";
      std::cin >> nueva_start_fila >> nueva_start_col;

      // Ajustar índices nuevamente
      nueva_start_fila -= 1;
      nueva_start_col -= 1;
    }

    // Solicitar nueva posición de fin
    std::cout << "Ingrese la nueva posición de fin (fila y columna, separadas por espacio): ";
    std::cin >> nueva_end_fila >> nueva_end_col;

    // Ajustar índices (si las entradas son 1-based)
    nueva_end_fila -= 1;
    nueva_end_col -= 1;

    // Validar nueva posición de fin
    while (!EsPosicionTransitible(laberinto, nueva_end_fila, nueva_end_col) ||
           !EsPosicionEnBorde(nueva_end_fila, nueva_end_col, laberinto.getRows(), laberinto.getCols()) ||
           (nueva_start_fila == nueva_end_fila && nueva_start_col == nueva_end_col))
    {
      std::cerr << "\nPosición de fin inválida. Debe estar dentro del laberinto, ser transitible, estar en los bordes y no ser la misma posición que la de inicio.\n";
      std::cout << "Ingrese la nueva posición de fin (fila y columna, separadas por espacio): ";
      std::cin >> nueva_end_fila >> nueva_end_col;

      // Ajustar índices nuevamente
      nueva_end_fila -= 1;
      nueva_end_col -= 1;
    }

    // Actualizar el laberinto: restablecer posiciones anteriores
    laberinto.getLaberinto()[start.first][start.second] = 1; // Asumiendo que 0 es el valor por defecto
    laberinto.getLaberinto()[end.first][end.second] = 1;

    // Establecer las nuevas posiciones
    start = std::make_pair(nueva_start_fila, nueva_start_col);
    end = std::make_pair(nueva_end_fila, nueva_end_col);

    laberinto.getLaberinto()[start.first][start.second] = 3; // Marca de inicio
    laberinto.getLaberinto()[end.first][end.second] = 4;     // Marca de fin

    std::cout << "Posiciones actualizadas correctamente.\n";

    return true;
  }

  return false;
}