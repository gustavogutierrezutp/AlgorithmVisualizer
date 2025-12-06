import React from "react";
import { Button } from "@/components/ui/button";
import { Settings2, Eye, Dices, Network, Maximize2 } from "lucide-react";
import { CustomSlider } from "@/components/custom-slider";
import { Section } from "../Section";
import { ColorPickerInput } from "../ColorPickerInput";

export const DisplayOptions = (props) => {
  return (
    <Section
      title="Display Options"
      isOpen={props.isOpen}
      onToggle={props.onToggle}
      icon={Settings2}
      defaultOpen={false}
      id="display-options-section"
    >
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
            onChange={props.onNodeColorUpdate}
            onApply={props.onApplyNodeColor}
            showButton={true}
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
          className="w-full mt-2 bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100 hover:text-pink-700 hover:border-pink-300 transition-all shadow-sm"
          size="sm"
          onClick={props.onScramble}
          disabled={props.disable}
        >
          <Dices className="w-4 h-4 mr-2 opacity-80" />
          Scramble Layout
        </Button>

        <Button
          className="w-full mt-2 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-300 transition-all shadow-sm"
          size="sm"
          onClick={props.onAutoLayout}
          disabled={props.disable}
        >
          <Network className="w-4 h-4 mr-2 opacity-80" />
          Auto Layout
        </Button>

        <Button
          className={`w-full mt-2 transition-all shadow-sm ${
            props.autoAdjust
              ? 'bg-green-600 text-white hover:bg-green-700 border-green-600'
              : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:text-gray-700 hover:border-gray-300'
          }`}
          size="sm"
          onClick={props.onToggleAutoAdjust}
          disabled={props.disable}
        >
          <Maximize2 className="w-4 h-4 mr-2 opacity-80" />
          Auto Adjust
        </Button>
      </div>
    </Section>
  );
};
