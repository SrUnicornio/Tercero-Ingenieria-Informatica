#include "AlgoritmosBusquedas.h"

/**
 * @brief Realiza una búsqueda en anchura (BFS) sin memoria desde un nodo origen hasta un nodo destino.
 * @param raiz nodo raíz
 * @param destino nodo destino
 * @param output_file fichero de salida
 * @note Este algoritmo no almacena los nodos visitados en memoria.
 */
void BFS_sin_memoria(Node *raiz, Node *destino, std::ofstream &output_file)
{
  std::queue<std::pair<Node *, std::vector<Node *>>> bfs_queue;
  bfs_queue.push(make_pair(raiz, std::vector<Node *>{}));
  std::map<Node *, Node *> padre;
  padre[raiz] = nullptr;

  int iteracion = 1;
  std::vector<Node *> nodos_inspeccionados;
  std::vector<Node *> nodos_generados;

  while (!bfs_queue.empty())
  {
    auto current_pair = bfs_queue.front();
    bfs_queue.pop();

    Node *current_node = current_pair.first;
    std::vector<Node *> ancestros = current_pair.second;

    PrintTraza(output_file, current_node, nodos_inspeccionados, nodos_generados, iteracion);

    nodos_inspeccionados.push_back(current_node);

    if (current_node == destino)
    {
      iteracion++;
      PrintTraza(output_file, current_node, nodos_inspeccionados, nodos_generados, iteracion);
      output_file << "Final node reached." << std::endl;

      // Imprimir el camino
      std::vector<Node *> camino;
      Node *actual = destino;
      while (actual != nullptr)
      {
        camino.push_back(actual);
        actual = padre[actual];
      }
      std::reverse(camino.begin(), camino.end());
      ImprimirCaminoInfo(camino, output_file);
      return;
    }

    for (const auto &pair : current_node->getChildren())
    {
      Node *hijo = pair.first;
      if (std::find(ancestros.begin(), ancestros.end(), hijo) == ancestros.end())
      {
        std::vector<Node *> nuevos_ancestros = ancestros;
        nuevos_ancestros.push_back(current_node);
        bfs_queue.push(std::make_pair(hijo, nuevos_ancestros));
        nodos_generados.push_back(hijo);
      }
    }

    for (const auto &pair : current_node->getChildren())
    {
      Node *hijo = pair.first;
      if (padre.find(hijo) == padre.end())
      {
        padre[hijo] = current_node;
      }
    }
    iteracion++;
  }
  output_file << "No se pudo llegar al nodo " << destino << " usando BFS sin memoria.\n";
}

/**
 * @brief Realiza una búsqueda en profundidad (DFS) desde un nodo origen hasta un nodo destino.
 * @param output_file fichero de salida
 * @param nodes puntero a los nodos
 * @param currentNode nodo actual
 * @param visitedNodes nodos visitados
 * @param path camino actual
 * @param destinationNode nodo destino
 * @param iteracion número de iteración actual
 */
void DFS(std::ofstream &output_file, Node *nodes[], Node *currentNode, std::vector<Node *> &visitedNodes, std::vector<Node *> &path, Node *destinationNode, int iteracion)
{

  // Imprimir traza
  PrintTraza(output_file, currentNode, visitedNodes, path, iteracion);

  // Verifica si se llegó al destino
  if (currentNode == destinationNode)
  {
    // Imprime traza para la última iteración
    PrintTraza(output_file, currentNode, visitedNodes, path, ++iteracion);
    path.pop_back();
    ImprimirCaminoInfo(path, output_file);
    return;
  }

  // Marca el nodo como visitado
  visitedNodes.push_back(currentNode);

  // Recorre los hijos del nodo actual
  for (auto pair : currentNode->getChildren())
  {
    Node *child = pair.first;

    // Si el hijo no ha sido visitado, procede con la llamada recursiva
    if (visitedNodes.end() == std::find(visitedNodes.begin(), visitedNodes.end(), child))
    {
      // Incrementa la iteración y realiza la búsqueda en el nodo hijo
      iteracion++;
      DFS(output_file, nodes, child, visitedNodes, path, destinationNode, iteracion);

      // Si el destino fue encontrado, termina la recursión
      if (path.back() == destinationNode)
      {
        return;
      }
    }
  }

  // Si este nodo no lleva al destino, se elimina del camino
  path.pop_back();
}

