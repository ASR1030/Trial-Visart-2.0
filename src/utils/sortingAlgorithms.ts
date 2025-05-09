// Define the types for sorting steps
export type SortingStep = {
  array: number[];
  compareIndices: number[];
  swapIndices: number[];
  highlightIndices: number[];
};

// Bubble Sort Algorithm
export const bubbleSort = (array: number[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = [...array];
  const n = arr.length;
  let sorted = false;

  for (let i = 0; i < n - 1 && !sorted; i++) {
    sorted = true;
    for (let j = 0; j < n - i - 1; j++) {
      // Record comparison
      steps.push({
        array: [...arr],
        compareIndices: [j, j + 1],
        swapIndices: [],
        highlightIndices: [...Array(i).keys()].map((k) => n - 1 - k),
      });

      if (arr[j] > arr[j + 1]) {
        // Record swap
        steps.push({
          array: [...arr],
          compareIndices: [],
          swapIndices: [j, j + 1],
          highlightIndices: [...Array(i).keys()].map((k) => n - 1 - k),
        });

        // Perform swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        sorted = false;
      }
    }

    // Mark the last element of this pass as sorted
    steps.push({
      array: [...arr],
      compareIndices: [],
      swapIndices: [],
      highlightIndices: [...Array(i + 1).keys()].map((k) => n - 1 - k),
    });
  }

  // Final state - all sorted
  steps.push({
    array: [...arr],
    compareIndices: [],
    swapIndices: [],
    highlightIndices: Array.from({ length: n }, (_, i) => i),
  });

  return steps;
};

// Insertion Sort Algorithm
export const insertionSort = (array: number[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = [...array];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Record the current element to be inserted
    steps.push({
      array: [...arr],
      compareIndices: [i],
      swapIndices: [],
      highlightIndices: Array.from({ length: i }, (_, k) =>
        k < i ? k : -1,
      ).filter((k) => k !== -1),
    });

    while (j >= 0 && arr[j] > key) {
      // Record comparison
      steps.push({
        array: [...arr],
        compareIndices: [j, j + 1],
        swapIndices: [],
        highlightIndices: Array.from({ length: i }, (_, k) =>
          k < j ? k : -1,
        ).filter((k) => k !== -1),
      });

      // Record swap
      steps.push({
        array: [...arr],
        compareIndices: [],
        swapIndices: [j, j + 1],
        highlightIndices: Array.from({ length: i }, (_, k) =>
          k < j ? k : -1,
        ).filter((k) => k !== -1),
      });

      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;

    // Record the insertion
    steps.push({
      array: [...arr],
      compareIndices: [],
      swapIndices: [],
      highlightIndices: Array.from({ length: i + 1 }, (_, k) => k),
    });
  }

  // Final state - all sorted
  steps.push({
    array: [...arr],
    compareIndices: [],
    swapIndices: [],
    highlightIndices: Array.from({ length: n }, (_, i) => i),
  });

  return steps;
};

// Extended SortingStep type for merge sort visualization
export type MergeSortStep = SortingStep & {
  treeSteps?: {
    level: number;
    start: number;
    end: number;
    isMerging: boolean;
    leftArray?: number[];
    rightArray?: number[];
    mergedArray?: number[];
  }[];
};

// Merge Sort Algorithm with tree visualization
export const mergeSort = (array: number[]): MergeSortStep[] => {
  const steps: MergeSortStep[] = [];
  const arr = [...array];
  const n = arr.length;
  const tempArray = [...arr];

  // Add initial state
  steps.push({
    array: [...arr],
    compareIndices: [],
    swapIndices: [],
    highlightIndices: [],
    treeSteps: [
      {
        level: 0,
        start: 0,
        end: n - 1,
        isMerging: false,
      },
    ],
  });

  const mergeSortHelper = (start: number, end: number, level: number) => {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);

    // Record division step
    steps.push({
      array: [...arr],
      compareIndices: [],
      swapIndices: [],
      highlightIndices: [],
      treeSteps: [
        {
          level,
          start,
          end,
          isMerging: false,
        },
        {
          level: level + 1,
          start,
          end: mid,
          isMerging: false,
        },
        {
          level: level + 1,
          start: mid + 1,
          end,
          isMerging: false,
        },
      ],
    });

    // Recursively sort both halves
    mergeSortHelper(start, mid, level + 1);
    mergeSortHelper(mid + 1, end, level + 1);

    // Prepare for merging
    const leftArray = arr.slice(start, mid + 1);
    const rightArray = arr.slice(mid + 1, end + 1);

    // Record before merging
    steps.push({
      array: [...arr],
      compareIndices: [],
      swapIndices: [],
      highlightIndices: [],
      treeSteps: [
        {
          level,
          start,
          end,
          isMerging: true,
          leftArray: [...leftArray],
          rightArray: [...rightArray],
        },
      ],
    });

    // Merge the sorted halves
    let i = 0;
    let j = 0;
    let k = start;
    const mergedArray: number[] = [];

    while (i < leftArray.length && j < rightArray.length) {
      // Record comparison
      steps.push({
        array: [...arr],
        compareIndices: [start + i, mid + 1 + j],
        swapIndices: [],
        highlightIndices: [],
        treeSteps: [
          {
            level,
            start,
            end,
            isMerging: true,
            leftArray: [...leftArray],
            rightArray: [...rightArray],
            mergedArray: [...mergedArray],
          },
        ],
      });

      if (leftArray[i] <= rightArray[j]) {
        tempArray[k] = leftArray[i];
        mergedArray.push(leftArray[i]);
        i++;
      } else {
        tempArray[k] = rightArray[j];
        mergedArray.push(rightArray[j]);
        j++;
      }
      k++;
    }

    while (i < leftArray.length) {
      tempArray[k] = leftArray[i];
      mergedArray.push(leftArray[i]);
      i++;
      k++;
    }

    while (j < rightArray.length) {
      tempArray[k] = rightArray[j];
      mergedArray.push(rightArray[j]);
      j++;
      k++;
    }

    // Copy back to original array
    for (let m = start; m <= end; m++) {
      arr[m] = tempArray[m];
    }

    // Record after merging
    steps.push({
      array: [...arr],
      compareIndices: [],
      swapIndices: [],
      highlightIndices: Array.from(
        { length: end - start + 1 },
        (_, i) => start + i,
      ),
      treeSteps: [
        {
          level,
          start,
          end,
          isMerging: true,
          leftArray: [...leftArray],
          rightArray: [...rightArray],
          mergedArray: [...mergedArray],
        },
      ],
    });
  };

  mergeSortHelper(0, n - 1, 0);

  // Final state - all sorted
  steps.push({
    array: [...arr],
    compareIndices: [],
    swapIndices: [],
    highlightIndices: Array.from({ length: n }, (_, i) => i),
    treeSteps: [
      {
        level: 0,
        start: 0,
        end: n - 1,
        isMerging: true,
        mergedArray: [...arr],
      },
    ],
  });

  return steps;
};

// Quick Sort Algorithm
export const quickSort = (array: number[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = [...array];
  const n = arr.length;

  const partition = (low: number, high: number): number => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      // Record comparison with pivot
      steps.push({
        array: [...arr],
        compareIndices: [j, high],
        swapIndices: [],
        highlightIndices: [],
      });

      if (arr[j] < pivot) {
        i++;

        // Record swap
        steps.push({
          array: [...arr],
          compareIndices: [],
          swapIndices: [i, j],
          highlightIndices: [],
        });

        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }

    // Record swap with pivot
    steps.push({
      array: [...arr],
      compareIndices: [],
      swapIndices: [i + 1, high],
      highlightIndices: [],
    });

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

    // Record the pivot in its final position
    steps.push({
      array: [...arr],
      compareIndices: [],
      swapIndices: [],
      highlightIndices: [i + 1],
    });

    return i + 1;
  };

  const quickSortHelper = (low: number, high: number) => {
    if (low < high) {
      const pivotIndex = partition(low, high);

      quickSortHelper(low, pivotIndex - 1);
      quickSortHelper(pivotIndex + 1, high);
    } else if (low === high) {
      // Single element is already sorted
      steps.push({
        array: [...arr],
        compareIndices: [],
        swapIndices: [],
        highlightIndices: [low],
      });
    }
  };

  quickSortHelper(0, n - 1);

  // Final state - all sorted
  steps.push({
    array: [...arr],
    compareIndices: [],
    swapIndices: [],
    highlightIndices: Array.from({ length: n }, (_, i) => i),
  });

  return steps;
};

// Selection Sort Algorithm
export const selectionSort = (array: number[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      // Record comparison
      steps.push({
        array: [...arr],
        compareIndices: [minIndex, j],
        swapIndices: [],
        highlightIndices: Array.from({ length: i }, (_, k) => k),
      });

      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      // Record swap
      steps.push({
        array: [...arr],
        compareIndices: [],
        swapIndices: [i, minIndex],
        highlightIndices: Array.from({ length: i }, (_, k) => k),
      });

      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }

    // Mark current position as sorted
    steps.push({
      array: [...arr],
      compareIndices: [],
      swapIndices: [],
      highlightIndices: Array.from({ length: i + 1 }, (_, k) => k),
    });
  }

  // Final state - all sorted
  steps.push({
    array: [...arr],
    compareIndices: [],
    swapIndices: [],
    highlightIndices: Array.from({ length: n }, (_, i) => i),
  });

  return steps;
};

