import React from "react";
import { motion } from "framer-motion";

type DataStructureType = "array" | "vector" | "linkedlist";

interface MemoryVisualizationProps {
  type: DataStructureType;
  data: number[];
  highlightIndices?: number[];
}

const MemoryVisualization: React.FC<MemoryVisualizationProps> = ({
  type = "array",
  data = [12, 34, 8, 25, 45],
  highlightIndices = [],
}) => {
  const renderArray = () => {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Array in Memory</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Arrays store elements in contiguous memory locations
        </p>
        <div className="flex flex-col gap-1">
          <div className="flex">
            {data.map((_, index) => (
              <div
                key={`addr-${index}`}
                className="w-16 h-8 flex items-center justify-center text-xs text-muted-foreground border-b border-dashed border-gray-300"
              >
                0x{(0x1000 + index * 4).toString(16).toUpperCase()}
              </div>
            ))}
          </div>
          <div className="flex">
            {data.map((value, index) => (
              <motion.div
                key={`val-${index}`}
                className={`w-16 h-12 flex items-center justify-center border ${highlightIndices.includes(index) ? "border-yellow-500 bg-yellow-50" : "border-gray-300"}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {value}
              </motion.div>
            ))}
          </div>
          <div className="flex">
            {data.map((_, index) => (
              <div
                key={`idx-${index}`}
                className="w-16 h-8 flex items-center justify-center text-xs font-mono mt-1"
              >
                index: {index}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 text-sm">
          <p>Memory characteristics:</p>
          <ul className="list-disc list-inside">
            <li>Fixed size allocated at compile time</li>
            <li>Direct access to any element (O(1))</li>
            <li>Elements stored in contiguous memory</li>
            <li>Memory allocated on stack (unless dynamically created)</li>
          </ul>
        </div>
      </div>
    );
  };

  const renderVector = () => {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Vector in Memory</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Vectors use dynamic arrays with reserved capacity
        </p>
        <div className="flex flex-col gap-1">
          <div className="flex">
            {data.map((_, index) => (
              <div
                key={`addr-${index}`}
                className="w-16 h-8 flex items-center justify-center text-xs text-muted-foreground border-b border-dashed border-gray-300"
              >
                0x{(0x2000 + index * 4).toString(16).toUpperCase()}
              </div>
            ))}
            {/* Show reserved capacity */}
            {[...Array(3)].map((_, index) => (
              <div
                key={`reserved-${index}`}
                className="w-16 h-8 flex items-center justify-center text-xs text-muted-foreground border-b border-dashed border-gray-300 opacity-50"
              >
                0x
                {(0x2000 + (data.length + index) * 4)
                  .toString(16)
                  .toUpperCase()}
              </div>
            ))}
          </div>
          <div className="flex">
            {data.map((value, index) => (
              <motion.div
                key={`val-${index}`}
                className={`w-16 h-12 flex items-center justify-center border ${highlightIndices.includes(index) ? "border-yellow-500 bg-yellow-50" : "border-gray-300"}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {value}
              </motion.div>
            ))}
            {/* Reserved capacity cells */}
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={`reserved-val-${index}`}
                className="w-16 h-12 flex items-center justify-center border border-dashed border-gray-200 bg-gray-50"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 0.5, y: 0 }}
                transition={{ delay: (data.length + index) * 0.1 }}
              >
                <span className="text-gray-300">—</span>
              </motion.div>
            ))}
          </div>
          <div className="flex">
            {data.map((_, index) => (
              <div
                key={`idx-${index}`}
                className="w-16 h-8 flex items-center justify-center text-xs font-mono mt-1"
              >
                index: {index}
              </div>
            ))}
            {/* Reserved capacity indices */}
            {[...Array(3)].map((_, index) => (
              <div
                key={`reserved-idx-${index}`}
                className="w-16 h-8 flex items-center justify-center text-xs font-mono mt-1 text-gray-300"
              >
                (reserved)
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 text-sm">
          <p>Memory characteristics:</p>
          <ul className="list-disc list-inside">
            <li>Dynamic size with automatic resizing</li>
            <li>Direct access to any element (O(1))</li>
            <li>Elements stored in contiguous memory</li>
            <li>Memory allocated on heap with extra capacity</li>
            <li>
              Size: {data.length}, Capacity: {data.length + 3}
            </li>
          </ul>
        </div>
      </div>
    );
  };

  const renderLinkedList = () => {
    return (
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-semibold mb-2">Linked List in Memory</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Linked lists store elements in nodes scattered throughout memory
        </p>
        <div className="flex flex-col gap-6">
          {/* Nodes scattered in memory */}
          <div className="flex flex-wrap gap-4 justify-center">
            {data.map((value, index) => {
              // Generate random-ish memory addresses to simulate non-contiguous allocation
              const baseAddr = 0x8000;
              const offset = (index * 20 + Math.floor(Math.random() * 100)) * 4;
              const addr = baseAddr + offset;

              return (
                <motion.div
                  key={`node-${index}`}
                  className={`flex flex-col w-24 ${highlightIndices.includes(index) ? "border-2 border-yellow-500" : ""}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="text-xs text-muted-foreground text-center mb-1">
                    0x{addr.toString(16).toUpperCase()}
                  </div>
                  <div className="flex flex-col border border-gray-300 rounded">
                    <div className="p-2 border-b border-gray-300 bg-blue-50 text-center">
                      {value}
                    </div>
                    <div className="p-2 bg-gray-50 text-xs text-center">
                      {index < data.length - 1 ? (
                        <>
                          Next: 0x
                          {(
                            baseAddr +
                            ((index + 1) * 20 +
                              Math.floor(Math.random() * 100)) *
                              4
                          )
                            .toString(16)
                            .toUpperCase()}
                        </>
                      ) : (
                        <>Next: NULL</>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Visual linked list representation */}
          <div className="flex items-center justify-center mt-4">
            {data.map((value, index) => (
              <React.Fragment key={`link-${index}`}>
                <motion.div
                  className={`flex flex-col items-center justify-center w-16 h-16 rounded-full border ${highlightIndices.includes(index) ? "border-yellow-500 bg-yellow-50" : "border-gray-300 bg-white"}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <div className="text-sm">{value}</div>
                  <div className="text-xs text-gray-500">Node {index}</div>
                </motion.div>
                {index < data.length - 1 && (
                  <motion.div
                    className="w-8 h-0.5 bg-gray-400 flex items-center justify-center"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 32 }}
                    transition={{ delay: index * 0.2 + 0.1 }}
                  >
                    <div className="absolute">
                      <svg
                        height="10"
                        width="10"
                        className="fill-gray-400"
                        style={{ transform: "translateX(15px)" }}
                      >
                        <polygon points="0,0 10,5 0,10" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="mt-4 text-sm">
          <p>Memory characteristics:</p>
          <ul className="list-disc list-inside">
            <li>Dynamic size with no pre-allocation needed</li>
            <li>Sequential access only (O(n) to find element)</li>
            <li>Elements scattered throughout memory</li>
            <li>Each node contains data and a pointer to the next node</li>
            <li>Memory allocated on heap for each node individually</li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6 text-center">
        Memory Visualization
      </h2>
      <div className="grid grid-cols-1 gap-8">
        {type === "array" && renderArray()}
        {type === "vector" && renderVector()}
        {type === "linkedlist" && renderLinkedList()}
      </div>
    </div>
  );
};

export default MemoryVisualization;
