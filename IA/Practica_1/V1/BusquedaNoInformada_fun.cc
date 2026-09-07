#include "BusquedaNoInformada.h"

/**
 * @brief Muestra el uso correcto del programa.
 * @param argc numero de argumentos.
 * @param argv 
 */
void Usage(int argc, char *argv[])
{

  std::string parameter{argv[1]};
  if (argc < 3 && (parameter != "--help" || parameter != "-h"))
  {
    std::cerr << "Error: Número incorrecto de argumentos."
              << "\nPruebe " << argv[0] << " --help | -h para más información." << std::endl;
    exit(1);
  }

  if (parameter == "--help" || parameter == "-h")
  {
    std::cout << "\n\nUso: " << argv[0] << " <nombre_fichero_entrada> <nombre_fichero_salida>"
              << argv[0] << "Programa que realiza búsquedas sin memoria en un grafo."
              << "\n\nArgumentos:"
              << "\n  <nombre_fichero_entrada>  Nombre del archivo de entrada que contiene el grafo."
              << "\n  <nombre_fichero_salida>   Nombre del archivo de salida donde se escribirá la información del grafo."
              << "El preograma generará más archivos de salida con los resultados de las búsquedas."
              << "\n\nEjemplo de uso:"
              << "\n  " << argv[0] << " grafo.txt salida.txt\n" << std::endl;
    exit(0);
  }
}

/**
 * @brief Abre el archivo proporcionado y gestiona los errores de apertura.
 * @param filename Nombre del archivo a abrir.
 * @return ifstream Archivo abierto.
 */
std::ifstream OpenFile(const std::string &filename)
{
  std::ifstream file(filename);
  if (!file.is_open())
  {
    std::cerr << "Error: No se pudo abrir el archivo." << std::endl;
    exit(1);
  }
  return file;
}

/**
 * @brief Lee la primera línea del archivo para obtener el número de nodos.
 * @param file Archivo desde el que leer los nodos.
 * @return int Número de nodos.
 */
int ReadNodes(std::ifstream &file)
{
  int nodes{0};
  std::string line;
  if (std::getline(file, line))
  {
    std::istringstream iss(line);
    iss >> nodes;
    if (nodes <= 0) // Asegurarse de que el número de nodos sea positivo
    {
      std::cerr << "Error: El número de nodos debe ser mayor que cero." << std::endl;
      exit(1);
    }
  }
  else
  {
    std::cerr << "Error: No se pudo leer el número de nodos del archivo." << std::endl;
    exit(1);
  }
  return nodes;
}

/**
 * @brief Lee las distancias entre los nodos del archivo.
 * @param file Archivo desde el que leer las distancias.
 * @param edges Número de aristas que se incrementa a medida que se leen distancias válidas.
 * @return vector<double> Vector que contiene las distancias leídas.
 */
std::vector<double> ReadDistances(std::ifstream &file, int &edges)
{
  std::vector<double> distances;
  std::string line;
  double distance;

  while (std::getline(file, line))
  {
    std::istringstream iss(line);
    while (iss >> distance)
    {
      distances.push_back(distance);
      if (distance != -1)
      {
        ++edges;
      }
    }
  }
  return distances;
}

/**
 * @brief Inicializa los nodos y sus hijos basados en las distancias leídas.
 * @param nodes Arreglo de punteros a nodos.
 * @param numNodes Número de nodos en el grafo.
 * @param distances Vector de distancias entre nodos.
 */
void WriteGraphInformation(const std::string &filename, Node *nodes[], int numNodes, int edges, const std::vector<double> &distances)
{
  std::ofstream output_file(filename);
  WriteGraphInfo(output_file, nodes, numNodes, edges, distances);
  output_file.close();
  std::cout << "Hijos de los nodos impresos en el archivo " << filename << ".\n" << std::endl;
}

/**
 * @brief Escribe la información del grafo en un archivo de salida.
 * @param output_file Archivo de salida.
 * @param nodes Arreglo de punteros a nodos.
 * @param numNodes Número de nodos en el grafo.
 * @param numEdges Número de aristas en el grafo.
 * @param distances Vector de distancias entre nodos.
 */
