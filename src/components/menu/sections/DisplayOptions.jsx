import React from "react";
import { Button } from "@/components/ui/button";
import { Settings2, Eye } from "lucide-react";
import { CustomSlider } from "@/components/custom-slider";
import { Section } from "../Section";
import { ColorPickerInput } from "../ColorPickerInput";

export const DisplayOptions = (props) => {
  return (
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
  );
};