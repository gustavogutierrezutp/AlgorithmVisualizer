import React from "react";
import { Button } from "@/components/ui/button";
import { Beaker } from "lucide-react";
import { Section } from "../Section";

export const TestSection = ({ onAddCircularNode }) => {
  return (
    <Section title="Test" icon={Beaker} defaultOpen={true} id="test-section">
      <div className="space-y-4">
        <Button
          onClick={onAddCircularNode}
          variant="outline"
          size="sm"
          className="w-full justify-start hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
        >
          <div className="w-3 h-3 rounded-full border-2 border-current mr-2" />
          Add Circular Node
        </Button>
      </div>
    </Section>
  );
};
