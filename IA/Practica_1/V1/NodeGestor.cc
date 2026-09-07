#include "NodeGestor.h"

/**
 * @brief Crea los nodos y los almacena en un arreglo.
 * @param nodes Arreglo de punteros a nodos.
 * @param numNodes Número de nodos a crear.
 */
void createNodes(Node *nodes[], int numNodes)
{
  for (int i = 0; i < numNodes; ++i)
  {
    nodes[i] = new Node(i + 1);
  }
}

/**
 * @brief Llena el vector de getChildren() de los nodos basado en las distancias.
 * @param nodes Arreglo de punteros a nodos con sus hijos.
 * @param distances Vector de distancias entre nodos.
 * @param totalNodes Número total de nodos.
 */
void FillSuccessors(Node *nodes[], const std::vector<double> &distances, int totalNodes)
{
  int distance_index = 0;
  for (int i = 0; i < totalNodes; ++i)
  {
    for (int j = i + 1; j < totalNodes; ++j)
    {
      double current_distance = distances[distance_index++];
      if (current_distance != -1)
      {
        nodes[i]->addChild(nodes[j], current_distance); // Almacena el sucesor en el nodo i, j
        nodes[j]->addChild(nodes[i], current_distance); // Almacena el sucesor en el nodo j, i
      }
    }
  }
}

/**
 * @brief Elimina los nodos creados.
 * @param nodes Arreglo de punteros a nodos.
 * @param numNodes Número de nodos a eliminar.
 */
void deleteNodes(Node *nodes[], int numNodes)
{
  for (int i = 0; i < numNodes; ++i)
  {
    delete nodes[i];
  }
}

void AskForNodes(int &originNode, int &destinationNode, int numNodes)
{
  std::cout << "Introduce el nodo origen: ";
  std::cin >> originNode;
  std::cout << "Introduce el nodo destino: ";
  std::cin >> destinationNode;

  if (originNode < 1 || originNode > numNodes || destinationNode < 1 || destinationNode > numNodes)
  {
    throw NodoInexistenteException("Error: Uno o ambos nodos no existen.");
  }
}