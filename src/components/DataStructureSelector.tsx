import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import MemoryVisualization from "./MemoryVisualization";
import StackVisualization from "./StackVisualization";
import QueueVisualization from "./QueueVisualization";

interface DataStructureSelectorProps {
  array: number[];
  highlightIndices?: number[];
}

const DataStructureSelector: React.FC<DataStructureSelectorProps> = ({
  array = [12, 34, 8, 25, 45],
  highlightIndices = [],
}) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Data Structure Memory View</h2>
      <Tabs defaultValue="array" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="array">Array</TabsTrigger>
          <TabsTrigger value="vector">Vector</TabsTrigger>
          <TabsTrigger value="linkedlist">Linked List</TabsTrigger>
          <TabsTrigger value="stack">Stack</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
        </TabsList>
        <TabsContent value="array" className="mt-4">
          <MemoryVisualization
            type="array"
            data={array}
            highlightIndices={highlightIndices}
          />
        </TabsContent>
        <TabsContent value="vector" className="mt-4">
          <MemoryVisualization
            type="vector"
            data={array}
            highlightIndices={highlightIndices}
          />
        </TabsContent>
        <TabsContent value="linkedlist" className="mt-4">
          <MemoryVisualization
            type="linkedlist"
            data={array}
            highlightIndices={highlightIndices}
          />
        </TabsContent>
        <TabsContent value="stack" className="mt-4">
          <StackVisualization
            initialData={array}
            highlightIndices={highlightIndices}
          />
        </TabsContent>
        <TabsContent value="queue" className="mt-4">
          <QueueVisualization
            initialData={array}
            highlightIndices={highlightIndices}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataStructureSelector;
