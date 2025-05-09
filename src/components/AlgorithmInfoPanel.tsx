import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AlgorithmInfoPanelProps {
  algorithm: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
}

const algorithmInfo = {
  bubble: {
    name: "Bubble Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
  },
  insertion: {
    name: "Insertion Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Builds the sorted array one item at a time by comparing each with the items before it and inserting it into its correct position.",
  },
  merge: {
    name: "Merge Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description:
      "Divides the array into halves, sorts them recursively, then merges the sorted halves.",
  },
  quick: {
    name: "Quick Sort",
    timeComplexity: "O(n log n) average, O(n²) worst",
    spaceComplexity: "O(log n)",
    description:
      "Selects a 'pivot' element and partitions the array around it, then recursively sorts the sub-arrays.",
  },
  cycle: {
    name: "Cycle Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "An in-place, unstable sorting algorithm that minimizes the number of memory writes.",
  },
  selection: {
    name: "Selection Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description:
      "Repeatedly finds the minimum element from the unsorted part and puts it at the beginning.",
  },
};

const AlgorithmInfoPanel: React.FC<AlgorithmInfoPanelProps> = ({
  algorithm = "bubble",
  timeComplexity = algorithmInfo.bubble.timeComplexity,
  spaceComplexity = algorithmInfo.bubble.spaceComplexity,
  description = algorithmInfo.bubble.description,
}) => {
  // Get the algorithm info based on the selected algorithm
  const selectedAlgo =
    algorithmInfo[algorithm as keyof typeof algorithmInfo] ||
    algorithmInfo.bubble;

  return (
    <Card className="w-full max-w-[350px] bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{selectedAlgo.name}</CardTitle>
        <CardDescription>Algorithm Information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold">Time Complexity:</h3>
          <p className="text-sm">{selectedAlgo.timeComplexity}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Space Complexity:</h3>
          <p className="text-sm">{selectedAlgo.spaceComplexity}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">How it works:</h3>
          <p className="text-sm">{selectedAlgo.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmInfoPanel;
