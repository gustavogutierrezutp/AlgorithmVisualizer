import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Plus, Trash2, ArrowRightLeft, Shuffle } from "lucide-react";
import { Section } from "../Section";

export const Operations = ({ disable, onVisualize }) => {
  const [insertValue, setInsertValue] = useState(
    Math.floor(Math.random() * 100)
  );

  return (
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
            disabled={disable}
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
              onClick={() => onVisualize(0, insertValue)}
              disabled={disable}
              variant="outline"
              size="sm"
              className="justify-start hover:bg-green-50 hover:text-green-600 hover:border-green-200"
            >
              <Plus className="w-3 h-3 mr-2 text-green-400" /> Head
            </Button>
            <Button
              onClick={() => onVisualize(2, insertValue)}
              disabled={disable}
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
              onClick={() => onVisualize(1)}
              disabled={disable}
              variant="outline"
              size="sm"
              className="justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <Trash2 className="w-3 h-3 mr-2 text-red-400" /> Head
            </Button>
            <Button
              onClick={() => onVisualize(3)}
              disabled={disable}
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
            onClick={() => onVisualize(4)}
            disabled={disable}
            variant="secondary"
            size="sm"
          >
            <ArrowRightLeft className="w-3 h-3 mr-2" /> Traverse
          </Button>
          <Button
            onClick={() => onVisualize(5)}
            disabled={disable}
            variant="secondary"
            size="sm"
          >
            <Shuffle className="w-3 h-3 mr-2" /> Reverse
          </Button>
        </div>
      </div>
    </Section>
  );
};