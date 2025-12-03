import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Play,
  Plus,
  Trash2,
  ArrowRightLeft,
  Shuffle,
  Zap,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { Section } from "../Section";

export const Operations = ({ disable, onVisualize }) => {
  const [insertValue, setInsertValue] = useState(
    Math.floor(Math.random() * 100)
  );

  return (
    <Section title="Operations" icon={Play} defaultOpen={false}>
      <div className="space-y-1 mb-4">
        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
          Insert
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
          <div className="space-y-2">
            <Button
              onClick={() => onVisualize(0, insertValue)}
              disabled={disable}
              variant="outline"
              size="sm"
              className="w-full py-4 justify-start hover:bg-green-50 hover:text-green-600 hover:border-green-200"
            >
              <Plus className="w-3 h-3 mr-2 text-green-400" />
              <span className="text-left">Insert at Head</span>
            </Button>

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onVisualize(2, insertValue)}
                disabled={disable}
                variant="outline"
                size="sm"
                className="relative overflow-visible justify-start px-3 h-auto py-1 hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200"
                title="Recorre toda la lista hasta el final"
              >
                <ArrowRight className="w-4 h-4 mr-2 text-yellow-500 shrink-0" />
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-medium">Tail</span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Traverse
                  </span>
                </div>

                <div className="absolute  -top-1.5 -right-1.5 bg-yellow-400 text-yellow-900 rounded-full p-[2px] border border-white shadow-sm z-10 flex items-center justify-center">
                  <AlertTriangle size={8} strokeWidth={2.5} className="p-[.15rem]" />
                </div>
              </Button>

              <Button
                onClick={() => onVisualize(6, insertValue)}
                disabled={disable}
                variant="outline"
                size="sm"
                className="justify-start px-3 h-auto py-1 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                title="Inserta directamente usando el puntero final"
              >
                <Zap className="w-4 h-4 mr-2 text-purple-500 shrink-0" />
                <div className="flex flex-col items-start leading-tight">
                  <span className="font-medium">Tail</span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    Pointer
                  </span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-2" />

        <div>
          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 block">
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

        <div>
          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 block">
            Algorithms
          </label>
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
      </div>
    </Section>
  );
};
