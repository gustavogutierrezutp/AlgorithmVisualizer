import ELK from 'elkjs/lib/elk.bundled.js';

const elk = new ELK();

/**
 * Automatically layout nodes using ELK's Layered (Sugiyama) algorithm
 * @param {Array} nodes - Array of ReactFlow nodes
 * @param {Array} edges - Array of ReactFlow edges
 * @returns {Promise<Array>} - Array of nodes with updated positions
 */
export async function getAutoLayoutedNodes(nodes, edges) {
  // Filter out pointer nodes - we only want to layout list nodes
  const listNodes = nodes.filter(n => n.type === 'linkedListNode');
  const pointerNodes = nodes.filter(n => n.type !== 'linkedListNode');

  if (listNodes.length === 0) {
    return nodes;
  }

  // Prepare the graph for ELK
  const graph = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '150',
      'elk.layered.spacing.nodeNodeBetweenLayers': '150',
      'elk.spacing.edgeNode': '80',
      'elk.layered.nodePlacement.strategy': 'SIMPLE',
      'elk.layered.wrapping.strategy': 'MULTI_EDGE',
      'elk.layered.wrapping.additionalEdgeSpacing': '20',
    },
    children: listNodes.map(node => ({
      id: node.id,
      width: 72,  // Approximate width of a list node
      height: 72, // Approximate height of a list node
    })),
    edges: edges
      .filter(edge =>
        listNodes.some(n => n.id === edge.source) &&
        listNodes.some(n => n.id === edge.target)
      )
      .map(edge => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
  };

  try {
    const layoutedGraph = await elk.layout(graph);

    // Create a map of layouted positions
    const positionMap = new Map();
    layoutedGraph.children.forEach(node => {
      positionMap.set(node.id, { x: node.x, y: node.y });
    });

    // Update list nodes with new positions
    const updatedListNodes = listNodes.map(node => {
      const position = positionMap.get(node.id);
      if (position) {
        return {
          ...node,
          position: {
            x: position.x,
            y: position.y,
          },
        };
      }
      return node;
    });

    // Update pointer nodes to follow their connected list nodes
    const updatedPointerNodes = pointerNodes.map(pointerNode => {
      // Find the edge that connects this pointer to a list node
      const connectedEdge = edges.find(e => e.source === pointerNode.id);
      if (connectedEdge) {
        const connectedListNode = updatedListNodes.find(n => n.id === connectedEdge.target);
        if (connectedListNode) {
          // Position pointer above the connected list node
          return {
            ...pointerNode,
            position: {
              x: connectedListNode.position.x,
              y: connectedListNode.position.y - 100, // 100px above
            },
          };
        }
      }
      return pointerNode;
    });

    // Combine and return all nodes
    return [...updatedPointerNodes, ...updatedListNodes];
  } catch (error) {
    console.error('Error during ELK layout:', error);
    return nodes;
  }
}