void WriteGraphInfo(std::ofstream &output_file, Node *nodes[], int numNodes, int numEdges, const std::vector<double> &distances)
{
  if (!output_file.is_open())
  {
    std::cerr << "Error: No se pudo abrir el archivo de salida." << std::endl;
    exit(1);
  }

  output_file << "Número de nodos: " << numNodes << "\nNúmero de aristas: " << numEdges << "\n\n";

  int distance_index = 0;
  int connection_number = 1;

  std::cout << "Conexiones entre nodos:\n";
  for (int i = 0; i < numNodes; ++i)
  {
    for (int j = i + 1; j < numNodes; ++j)
    {
      double current_distance = distances[distance_index++];
      if (current_distance != -1)
      { 
        output_file << connection_number << ".- Conexión (" << nodes[i]->getValue() << ", " << nodes[j]->getValue() << ") = " << current_distance << "\n";
        ++connection_number; 
      }
    }
  }
  output_file << "\n"; 

  for (int i = 0; i < numNodes; ++i)
  {
    output_file << "Nodo " << nodes[i]->getValue() << " tiene " << nodes[i]->getChildren().size() << " hijos: ";
    nodes[i]->printChildren(output_file); // Usar el método de impresión de hijos ya implementado
  }
}

/**
 * @brief Imprime el árbol desde un nodo origen.
 * @param output_file fichero de salida
 * @param nodes puntero a los nodos
 * @param nodoOrigen nodo origen
 * @param nodosVisitados nodos visitados
 * @param nivel nivel actual
 */
void ImprimirArbolDesdeOrigen(std::ofstream &output_file, Node *nodes[], Node *nodoOrigen, std::set<Node *> &nodosVisitados, int nivel)
{
  output_file << std::string(nivel * 2, ' ') << "Nodo: " << nodoOrigen->getValue() << std::endl;

  nodosVisitados.insert(nodoOrigen);

  for (auto sucesor : nodoOrigen->getChildren())
  {
    Node *hijo = sucesor.first;
    if (nodosVisitados.find(hijo) == nodosVisitados.end())
    {
      ImprimirArbolDesdeOrigen(output_file, nodes, hijo, nodosVisitados, nivel + 1);
    }
  }

  nodosVisitados.erase(nodoOrigen);
}

/**
 * @brief Imprime el árbol desde un nodo origen hasta un nodo destino.
 * @param output_file fichero de salida
 * @param nodes puntero a los nodos
 * @param nodoOrigen nodo origen
 * @param nodoDestino nodo destino
 * @param nodosVisitados nodos visitados
 * @param nivel nivel actual
 */
void ImprimirArbolNGND(std::ofstream &output_file, Node *nodes[], Node *nodoOrigen, Node *nodoDestino, std::set<Node *> &nodosVisitados, int nivel)
{
  output_file << std::string(nivel * 2, ' ') << "Nodo: " << nodoOrigen->getValue() << std::endl;

  nodosVisitados.insert(nodoOrigen);

  if (nodoOrigen == nodoDestino)
  {
    output_file << std::string(nivel * 2, ' ') << "Destino encontrado." << std::endl;
  }

  for (auto sucesor : nodoOrigen->getChildren())
  {
    Node *hijo = sucesor.first;
    if (nodosVisitados.find(hijo) == nodosVisitados.end())
    {
      ImprimirArbolNGND(output_file, nodes, hijo, nodoDestino, nodosVisitados, nivel + 1);
    }
  }

  nodosVisitados.erase(nodoOrigen);
}

/**
 * @brief Crea los nodos y los almacena en un arreglo.
 * @param nodes Arreglo de punteros a nodos.
 * @param numNodes Número de nodos a crear.
 */
void InitializeNodes(Node *nodes[], int numNodes, const std::vector<double> &distances)
{
  createNodes(nodes, numNodes);
  std::cout << "Nodos creados.\n"
            << std::endl;
  FillSuccessors(nodes, distances, numNodes);
}