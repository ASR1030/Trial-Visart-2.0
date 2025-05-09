import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface StackVisualizationProps {
  initialData?: number[];
  highlightIndices?: number[];
}

const StackVisualization: React.FC<StackVisualizationProps> = ({
  initialData = [45, 25, 8, 34],
  highlightIndices = [],
}) => {
  const [stack, setStack] = useState<number[]>([...initialData]);
  const [newValue, setNewValue] = useState<string>("");
  const [operation, setOperation] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handlePush = () => {
    const value = parseInt(newValue);
    if (isNaN(value)) {
      setMessage("Please enter a valid number");
      return;
    }

    setOperation("push");
    setStack([value, ...stack]);
    setNewValue("");
    setMessage(`Pushed ${value} onto the stack`);

    // Reset operation after animation
    setTimeout(() => setOperation(""), 1000);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setMessage("Cannot pop from an empty stack");
      return;
    }

    setOperation("pop");
    const poppedValue = stack[0];

    // Delay the actual removal to show the animation
    setTimeout(() => {
      setStack(stack.slice(1));
      setMessage(`Popped ${poppedValue} from the stack`);
      setOperation("");
    }, 800);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty, nothing to peek");
      return;
    }

    setOperation("peek");
    setMessage(`Peek: Top element is ${stack[0]}`);

    // Reset operation after animation
    setTimeout(() => setOperation(""), 1000);
  };

  const handleClear = () => {
    setStack([]);
    setMessage("Stack cleared");
  };

  return (
    <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2">Stack Data Structure</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Stack follows Last-In-First-Out (LIFO) principle
      </p>

      <div className="flex gap-4 mb-6">
        <div className="flex">
          <Input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter a number"
            className="w-32"
          />
          <Button onClick={handlePush} className="ml-2">
            Push
          </Button>
        </div>
        <Button onClick={handlePop} variant="outline">
          Pop
        </Button>
        <Button onClick={handlePeek} variant="outline">
          Peek
        </Button>
        <Button
          onClick={handleClear}
          variant="outline"
          className="bg-red-50 text-red-600 hover:bg-red-100"
        >
          Clear
        </Button>
      </div>

      {message && (
        <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded-md w-full max-w-md text-center">
          {message}
        </div>
      )}

      <div className="flex flex-col items-center mb-6">
        <div className="w-64 h-8 border-t-2 border-l-2 border-r-2 border-gray-400 bg-gray-50 flex items-center justify-center text-sm text-gray-500">
          Top of Stack
        </div>

        <div className="relative w-64 border-l-2 border-r-2 border-gray-400 bg-gray-50">
          {stack.length === 0 && (
            <div className="h-32 flex items-center justify-center text-gray-400">
              Empty Stack
            </div>
          )}

          {stack.map((value, index) => (
            <motion.div
              key={`${value}-${index}`}
              className={`w-full h-16 border-b-2 border-gray-300 flex items-center justify-center ${highlightIndices.includes(index) ? "bg-yellow-50" : "bg-white"} ${operation === "push" && index === 0 ? "bg-green-100" : ""} ${operation === "pop" && index === 0 ? "bg-red-100" : ""} ${operation === "peek" && index === 0 ? "bg-blue-100" : ""}`}
              initial={
                index === 0 && operation === "push"
                  ? { opacity: 0, y: -20 }
                  : { opacity: 1 }
              }
              animate={{ opacity: 1, y: 0 }}
              exit={
                index === 0 && operation === "pop"
                  ? { opacity: 0, y: -20 }
                  : { opacity: 1 }
              }
              transition={{ duration: 0.5 }}
            >
              <div className="text-lg font-mono">{value}</div>
              <div className="absolute left-full ml-2 text-xs text-gray-500">
                {index === 0 ? "← Top" : `index: ${index}`}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="w-64 h-8 border-b-2 border-l-2 border-r-2 border-gray-400 bg-gray-50 flex items-center justify-center text-sm text-gray-500">
          Bottom of Stack
        </div>
      </div>

      <div className="mt-4 text-sm w-full max-w-md">
        <p>Stack operations:</p>
        <ul className="list-disc list-inside">
          <li>
            <strong>Push:</strong> Add an element to the top (O(1))
          </li>
          <li>
            <strong>Pop:</strong> Remove the top element (O(1))
          </li>
          <li>
            <strong>Peek:</strong> View the top element without removing it
            (O(1))
          </li>
          <li>
            <strong>isEmpty:</strong> Check if stack has no elements
          </li>
        </ul>
        <p className="mt-2">Memory characteristics:</p>
        <ul className="list-disc list-inside">
          <li>Elements are added and removed from the same end</li>
          <li>Last-In-First-Out (LIFO) principle</li>
          <li>All operations have O(1) time complexity</li>
          <li>Memory can be implemented using arrays or linked lists</li>
        </ul>
      </div>
    </div>
  );
};

export default StackVisualization;
