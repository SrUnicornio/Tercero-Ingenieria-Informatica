#include "BusquedaNoInformada.h"

// Función principal
int main(int argc, char *argv[])
{
  Usage(argc, argv);

  std::ifstream file = OpenFile(argv[1]);
  const int numNodes = ReadNodes(file);
  int edges{0};
  std::vector<double> distances = ReadDistances(file, edges);
  Node *nodes[numNodes]; // Arreglo de punteros a nodos

  // Crear nodos y agregar hijos
  InitializeNodes(nodes, numNodes, distances);

  // Escribir información del grafo en un archivo
  int originNode{0};
  int destinationNode{0};
  AskForNodes(originNode, destinationNode, numNodes);
  WriteGraphInformation("Infograf.txt", nodes, numNodes, edges, distances);
  std::ofstream output_file(argv[2]);
  std::set<Node *> visitedNodes;
  ImprimirArbolDesdeOrigen(output_file, nodes, nodes[originNode-1], visitedNodes);
  output_file << std::endl;
  visitedNodes.clear();
  output_file.close();
  // Realizar búsquedas (DFS y BFS sin memoria)
  PerformSearches(nodes, originNode, destinationNode, numNodes, edges);

  output_file.open("ArbolNGND.txt");
  output_file << "Árbol desde el nodo origen hasta el nodo destino:\n";
  ImprimirArbolNGND(output_file, nodes, nodes[originNode-1], nodes[destinationNode-1], visitedNodes);
  output_file.close();
  visitedNodes.clear();
  // Limpiar memoria de nodos
  deleteNodes(nodes, numNodes);

  std::cout << "Fin del programa.\n" << std::endl;
  return 0;
}
