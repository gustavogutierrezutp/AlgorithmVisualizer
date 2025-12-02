import React from "react";
import { Button } from "@/components/ui/button";
import { Beaker } from "lucide-react";
import { Section } from "../Section";

export const TestSection = ({ onAddCircularNode, onTogglePointers, showPointers, isListEmpty }) => {
  return (
    <Section title="Programmer tools" icon={Beaker} defaultOpen={true} id="test-section">
      <div className="space-y-4">
        <Button
          onClick={onAddCircularNode}
          variant="outline"
          size="sm"
          className="w-full justify-start hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
        >
          <div className="w-3 h-3 rounded-full border-2 border-current mr-2" />
          Add pointer
        </Button>
        <Button
          onClick={onTogglePointers}
          disabled={isListEmpty}
          variant={showPointers ? "default" : "outline"}
          size="sm"
          className={`w-full justify-start ${showPointers ? 'bg-orange-600 text-white hover:bg-orange-700' : 'hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'}`}
        >
          <div className="w-3 h-3 rounded-full border-2 border-current mr-2" />
          {showPointers ? "Hide head and tail pointers" : "Show head and tail pointers"}
        </Button>
      </div>
    </Section>
  );
};