/**
 * @brief Realiza una búsqueda en profundidad (DFS) desde un nodo origen hasta un nodo destino de forma iterativa.
 * @param output_file fichero de salida
 * @param nodes puntero a los nodos
 * @param currentNode nodo actual
 * @param visitedNodes nodos visitados
 * @param path camino actual
 * @param destinationNode nodo destino
 * @param iteracion número de iteración actual
 */
void DFS_Iterativo(std::ofstream &output_file, Node *currentNode, std::vector<Node *> &visitedNodes, Node *destinationNode, int iteracion)
{
  std::stack<Node *> stack;
  stack.push(currentNode);

  std::map<Node *, Node *> padre;
  padre[currentNode] = nullptr;

  int iteracion_actual = iteracion;
  std::vector<Node *> nodos_inspeccionados;
  std::vector<Node *> nodos_generados;

  while (!stack.empty())
  {
    Node *current_node = stack.top();
    stack.pop();

    PrintTraza(output_file, current_node, visitedNodes, nodos_generados, iteracion_actual);

    visitedNodes.push_back(current_node);

    if (current_node == destinationNode)
    {
      PrintTraza(output_file, current_node, visitedNodes, nodos_generados, iteracion_actual);

      output_file << "Final node reached." << std::endl;
      // Imprimir el camino
      std::vector<Node *> path;
      Node *actual = destinationNode;
      while (actual != nullptr)
      {
        path.push_back(actual);
        actual = padre[actual];
      }
      std::reverse(path.begin(), path.end());
      ImprimirCaminoInfo(path, output_file);
      return;
    }

    for (auto pair : current_node->getChildren())
    {
      Node *child = pair.first;
      if (visitedNodes.end() == std::find(visitedNodes.begin(), visitedNodes.end(), child))
      {
        stack.push(child);
        nodos_generados.push_back(child);
        padre[child] = current_node;
      }
    }
    iteracion_actual++;
  }
  output_file << "No se pudo llegar al nodo " << destinationNode << " usando DFS iterativo.\n";
}

/**
 * @brief Realiza una búsqueda en anchura (BFS) desde un nodo origen hasta un nodo destino con memoria.
 * @param output_file fichero de salida
 * @param nodes puntero a los nodos
 * @param currentNode nodo actual
 * @param visitedNodes nodos visitados
 * @param path camino actual
 * @param destinationNode nodo destino
 * @param iteracion número de iteración actual
 */
void BFS(Node *raiz, Node *destination_node, std::ofstream &output_file)
{
  std::queue<Node *> queue;
  std::set<Node *> visited_nodes;
  std::map<Node *, Node *> padre;
  padre[raiz] = nullptr;

  queue.push(raiz);
  visited_nodes.insert(raiz);

  int iteracion = 1;
  std::vector<Node *> nodos_inspeccionados;
  std::vector<Node *> nodos_generados;

  nodos_generados.push_back(raiz);

  while (!queue.empty())
  {
    Node *current_node = queue.front();
    queue.pop();

    output_file << "Iteration " << iteracion << std::endl;
    ImprimirNodosGenerados(nodos_generados, output_file);
    ImprimirNodosInspeccionados(nodos_inspeccionados, output_file);
    ImprimirSeparador(output_file);

    nodos_inspeccionados.push_back(current_node);

    if (current_node == destination_node)
    {
      output_file << "Iteration " << iteracion << std::endl;
      ImprimirNodosGenerados(nodos_generados, output_file);
      ImprimirNodosInspeccionados(nodos_inspeccionados, output_file);
      ImprimirSeparador(output_file);
      output_file << "Final node reached." << std::endl;

      std::vector<Node *> camino;
      Node *actual = destination_node;
      while (actual != nullptr)
      {
        camino.push_back(actual);
        actual = padre[actual];
      }
      std::reverse(camino.begin(), camino.end());

      ImprimirCaminoInfo(camino, output_file);
      return;
    }

    for (auto pair : current_node->getChildren())
    {
      Node *child = pair.first;
      if (visited_nodes.find(child) == visited_nodes.end())
      {
        queue.push(child);
        visited_nodes.insert(child);
        nodos_generados.push_back(child);
        padre[child] = current_node;
      }
    }
    iteracion++;
  }
  output_file << "No se pudo llegar al nodo " << destination_node << " usando BFS.\n";
}

void PrintTraza(std::ofstream &output_file, Node *current_node, std::vector<Node *> &visited_nodes, std::vector<Node *> &path, int iteracion)
{
  path.push_back(current_node);

  output_file << "Iteration " << iteracion << std::endl;
  ImprimirNodosGenerados(path, output_file);
  ImprimirNodosInspeccionados(visited_nodes, output_file);
  ImprimirSeparador(output_file);

}