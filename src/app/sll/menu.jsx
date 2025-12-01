import React, { useState } from "react";
import { CustomSlider } from "@/components/custom-slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Play,
  Plus,
  Trash2,
  Settings2,
  Shuffle,
  ListPlus,
  ArrowRightLeft,
  Eye,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const Section = ({ title, children, defaultOpen = true, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 mx-4 my-3">
      <button
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50/70 transition-all duration-200 group rounded-t-2xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-gray-700 group-hover:text-gray-900">
          {Icon && <Icon size={16} className="text-gray-500" />}
          <span className="font-medium text-sm tracking-wide">{title}</span>
        </div>
        <span className="text-gray-400">
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-0 space-y-4">{children}</div>
      </div>
    </div>
  );
};

const ColorPickerInput = ({ label, color, onChange, disabled }) => (
  <div className="flex items-center justify-between gap-3 p-2 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-gray-400 uppercase">{color}</span>
      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:scale-110 transition-transform">
        <input
          type="color"
          value={color}
          onChange={onChange}
          disabled={disabled}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 cursor-pointer border-0"
        />
      </div>
    </div>
  </div>
);

export default function Menu(props) {
  const [sequenceInput, setSequenceInput] = useState("[1, 2, 3, 4, 5]");
  const [creationMode, setCreationMode] = useState("random"); // 'empty', 'random', 'custom'
  const [insertValue, setInsertValue] = useState(
    Math.floor(Math.random() * 100)
  );

  const isClickable = props.disable
    ? { cursor: "not-allowed", opacity: 0.7 }
    : {};

  const handleCreateFromSequence = () => {
    props.onCreateFromSequence(sequenceInput);
  };

  return (
    <aside className="w-72 h-full bg-gray-50 border-r border-gray-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 mt-1 ">
      <div className="sticky top-0 z-20 px-5 py-4 bg-white/70 backdrop-blur-sm border-b border-gray-100/70">
        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
          <div className="w-1 h-5 bg-primary rounded-lg"></div>
          Sections
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pb-2">
        <Section title="List Creation" icon={ListPlus}>
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
              <p className="text-xs text-gray-500 mb-3">
                Start with a blank canvas
              </p>
              <Button
                className="w-full"
                onClick={props.onCreateEmpty}
                disabled={props.disable}
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
                onChange={props.onCountChange}
                disable={props.disable}
              />
              <Button
                className="w-full"
                onClick={props.onCreateRandom}
                disabled={props.disable}
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
                disabled={props.disable}
                className="font-mono text-xs"
              />
              <Button
                className="w-full"
                onClick={handleCreateFromSequence}
                disabled={props.disable}
              >
                Load Sequence
              </Button>
            </div>
          )}
        </Section>

        {/* Operations */}
        <Section title="Operations" icon={Play} defaultOpen={false}>
          <div className="space-y-1 mb-4">
            <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              Target Value
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={insertValue}
                onChange={(e) => setInsertValue(e.target.value)}
                placeholder="42"
                disabled={props.disable}
                className="font-mono"
              />
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setInsertValue(Math.floor(Math.random() * 100))}
                title="Random Value"
              >
                <Shuffle className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 block">
                Insert
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => props.onVisualize(0, insertValue)}
                  disabled={props.disable}
                  variant="outline"
                  size="sm"
                  className="justify-start hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                >
                  <Plus className="w-3 h-3 mr-2 text-green-400" /> Head
                </Button>
                <Button
                  onClick={() => props.onVisualize(2, insertValue)}
                  disabled={props.disable}
                  variant="outline"
                  size="sm"
                  className="justify-start hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                >
                  <Plus className="w-3 h-3 mr-2 text-green-400" /> Tail
                </Button>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1 block">
                Remove
              </label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => props.onVisualize(1)}
                  disabled={props.disable}
                  variant="outline"
                  size="sm"
                  className="justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <Trash2 className="w-3 h-3 mr-2 text-red-400" /> Head
                </Button>
                <Button
                  onClick={() => props.onVisualize(3)}
                  disabled={props.disable}
                  variant="outline"
                  size="sm"
                  className="justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <Trash2 className="w-3 h-3 mr-2 text-red-400" /> Tail
                </Button>
              </div>
            </div>

            <div className="h-px bg-gray-100 my-2" />

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => props.onVisualize(4)}
                disabled={props.disable}
                variant="secondary"
                size="sm"
              >
                <ArrowRightLeft className="w-3 h-3 mr-2" /> Traverse
              </Button>
              <Button
                onClick={() => props.onVisualize(5)}
                disabled={props.disable}
                variant="secondary"
                size="sm"
              >
                <Shuffle className="w-3 h-3 mr-2" /> Reverse
              </Button>
            </div>
          </div>
        </Section>

        {/* Display Options */}
        <Section title="Display Options" icon={Settings2} defaultOpen={false}>
          <div className="space-y-4">
            <CustomSlider
              defaultValue={50}
              title="Animation Speed"
              onChange={props.onSpeedChange}
              min={10}
              max={100}
              step={1}
              disable={props.disable}
            />

            <div className="space-y-2">
              <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                Colors
              </p>

              <ColorPickerInput
                label="Standard Node"
                color={props.nodeColor}
                onChange={props.onColorChange}
                disabled={props.disable}
              />
              <ColorPickerInput
                label="New Node"
                color={props.newNodeColor}
                onChange={props.onNewNodeColorChange}
                disabled={props.disable}
              />
              <ColorPickerInput
                label="Active Node"
                color={props.iterateColor}
                onChange={props.onIterateColorChange}
                disabled={props.disable}
              />
            </div>

            <div className="pt-2">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 block">
                Highlights
              </label>
              <div className="flex gap-2">
                <Button
                  onClick={props.onToggleHeadHighlight}
                  disabled={props.disable}
                  variant={props.highlightHead ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="w-3 h-3 mr-2" /> Head
                </Button>
                <Button
                  onClick={props.onToggleTailHighlight}
                  disabled={props.disable}
                  variant={props.highlightTail ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                >
                  <Eye className="w-3 h-3 mr-2" /> Tail
                </Button>
              </div>
            </div>

            <Button
              className="w-full mt-2"
              size="sm"
              onClick={props.onScramble}
              disabled={props.disable}
            >
              Scramble Layout
            </Button>
          </div>
        </Section>
      </div>

      {/* Footer: Eliminado el borde superior */}
      <div className="p-2 text-center">
        <span className="text-[10px] text-gray-300">
          v2.0 • Interactive Mode
        </span>
      </div>
    </aside>
  );
}
