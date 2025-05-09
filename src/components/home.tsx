import React, { useState, useEffect, useRef } from "react";
import SortingVisualizer from "./SortingVisualizer";
import ControlPanel from "./ControlPanel";
import AlgorithmInfoPanel from "./AlgorithmInfoPanel";
import DataStructureSelector from "./DataStructureSelector";
import DFSBFSVisualization from "./DFSBFSVisualization";
import {
  getSortingSteps,
  SortingStep,
  MergeSortStep,
} from "../utils/sortingAlgorithms";

const Home: React.FC = () => {
  const [array, setArray] = useState<number[]>([
    12, 34, 8, 25, 45, 30, 15, 20, 38, 5,
  ]);
  const [algorithm, setAlgorithm] = useState<string>("bubble");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(50);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [sortingSteps, setSortingSteps] = useState<SortingStep[]>([]);
  const [currentStepData, setCurrentStepData] = useState<MergeSortStep | null>(
    null,
  );
  const [displayArray, setDisplayArray] = useState<number[]>([...array]);
  const [highlightIndices, setHighlightIndices] = useState<number[]>([]);
  const [compareIndices, setCompareIndices] = useState<number[]>([]);
  const [swapIndices, setSwapIndices] = useState<number[]>([]);
  const [showMemoryView, setShowMemoryView] = useState<boolean>(true);
  const [showGraphTraversal, setShowGraphTraversal] = useState<boolean>(true);
  const [graphTraversalAlgorithm, setGraphTraversalAlgorithm] = useState<
    "dfs" | "bfs"
  >("bfs");
  const [isGraphTraversalRunning, setIsGraphTraversalRunning] =
    useState<boolean>(false);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate sorting steps when algorithm or array changes
  useEffect(() => {
    resetSorting();
  }, [algorithm, array]);

  // Handle animation steps
  useEffect(() => {
    if (isRunning && !isPaused && sortingSteps.length > 0) {
      if (currentStep < sortingSteps.length) {
        const step = sortingSteps[currentStep];
        setDisplayArray(step.array);
        setHighlightIndices(step.highlightIndices);
        setCompareIndices(step.compareIndices);
        setSwapIndices(step.swapIndices);
        setCurrentStepData(step as MergeSortStep);

        // Calculate delay based on speed (inverse relationship)
        const delay = 1000 - speed * 9; // 50 -> 550ms, 100 -> 100ms

        animationTimeoutRef.current = setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, delay);
      } else {
        // Sorting complete
        setIsRunning(false);
        setIsPaused(false);
      }
    }

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isRunning, isPaused, currentStep, sortingSteps, speed]);

  const handleAlgorithmChange = (newAlgorithm: string) => {
    setAlgorithm(newAlgorithm);
  };

  const handleArrayChange = (newArray: number[]) => {
    setArray(newArray);
  };

  const handleStart = () => {
    if (currentStep >= sortingSteps.length) {
      // If we're at the end, restart
      resetSorting();
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleReset = () => {
    resetSorting();
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
  };

  const toggleMemoryView = () => {
    setShowMemoryView(!showMemoryView);
  };

  const toggleGraphTraversal = () => {
    setShowGraphTraversal(!showGraphTraversal);
  };

  const handleGraphAlgorithmChange = (algorithm: "dfs" | "bfs") => {
    setGraphTraversalAlgorithm(algorithm);
    setIsGraphTraversalRunning(false);
  };

  const handleStartGraphTraversal = () => {
    setIsGraphTraversalRunning(true);
  };

  const handleResetGraphTraversal = () => {
    setIsGraphTraversalRunning(false);
  };

  const resetSorting = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    setIsRunning(false);
    setIsPaused(false);
    setCurrentStep(0);
    setDisplayArray([...array]);
    setHighlightIndices([]);
    setCompareIndices([]);
    setSwapIndices([]);
    setCurrentStepData(null);

    // Generate new sorting steps
    const steps = getSortingSteps(array, algorithm);
    setSortingSteps(steps);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">
          Sorting Algorithm Visualizer
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="h-[500px]">
              <SortingVisualizer
                array={displayArray}
                algorithm={algorithm}
                isRunning={isRunning}
                isPaused={isPaused}
                speed={speed}
                highlightIndices={highlightIndices}
                compareIndices={compareIndices}
                swapIndices={swapIndices}
                currentStep={currentStepData}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <AlgorithmInfoPanel algorithm={algorithm} />
          </div>
        </div>

        <div className="mt-6">
          <ControlPanel
            onAlgorithmChange={handleAlgorithmChange}
            onArrayChange={handleArrayChange}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onSpeedChange={handleSpeedChange}
            isRunning={isRunning}
          />
        </div>

        {/* Memory Visualization Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Memory Representation</h2>
            <button
              onClick={toggleMemoryView}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showMemoryView ? "Hide" : "Show"} Memory View
            </button>
          </div>

          {showMemoryView && (
            <DataStructureSelector
              array={displayArray}
              highlightIndices={[
                ...highlightIndices,
                ...compareIndices,
                ...swapIndices,
              ]}
            />
          )}
        </div>

        {/* Graph Traversal Visualization Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              Graph Traversal Visualization
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleGraphAlgorithmChange("bfs")}
                  className={`px-3 py-1 text-sm rounded-md ${graphTraversalAlgorithm === "bfs" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  BFS
                </button>
                <button
                  onClick={() => handleGraphAlgorithmChange("dfs")}
                  className={`px-3 py-1 text-sm rounded-md ${graphTraversalAlgorithm === "dfs" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  DFS
                </button>
              </div>
              <button
                onClick={handleStartGraphTraversal}
                className="px-3 py-1 text-sm bg-green-500 text-white rounded-md"
                disabled={isGraphTraversalRunning}
              >
                Start
              </button>
              <button
                onClick={toggleGraphTraversal}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {showGraphTraversal ? "Hide" : "Show"} Graph Traversal
              </button>
            </div>
          </div>

          {showGraphTraversal && (
            <DFSBFSVisualization
              algorithm={graphTraversalAlgorithm}
              isRunning={isGraphTraversalRunning}
              onReset={handleResetGraphTraversal}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
