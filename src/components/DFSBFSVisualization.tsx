import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

type Node = {
  id: number;
  label: string;
  neighbors: number[];
  x?: number;
  y?: number;
};

type Graph = {
  nodes: Node[];
};

type VisitedState = {
  nodeId: number;
  layer: number;
  parent?: number;
  order: number; // Track the order in which nodes are visited
};

type Arrow = {
  from: number;
  to: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

type DFSBFSVisualizationProps = {
  graph?: Graph;
  algorithm: "dfs" | "bfs";
  isRunning: boolean;
  onReset: () => void;
};

const defaultGraph: Graph = {
  nodes: [
    { id: 0, label: "A", neighbors: [1, 2, 3] },
    { id: 1, label: "B", neighbors: [0, 4, 5] },
    { id: 2, label: "C", neighbors: [0, 6] },
    { id: 3, label: "D", neighbors: [0, 7] },
    { id: 4, label: "E", neighbors: [1] },
    { id: 5, label: "F", neighbors: [1] },
    { id: 6, label: "G", neighbors: [2] },
    { id: 7, label: "H", neighbors: [3] },
  ],
};

const DFSBFSVisualization: React.FC<DFSBFSVisualizationProps> = ({
  graph = defaultGraph,
  algorithm,
  isRunning,
  onReset,
}) => {
  const [visited, setVisited] = useState<VisitedState[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [traversalSteps, setTraversalSteps] = useState<VisitedState[][]>([]);
  const [maxLayer, setMaxLayer] = useState<number>(0);
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const nodeRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [nodePositions, setNodePositions] = useState<
    Map<number, { x: number; y: number }>
  >(new Map());

  // Generate traversal steps when algorithm changes
  useEffect(() => {
    generateTraversalSteps();
  }, [algorithm, graph]);

  // Handle animation steps
  useEffect(() => {
    if (isRunning && traversalSteps.length > 0) {
      if (currentStep < traversalSteps.length) {
        const timer = setTimeout(() => {
          setVisited(traversalSteps[currentStep]);
          setCurrentStep(currentStep + 1);

          // Update arrows based on the current step
          if (currentStep > 0) {
            updateArrows(traversalSteps[currentStep]);
          }
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [isRunning, currentStep, traversalSteps]);

  // Update node positions after render
  useEffect(() => {
    const newPositions = new Map<number, { x: number; y: number }>();
    nodeRefs.current.forEach((element, nodeId) => {
      if (element) {
        const rect = element.getBoundingClientRect();
        newPositions.set(nodeId, {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    });
    setNodePositions(newPositions);
  }, [visited]);

  // Update arrows when node positions change
  useEffect(() => {
    if (visited.length > 0) {
      updateArrows(visited);
    }
  }, [nodePositions]);

  const updateArrows = (currentVisited: VisitedState[]) => {
    const newArrows: Arrow[] = [];

    currentVisited.forEach((node) => {
      if (node.parent !== undefined) {
        const fromPos = nodePositions.get(node.parent);
        const toPos = nodePositions.get(node.nodeId);

        if (fromPos && toPos) {
          newArrows.push({
            from: node.parent,
            to: node.nodeId,
            fromX: fromPos.x,
            fromY: fromPos.y,
            toX: toPos.x,
            toY: toPos.y,
          });
        }
      }
    });

    setArrows(newArrows);
  };

  const generateTraversalSteps = () => {
    setCurrentStep(0);
    setVisited([]);
    setArrows([]);

    const steps: VisitedState[][] = [];

    if (algorithm === "bfs") {
      // BFS Implementation
      const queue: number[] = [0]; // Start from node 0
      const visited: Map<number, VisitedState> = new Map();
      visited.set(0, { nodeId: 0, layer: 0, order: 0 });

      steps.push([{ nodeId: 0, layer: 0, order: 0 }]);

      let maxLayerFound = 0;
      let visitOrder = 1;

      while (queue.length > 0) {
        const current = queue.shift()!;
        const currentState = visited.get(current)!;
        const currentLayer = currentState.layer;

        maxLayerFound = Math.max(maxLayerFound, currentLayer);

        const node = graph.nodes.find((n) => n.id === current)!;

        // Sort neighbors to ensure consistent traversal order
        const sortedNeighbors = [...node.neighbors].sort((a, b) => {
          const nodeA = graph.nodes.find((n) => n.id === a)!;
          const nodeB = graph.nodes.find((n) => n.id === b)!;
          return nodeA.label.localeCompare(nodeB.label);
        });

        for (const neighborId of sortedNeighbors) {
          if (!visited.has(neighborId)) {
            visited.set(neighborId, {
              nodeId: neighborId,
              layer: currentLayer + 1,
              parent: current,
              order: visitOrder++,
            });
            queue.push(neighborId);

            // Create a new step by copying all previously visited nodes and adding the new one
            const newStep = Array.from(visited.values());
            steps.push(newStep);
          }
        }
      }

      setMaxLayer(maxLayerFound);
    } else {
      // DFS Implementation
      const stack: number[] = [0]; // Start from node 0
      const visited: Map<number, VisitedState> = new Map();
      visited.set(0, { nodeId: 0, layer: 0, order: 0 });

      steps.push([{ nodeId: 0, layer: 0, order: 0 }]);

      let maxLayerFound = 0;
      let visitOrder = 1;

      while (stack.length > 0) {
        const current = stack.pop()!;
        const currentState = visited.get(current)!;
        const currentLayer = currentState.layer;

        maxLayerFound = Math.max(maxLayerFound, currentLayer);

        const node = graph.nodes.find((n) => n.id === current)!;

        // Sort neighbors to ensure consistent traversal order (alphabetically)
        const sortedNeighbors = [...node.neighbors]
          .filter((id) => !visited.has(id)) // Only consider unvisited neighbors
          .sort((a, b) => {
            const nodeA = graph.nodes.find((n) => n.id === a)!;
            const nodeB = graph.nodes.find((n) => n.id === b)!;
            return nodeA.label.localeCompare(nodeB.label);
          });

        // Process neighbors in reverse for DFS (stack behavior)
        for (let i = sortedNeighbors.length - 1; i >= 0; i--) {
          const neighborId = sortedNeighbors[i];
          if (!visited.has(neighborId)) {
            visited.set(neighborId, {
              nodeId: neighborId,
              layer: currentLayer + 1,
              parent: current,
              order: visitOrder++,
            });
            stack.push(neighborId);

            // Create a new step by copying all previously visited nodes and adding the new one
            const newStep = Array.from(visited.values());
            steps.push(newStep);
          }
        }
      }

      setMaxLayer(maxLayerFound);
    }

    setTraversalSteps(steps);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setVisited([]);
    setArrows([]);
    onReset();
  };

  // Group nodes by layer for vertical display
  const nodesByLayer = Array.from({ length: maxLayer + 1 }, () => []);
  visited.forEach((node) => {
    nodesByLayer[node.layer].push(node);
  });

  // Sort nodes within each layer by their visit order
  nodesByLayer.forEach((layer) => {
    layer.sort((a, b) => a.order - b.order);
  });

  // Draw an SVG arrow between two points
  const drawArrow = (arrow: Arrow) => {
    const dx = arrow.toX - arrow.fromX;
    const dy = arrow.toY - arrow.fromY;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

    // Calculate the distance between points
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Adjust start and end points to begin and end at the edge of the circles
    const nodeRadius = 24; // Diameter of node is 48px (w-12 h-12)
    const startDistance = nodeRadius / 2;
    const endDistance = nodeRadius / 2;

    const startX = arrow.fromX + (startDistance * dx) / distance;
    const startY = arrow.fromY + (startDistance * dy) / distance;
    const endX = arrow.toX - (endDistance * dx) / distance;
    const endY = arrow.toY - (endDistance * dy) / distance;

    return (
      <g key={`${arrow.from}-${arrow.to}`}>
        <defs>
          <marker
            id={`arrowhead-${arrow.from}-${arrow.to}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#4B5563" />
          </marker>
        </defs>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#4B5563"
          strokeWidth="2"
          markerEnd={`url(#arrowhead-${arrow.from}-${arrow.to})`}
        />
      </g>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          {algorithm.toUpperCase()} Traversal - Step {currentStep} of{" "}
          {traversalSteps.length}
        </h3>
        <p className="text-sm text-gray-600">
          {algorithm === "bfs"
            ? "Breadth-First Search traverses level by level using a queue"
            : "Depth-First Search explores as far as possible along each branch using a stack"}
        </p>
      </div>

      <div className="flex flex-col space-y-8 relative">
        {/* SVG overlay for arrows */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 10 }}
        >
          {arrows.map((arrow) => drawArrow(arrow))}
        </svg>

        {nodesByLayer.map((layerNodes, layerIndex) => (
          <div key={layerIndex} className="flex flex-col items-center">
            <div className="text-sm font-medium text-gray-500 mb-2">
              Layer {layerIndex}
            </div>
            <div className="flex justify-center space-x-6">
              {layerNodes.map((node) => {
                const graphNode = graph.nodes.find(
                  (n) => n.id === node.nodeId,
                )!;
                return (
                  <motion.div
                    key={node.nodeId}
                    ref={(el) => {
                      if (el) nodeRefs.current.set(node.nodeId, el);
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center relative"
                  >
                    <span className="font-bold">{graphNode.label}</span>
                    <div className="absolute -top-8 text-xs text-gray-500">
                      Visit #{node.order + 1}
                    </div>
                    {node.parent !== undefined && (
                      <div className="absolute -bottom-8 text-xs text-gray-500">
                        From:{" "}
                        {graph.nodes.find((n) => n.id === node.parent)?.label}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium"
        >
          Reset
        </button>
      </div>

      {/* Real-world use cases section */}
      <div className="mt-8 border-t pt-4">
        <h4 className="text-md font-semibold mb-2">Real-World Applications</h4>
        {algorithm === "bfs" ? (
          <div className="text-sm text-gray-700">
            <p className="mb-2">
              <strong>BFS Real-World Use Cases:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Shortest Path Finding:</strong> Used in GPS navigation
                systems to find the shortest route between locations
              </li>
              <li>
                <strong>Social Network Friend Suggestions:</strong> Finding
                people within a certain degree of connection
              </li>
              <li>
                <strong>Web Crawlers:</strong> Indexing web pages level by level
                from a starting page
              </li>
              <li>
                <strong>Network Broadcasting:</strong> Efficiently sending
                information to all nodes in a network
              </li>
              <li>
                <strong>Puzzle Solving:</strong> Finding the minimum number of
                moves to solve puzzles like Rubik's cube
              </li>
            </ul>
          </div>
        ) : (
          <div className="text-sm text-gray-700">
            <p className="mb-2">
              <strong>DFS Real-World Use Cases:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Maze Generation and Solving:</strong> Creating and
                navigating through complex mazes
              </li>
              <li>
                <strong>Topological Sorting:</strong> Scheduling tasks with
                dependencies (e.g., course prerequisites)
              </li>
              <li>
                <strong>Detecting Cycles:</strong> Finding circular dependencies
                in systems
              </li>
              <li>
                <strong>Path Finding in Games:</strong> AI decision making in
                strategy games
              </li>
              <li>
                <strong>Strongly Connected Components:</strong> Analyzing
                connectivity in directed graphs like web pages
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DFSBFSVisualization;
