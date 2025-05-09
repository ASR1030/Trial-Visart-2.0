import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import {
  PlayIcon,
  PauseIcon,
  RefreshCwIcon,
  Settings2Icon,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface ControlPanelProps {
  onAlgorithmChange: (algorithm: string) => void;
  onArrayChange: (array: number[]) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  isRunning?: boolean;
}

const ControlPanel = ({
  onAlgorithmChange,
  onArrayChange,
  onStart,
  onPause,
  onReset,
  onSpeedChange,
  isRunning = false,
}: ControlPanelProps) => {
  const [algorithm, setAlgorithm] = useState("bubble");
  const [customInput, setCustomInput] = useState("");
  const [arraySize, setArraySize] = useState(20);
  const [speed, setSpeed] = useState(50);

  const handleAlgorithmChange = (value: string) => {
    setAlgorithm(value);
    onAlgorithmChange(value);
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomInput(e.target.value);
  };

  const handleCustomInputSubmit = () => {
    const values = customInput
      .split(",")
      .map((val) => parseInt(val.trim()))
      .filter((val) => !isNaN(val));

    if (values.length > 0) {
      onArrayChange(values);
    }
  };

  const handleRandomGeneration = () => {
    const randomArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 100) + 1,
    );
    onArrayChange(randomArray);
  };

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setSpeed(newSpeed);
    onSpeedChange(newSpeed);
  };

  const handleArraySizeChange = (value: number[]) => {
    const newSize = value[0];
    setArraySize(newSize);
  };

  return (
    <Card className="w-full bg-background border shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Algorithm Selection */}
          <div className="space-y-2">
            <Label htmlFor="algorithm-select">Algorithm</Label>
            <Select value={algorithm} onValueChange={handleAlgorithmChange}>
              <SelectTrigger id="algorithm-select" className="w-full">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bubble">Bubble Sort</SelectItem>
                <SelectItem value="insertion">Insertion Sort</SelectItem>
                <SelectItem value="merge">Merge Sort</SelectItem>
                <SelectItem value="quick">Quick Sort</SelectItem>
                <SelectItem value="cycle">Cycle Sort</SelectItem>
                <SelectItem value="selection">Selection Sort</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Array Configuration */}
          <div className="space-y-2">
            <Label>Array Configuration</Label>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter values (e.g. 5,3,8,1,9)"
                value={customInput}
                onChange={handleCustomInputChange}
              />
              <Button variant="outline" onClick={handleCustomInputSubmit}>
                Set
              </Button>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="array-size">Array Size: {arraySize}</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRandomGeneration}
                >
                  Generate Random
                </Button>
              </div>
              <Slider
                id="array-size"
                min={5}
                max={100}
                step={1}
                value={[arraySize]}
                onValueChange={handleArraySizeChange}
                className="mt-2"
              />
            </div>
          </div>

          {/* Animation Controls */}
          <div className="space-y-2">
            <Label>Animation Controls</Label>
            <div className="flex space-x-2">
              {!isRunning ? (
                <Button onClick={onStart} className="flex-1">
                  <PlayIcon className="mr-2 h-4 w-4" /> Start
                </Button>
              ) : (
                <Button onClick={onPause} className="flex-1">
                  <PauseIcon className="mr-2 h-4 w-4" /> Pause
                </Button>
              )}
              <Button variant="outline" onClick={onReset}>
                <RefreshCwIcon className="mr-2 h-4 w-4" /> Reset
              </Button>
            </div>
          </div>

          {/* Speed Control */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="speed-slider">Animation Speed</Label>
              <div className="text-sm text-muted-foreground">
                {speed < 33 ? "Slow" : speed < 66 ? "Medium" : "Fast"}
              </div>
            </div>
            <Slider
              id="speed-slider"
              min={1}
              max={100}
              step={1}
              value={[speed]}
              onValueChange={handleSpeedChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
