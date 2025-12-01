import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListPlus, Shuffle } from "lucide-react";
import { CustomSlider } from "@/components/custom-slider";
import { Section } from "../Section";

export const ListCreation = ({
  disable,
  onCreateEmpty,
  onCreateRandom,
  onCreateFromSequence,
  onCountChange,
}) => {
  const [creationMode, setCreationMode] = useState("random");
  const [sequenceInput, setSequenceInput] = useState("[1, 2, 3, 4, 5]");

  return (
    <Section title="List Creation" icon={ListPlus} id="list-creation-section">
      <div className="bg-gray-100/50 p-1 rounded-lg flex gap-1">
        {["Empty", "Random", "Custom"].map((mode) => (
          <button
            key={mode}
            onClick={() => setCreationMode(mode.toLowerCase())}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
              creationMode === mode.toLowerCase()
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {creationMode === "empty" && (
        <div className="text-center py-2">
          <Button
            className="w-full"
            onClick={onCreateEmpty}
            disabled={disable}
            variant="outline"
          >
            Create Empty List
          </Button>
        </div>
      )}

      {creationMode === "random" && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <CustomSlider
            title="Nodes Count"
            defaultValue={5}
            min={1}
            max={100}
            step={1}
            onChange={onCountChange}
            disable={disable}
          />
          <Button
            className="w-full"
            onClick={onCreateRandom}
            disabled={disable}
          >
            <Shuffle className="w-3 h-3 mr-2" /> Generate Random
          </Button>
        </div>
      )}

      {creationMode === "custom" && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <Input
            value={sequenceInput}
            onChange={(e) => setSequenceInput(e.target.value)}
            placeholder="[1, 2, 3...]"
            disabled={disable}
            className="font-mono text-xs"
          />
          <Button
            className="w-full"
            onClick={() => onCreateFromSequence(sequenceInput)}
            disabled={disable}
          >
            Create List
          </Button>
        </div>
      )}
    </Section>
  );
};