import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { isMergeSortStep, MergeSortStep } from "../utils/sortingAlgorithms";

interface SortingVisualizerProps {
  array?: number[];
  algorithm?: string;
  isRunning?: boolean;
  isPaused?: boolean;
  speed?: number;
  onSortingComplete?: () => void;
  highlightIndices?: number[];
  compareIndices?: number[];
  swapIndices?: number[];
  currentStep?: MergeSortStep;
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
  array = [12, 34, 8, 25, 45, 30, 15, 20, 38, 5],
  algorithm = "bubble",
  isRunning = false,
  isPaused = false,
  speed = 50,
  onSortingComplete = () => {},
  highlightIndices = [],
  compareIndices = [],
  swapIndices = [],
  currentStep,
}) => {
  const [displayArray, setDisplayArray] = useState<number[]>(array);
  const [maxValue, setMaxValue] = useState<number>(Math.max(...array));
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset display array when input array changes
  useEffect(() => {
    setDisplayArray([...array]);
    setMaxValue(Math.max(...array));
  }, [array]);

  // Clean up any running animations when component unmounts
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Get color for array bar based on its indices
  const getBarColor = (index: number) => {
    if (swapIndices.includes(index)) return "bg-red-500";
    if (compareIndices.includes(index)) return "bg-yellow-400";
    if (highlightIndices.includes(index)) return "bg-green-500";
    return "bg-blue-500";
  };

  // Render merge sort visualization
  const renderMergeSortVisualization = () => {
    if (
      !currentStep ||
      !isMergeSortStep(currentStep) ||
      !currentStep.treeSteps
    ) {
      return null;
    }

    // Group tree steps by level
    const stepsByLevel: Record<number, typeof currentStep.treeSteps> = {};
    currentStep.treeSteps.forEach((step) => {
      if (!stepsByLevel[step.level]) {
        stepsByLevel[step.level] = [];
      }
      stepsByLevel[step.level].push(step);
    });

    // Get max level for spacing
    const maxLevel = Math.max(...Object.keys(stepsByLevel).map(Number));

    return (
      <div className="flex-1 flex flex-col items-center justify-start gap-8 overflow-auto p-4">
        {Object.entries(stepsByLevel).map(([level, steps]) => {
          const levelNum = parseInt(level);
          return (
            <div key={level} className="w-full flex flex-col items-center">
              <div className="text-sm font-medium text-gray-500 mb-2">
                {levelNum === 0
                  ? "Original Array"
                  : levelNum === maxLevel
                    ? "Individual Elements"
                    : `Level ${levelNum}`}
              </div>
              <div className="flex justify-center gap-4 w-full">
                {steps.map((step, idx) => {
                  const width = 100 / Math.pow(2, levelNum);
                  const subArray = array.slice(step.start, step.end + 1);

                  if (step.isMerging) {
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center border border-gray-200 rounded-md p-2 bg-white shadow-sm"
                        style={{ width: `${width}%`, minWidth: "120px" }}
                      >
                        {step.leftArray && step.rightArray && (
                          <div className="flex flex-col gap-2 w-full">
                            <div className="flex gap-1 justify-center">
                              {step.leftArray.map((val, i) => (
                                <div
                                  key={`left-${i}`}
                                  className="bg-blue-200 rounded px-2 py-1 text-xs"
                                >
                                  {val}
                                </div>
                              ))}
                              <div className="px-1">+</div>
                              {step.rightArray.map((val, i) => (
                                <div
                                  key={`right-${i}`}
                                  className="bg-blue-200 rounded px-2 py-1 text-xs"
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                            <div className="w-full border-t border-gray-200 my-1"></div>
                            <div className="flex gap-1 justify-center">
                              {step.mergedArray &&
                                step.mergedArray.map((val, i) => (
                                  <div
                                    key={`merged-${i}`}
                                    className="bg-green-500 rounded px-2 py-1 text-xs text-white"
                                  >
                                    {val}
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                        {!step.leftArray &&
                          !step.rightArray &&
                          step.mergedArray && (
                            <div className="flex gap-1 justify-center">
                              {step.mergedArray.map((val, i) => (
                                <div
                                  key={`final-${i}`}
                                  className="bg-green-500 rounded px-2 py-1 text-xs text-white"
                                >
                                  {val}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="flex justify-center border border-gray-200 rounded-md p-2 bg-white shadow-sm"
                      style={{ width: `${width}%`, minWidth: "80px" }}
                    >
                      <div className="flex gap-1 justify-center">
                        {subArray.map((val, i) => (
                          <div
                            key={`sub-${i}`}
                            className="bg-blue-500 rounded px-2 py-1 text-xs text-white"
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render standard bar visualization
  const renderBarVisualization = () => {
    return (
      <div className="flex-1 flex items-end justify-center gap-1 mb-4 overflow-hidden">
        {displayArray.map((value, index) => {
          const height = `${(value / maxValue) * 100}%`;
          const barColor = getBarColor(index);

          return (
            <motion.div
              key={`${index}-${value}`}
              className={`${barColor} rounded-t-md w-full`}
              style={{ height }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: index * 0.03,
              }}
              layout
            >
              {displayArray.length <= 20 && (
                <div className="text-xs text-white font-bold text-center">
                  {value}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-md flex flex-col">
      {algorithm === "merge" && currentStep && isMergeSortStep(currentStep)
        ? renderMergeSortVisualization()
        : renderBarVisualization()}

      {/* Array length indicator */}
      <div className="text-center text-sm text-gray-500 mt-2">
        Array Size: {displayArray.length}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
          <span className="text-sm">Unsorted</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
          <span className="text-sm">Comparing</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
          <span className="text-sm">Swapping</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
          <span className="text-sm">Sorted</span>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
