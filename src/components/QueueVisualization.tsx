import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";

interface QueueVisualizationProps {
  initialData?: number[];
  highlightIndices?: number[];
}

const QueueVisualization: React.FC<QueueVisualizationProps> = ({
  initialData = [],
  highlightIndices = [],
}) => {
  const [queue, setQueue] = useState<number[]>(initialData);
  const [inputValue, setInputValue] = useState<string>("");
  const [operation, setOperation] = useState<string>("");
  const [operationResult, setOperationResult] = useState<string | null>(null);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleEnqueue = () => {
    const value = parseInt(inputValue);
    if (!isNaN(value)) {
      setOperation("enqueue");
      setQueue([...queue, value]);
      setInputValue("");
      setOperationResult(`Enqueued ${value}`);
      setAnimatingIndex(queue.length);
      setTimeout(() => setAnimatingIndex(null), 1000);
    }
  };

  const handleDequeue = () => {
    if (queue.length > 0) {
      setOperation("dequeue");
      setAnimatingIndex(0);
      const dequeuedValue = queue[0];
      setTimeout(() => {
        setQueue(queue.slice(1));
        setOperationResult(`Dequeued ${dequeuedValue}`);
        setAnimatingIndex(null);
      }, 1000);
    } else {
      setOperationResult("Queue is empty");
    }
  };

  const handlePeek = () => {
    if (queue.length > 0) {
      setOperation("peek");
      setAnimatingIndex(0);
      setOperationResult(`Front element is ${queue[0]}`);
      setTimeout(() => setAnimatingIndex(null), 1000);
    } else {
      setOperationResult("Queue is empty");
    }
  };

  const handleClear = () => {
    setQueue([]);
    setOperation("clear");
    setOperationResult("Queue cleared");
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter a number"
            className="w-40"
          />
          <Button onClick={handleEnqueue} variant="outline">
            Enqueue
          </Button>
          <Button onClick={handleDequeue} variant="outline">
            Dequeue
          </Button>
          <Button onClick={handlePeek} variant="outline">
            Peek
          </Button>
          <Button onClick={handleClear} variant="outline">
            Clear
          </Button>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">Queue (FIFO)</h3>
          <div className="flex items-center gap-1 h-16 relative overflow-x-auto p-2">
            {queue.length === 0 ? (
              <div className="text-gray-400 italic">Queue is empty</div>
            ) : (
              <AnimatePresence>
                {queue.map((item, index) => (
                  <motion.div
                    key={`${index}-${item}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      backgroundColor:
                        animatingIndex === index
                          ? operation === "enqueue"
                            ? "#4ade80" // green for enqueue
                            : operation === "dequeue" || operation === "peek"
                              ? "#fb923c" // orange for dequeue/peek
                              : "#f1f5f9"
                          : highlightIndices.includes(index)
                            ? "#93c5fd" // blue for highlighted
                            : "#f1f5f9",
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center justify-center min-w-12 h-12 border border-gray-300 rounded-md shadow-sm"
                  >
                    <div className="text-sm font-medium">{item}</div>
                    <div className="text-xs text-gray-500">
                      {index === 0
                        ? "Front"
                        : index === queue.length - 1
                          ? "Rear"
                          : ""}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {operationResult && (
          <div className="mt-2 text-sm">
            <span className="font-medium">Result:</span> {operationResult}
          </div>
        )}

        <div className="mt-4 text-sm">
          <h3 className="font-medium mb-1">Queue Operations:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <span className="font-medium">Enqueue:</span> Add an element to
              the rear (O(1))
            </li>
            <li>
              <span className="font-medium">Dequeue:</span> Remove the front
              element (O(1))
            </li>
            <li>
              <span className="font-medium">Peek:</span> View the front element
              without removing it (O(1))
            </li>
            <li>
              <span className="font-medium">isEmpty:</span> Check if queue has
              no elements (O(1))
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QueueVisualization;
