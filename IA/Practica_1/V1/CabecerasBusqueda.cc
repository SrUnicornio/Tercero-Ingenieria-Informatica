#include "CabecerasBusqueda.h"

void PerformSearches(Node *nodes[], int originNode, int destinationNode, int numNodes, int edges)
{
  try
  {
    std::cout << "Seleccione el tipo de búsqueda a realizar:\n";
    std::cout << "0. Salir\n";
    std::cout << "1. DFS\n";
    std::cout << "2. BFS sin memoria\n";
    std::cout << "3. BFS\n";
    std::cout << "4. DFS iterativo\n";
    std::cout << "5. Solo BFS\n";
    std::cout << "6. Solo DFS\n";
    std::cout << "7. Todos\n";

    int searchType{0};
    std::cin >> searchType;
    ChooseSearch(nodes, originNode, destinationNode, numNodes, edges, searchType);
  }
  catch (const NodoInexistenteException &e)
  {
    std::cerr << e.what() << std::endl;
    throw;
  }
}

void ChooseSearch(Node *nodes[], int originNode, int destinationNode, int numNodes, int edges, int searchType)
{
  switch (searchType)
  {
  case 0:
    std::cout << "Saliendo del programa.\n";
    break;
  case 1:
  { // DFS
    std::vector<Node *> visitedNodesDFS;
    std::vector<Node *> pathDFS;
    std::ofstream dfs_output("DFS_Output.txt");
    PrintDFSHeader(dfs_output, numNodes, edges, originNode, destinationNode);
    DFS(dfs_output, nodes, nodes[originNode - 1], visitedNodesDFS, pathDFS, nodes[destinationNode - 1]);
    dfs_output.close();
    std::cout << "DFS completado. Salida en DFS_Output.txt.\n";
    break;
  }
  case 2:
  { // BFS sin memoria
    std::ofstream bfs_output("BFS-sin-memoria_Output.txt");
    PrintBFSHeader(bfs_output, numNodes, edges, originNode, destinationNode);
    BFS_sin_memoria(nodes[originNode - 1], nodes[destinationNode - 1], bfs_output);
    bfs_output.close();
    std::cout << "BFS completado. Salida en BFS-sin-memoria_Output.txt.\n";
    break;
  }
  case 3:
  { // BFS
    std::vector<Node *> visitedNodesBFS;
    std::vector<Node *> pathBFS;
    std::ofstream bfs_output2("BFS_Output.txt");
    PrintBFSHeader(bfs_output2, numNodes, edges, originNode, destinationNode);
    BFS(nodes[originNode - 1], nodes[destinationNode - 1], bfs_output2);
    bfs_output2.close();
    std::cout << "BFS completado. Salida en BFS_Output.txt.\n";
    break;
  }
  case 4:
  { // DFS iterativo
    std::vector<Node *> visitedNodesDFSIter;
    std::vector<Node *> pathDFSIter;
    std::ofstream dfs_output("DFS_Iterativo_Output.txt");
    PrintDFSHeader(dfs_output, numNodes, edges, originNode, destinationNode);
    DFS_Iterativo(dfs_output, nodes[originNode - 1], visitedNodesDFSIter, nodes[destinationNode - 1]);
    dfs_output.close();
    std::cout << "DFS iterativo completado. Salida en DFS_Iterativo_Output.txt.\n";
    break;
  }
  case 5:
  { // Solo BFS
    std::ofstream bfs_output("BFS_Output.txt");
    PrintBFSHeader(bfs_output, numNodes, edges, originNode, destinationNode);
    BFS(nodes[originNode - 1], nodes[destinationNode - 1], bfs_output);
    bfs_output.close();
    std::cout << "BFS completado. Salida en BFS_Output.txt.\n";
    bfs_output.open("BFS-sin-memoria_Output.txt");
    PrintBFSHeader(bfs_output, numNodes, edges, originNode, destinationNode);
    BFS_sin_memoria(nodes[originNode - 1], nodes[destinationNode - 1], bfs_output);
    bfs_output.close();
    std::cout << "BFS sin memoria completado. Salida en BFS-sin-memoria_Output.txt.\n";
    break;
  }
  case 6:
  { // Solo DFS
    std::ofstream dfs_output("DFS_Output.txt");
    std::vector<Node *> visitedNodesDFS2;
    std::vector<Node *> pathDFS2;
    PrintDFSHeader(dfs_output, numNodes, edges, originNode, destinationNode);
    DFS(dfs_output, nodes, nodes[originNode - 1], visitedNodesDFS2, pathDFS2, nodes[destinationNode - 1]);
    dfs_output.close();
    std::cout << "DFS completado. Salida en DFS_Output.txt.\n";

    dfs_output.open("DFS_Iterativo_Output.txt");
    visitedNodesDFS2.clear();
    pathDFS2.clear();
    PrintDFSHeader(dfs_output, numNodes, edges, originNode, destinationNode);
    DFS_Iterativo(dfs_output, nodes[originNode - 1], visitedNodesDFS2, nodes[destinationNode - 1]);
    dfs_output.close();
    std::cout << "DFS iterativo completado. Salida en DFS_Iterativo_Output.txt.\n";
    break;
  }
  case 7:
  { // Todos
    std::vector<Node *> visitedNodesDFS;
    std::vector<Node *> pathDFS;
    std::ofstream dfs_output("DFS_Output.txt");
    PrintDFSHeader(dfs_output, numNodes, edges, originNode, destinationNode);
    DFS(dfs_output, nodes, nodes[originNode - 1], visitedNodesDFS, pathDFS, nodes[destinationNode - 1]);
    dfs_output.close();
    std::cout << "DFS completado. Salida en DFS_Output.txt.\n";

    std::ofstream bfs_output("BFS-sin-memoria_Output.txt");
    PrintBFSHeader(bfs_output, numNodes, edges, originNode, destinationNode);
    BFS_sin_memoria(nodes[originNode - 1], nodes[destinationNode - 1], bfs_output);
    bfs_output.close();
    std::cout << "BFS sin memoria completado. Salida en BFS-sin-memoria_Output.txt.\n";

    bfs_output.open("BFS_Output.txt");
    PrintBFSHeader(bfs_output, numNodes, edges, originNode, destinationNode);
    BFS(nodes[originNode - 1], nodes[destinationNode - 1], bfs_output);
    bfs_output.close();
    std::cout << "BFS completado. Salida en BFS_Output.txt.\n";

    dfs_output.open("DFS_Iterativo_Output.txt");
    std::vector<Node *> visitedNodesDFSIter;
    PrintDFSHeader(dfs_output, numNodes, edges, originNode, destinationNode);
    DFS_Iterativo(dfs_output, nodes[originNode - 1], visitedNodesDFSIter, nodes[destinationNode - 1]);
    dfs_output.close();
    std::cout << "DFS iterativo completado. Salida en DFS_Iterativo_Output.txt.\n";
    break;
  }

  default:
    std::cerr << "Error: Tipo de búsqueda no válido.\n";
    break;
  }
}

void PrintDFSHeader(std::ofstream &output_file, int numNodes, int edges, int originNode, int destinationNode)
{
  output_file << "Búsqueda en profundidad (DFS)\n";
  output_file << "Número de nodos: " << numNodes << std::endl;
  output_file << "Número de aristas: " << edges << std::endl;
  output_file << "Vértice origen: " << originNode << std::endl;
  output_file << "Vértice destino: " << destinationNode << std::endl;
  ImprimirSeparador(output_file);
}

void PrintBFSHeader(std::ofstream &output_file, int numNodes, int edges, int originNode, int destinationNode)
{
  output_file << "Búsqueda en anchura (BFS)\n";
  output_file << "Número de nodos: " << numNodes << std::endl;
  output_file << "Número de aristas: " << edges << std::endl;
  output_file << "Vértice origen: " << originNode << std::endl;
  output_file << "Vértice destino: " << destinationNode << std::endl;
  ImprimirSeparador(output_file);
}