// Cycle Sort Algorithm
export const cycleSort = (array: number[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const arr = [...array];
  const n = arr.length;

  for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
    let item = arr[cycleStart];
    let pos = cycleStart;

    // Find position where to put the item
    for (let i = cycleStart + 1; i < n; i++) {
      // Record comparison
      steps.push({
        array: [...arr],
        compareIndices: [cycleStart, i],
        swapIndices: [],
        highlightIndices: Array.from({ length: cycleStart }, (_, k) => k),
      });

      if (arr[i] < item) {
        pos++;
      }
    }

    // If item is already in correct position
    if (pos === cycleStart) {
      continue;
    }

    // Ignore duplicates
    while (item === arr[pos]) {
      pos++;
    }

    // Put the item in its correct position
    if (pos !== cycleStart) {
      // Record swap
      steps.push({
        array: [...arr],
        compareIndices: [],
        swapIndices: [cycleStart, pos],
        highlightIndices: Array.from({ length: cycleStart }, (_, k) => k),
      });

      [item, arr[pos]] = [arr[pos], item];
    }

    // Rotate the rest of the cycle
    while (pos !== cycleStart) {
      pos = cycleStart;

      // Find position where to put the item
      for (let i = cycleStart + 1; i < n; i++) {
        // Record comparison
        steps.push({
          array: [...arr],
          compareIndices: [cycleStart, i],
          swapIndices: [],
          highlightIndices: Array.from({ length: cycleStart }, (_, k) => k),
        });

        if (arr[i] < item) {
          pos++;
        }
      }

      // Ignore duplicates
      while (item === arr[pos]) {
        pos++;
      }

      // Put the item in its correct position
      if (item !== arr[pos]) {
        // Record swap
        steps.push({
          array: [...arr],
          compareIndices: [],
          swapIndices: [cycleStart, pos],
          highlightIndices: Array.from({ length: cycleStart }, (_, k) => k),
        });

        [item, arr[pos]] = [arr[pos], item];
      }
    }

    // Mark current position as sorted
    steps.push({
      array: [...arr],
      compareIndices: [],
      swapIndices: [],
      highlightIndices: Array.from({ length: cycleStart + 1 }, (_, k) => k),
    });
  }

  // Final state - all sorted
  steps.push({
    array: [...arr],
    compareIndices: [],
    swapIndices: [],
    highlightIndices: Array.from({ length: n }, (_, i) => i),
  });

  return steps;
};

// Function to get the sorting algorithm based on the selected algorithm
export const getSortingSteps = (
  array: number[],
  algorithm: string,
): SortingStep[] => {
  switch (algorithm) {
    case "bubble":
      return bubbleSort(array);
    case "insertion":
      return insertionSort(array);
    case "merge":
      return mergeSort(array);
    case "quick":
      return quickSort(array);
    case "selection":
      return selectionSort(array);
    case "cycle":
      return cycleSort(array);
    default:
      return bubbleSort(array);
  }
};

// Helper function to check if a step is a MergeSortStep
export const isMergeSortStep = (step: SortingStep): step is MergeSortStep => {
  return "treeSteps" in step;
};
