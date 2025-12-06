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
  AlertTriangle,
  Target,
  Hash,
  Search,
  Circle,
  Filter
} from "lucide-react";
import { Section } from "../Section";

export const Operations = ({ disable, onVisualize, listLength = 0, lengthResult = null, searchResult = null, onSearchValueChange = () => {} }) => {
  const [insertValue, setInsertValue] = useState(
    Math.floor(Math.random() * 100)
  );
  const [insertPosition, setInsertPosition] = useState(0);
  const [deletePosition, setDeletePosition] = useState(0);
  const [nthPosition, setNthPosition] = useState(0);
  const [searchValue, setSearchValue] = useState(
    Math.floor(Math.random() * 100)
  );

  // Check if position is valid (0 to listLength inclusive for insert, 0 to listLength-1 for delete and nth)
  const isInsertPositionValid = insertPosition >= 0 && insertPosition <= listLength;
  const isDeletePositionValid = deletePosition >= 0 && deletePosition < listLength;
  const isNthPositionValid = nthPosition >= 0 && nthPosition < listLength;

  return (
    <Section title="Operations" icon={Play} defaultOpen={false}>
      <div className="space-y-1 mb-4">
        <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
          Insert
        </label>
        <div className="relative">
          <Input
            type="number"
            value={insertValue}
            onChange={(e) => setInsertValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !disable) {
                onVisualize(0, insertValue);
              }
            }}
            placeholder="42"
            disabled={disable}
            className="font-mono pr-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            style={{ MozAppearance: 'textfield' }}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setInsertValue(Math.floor(Math.random() * 100))}
            title="Random Value"
            disabled={disable}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-gray-100"
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

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                {!isInsertPositionValid && (
                  <label className="text-[10px] font-normal text-red-500 tracking-wider mb-1 block">
                    (max: {listLength})
                  </label>
                )}
                <Input
                  type="number"
                  value={insertPosition}
                  onChange={(e) => setInsertPosition(Math.max(0, parseInt(e.target.value) || 0))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !disable && isInsertPositionValid) {
                      onVisualize(7, insertValue, insertPosition);
                    }
                  }}
                  placeholder="0"
                  disabled={disable}
                  className={`font-mono h-9 transition-colors ${
                    !isInsertPositionValid
                      ? 'bg-red-50 border-red-300 text-red-700 focus:border-red-400 focus:ring-red-400'
                      : ''
                  }`}
                  min="0"
                />
              </div>
              <Button
                onClick={() => onVisualize(7, insertValue, insertPosition)}
                disabled={disable || !isInsertPositionValid}
                variant="outline"
                size="sm"
                className="h-9 flex-1 justify-start hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  !isInsertPositionValid
                    ? `Position must be between 0 and ${listLength}`
                    : "Insert at specific position (requires traversal)"
                }
              >
                <Target className="w-3 h-3 mr-2 text-blue-400" />
                <span className="text-left">Insert at pos.</span>
              </Button>
            </div>

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
          <div className="space-y-2">
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

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                {!isDeletePositionValid && listLength > 0 && (
                  <label className="text-[10px] font-normal text-red-500 tracking-wider mb-1 block">
                    (max: {listLength - 1})
                  </label>
                )}
                <Input
                  type="number"
                  value={deletePosition}
                  onChange={(e) => setDeletePosition(Math.max(0, parseInt(e.target.value) || 0))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !disable && isDeletePositionValid) {
                      onVisualize(11, null, deletePosition);
                    }
                  }}
                  placeholder="0"
                  disabled={disable || listLength === 0}
                  className={`font-mono h-9 transition-colors ${
                    !isDeletePositionValid && listLength > 0
                      ? 'bg-red-50 border-red-300 text-red-700 focus:border-red-400 focus:ring-red-400'
                      : ''
                  }`}
                  min="0"
                />
              </div>
              <Button
                onClick={() => onVisualize(11, null, deletePosition)}
                disabled={disable || !isDeletePositionValid}
                variant="outline"
                size="sm"
                className="h-9 flex-1 justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  !isDeletePositionValid
                    ? listLength === 0
                      ? "List is empty"
                      : `Position must be between 0 and ${listLength - 1}`
                    : "Remove at specific position (requires traversal)"
                }
              >
                <Trash2 className="w-3 h-3 mr-2 text-red-400" />
                <span className="text-left">Remove at pos.</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-2" />

        <div>
          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 block">
            Access
          </label>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={() => onVisualize(13)}
                disabled={disable}
                variant="secondary"
                size="sm"
                className="justify-start"
              >
                <Circle className="w-3 h-3 mr-2" /> Front
              </Button>
              <Button
                onClick={() => onVisualize(14)}
                disabled={disable}
                variant="secondary"
                size="sm"
                className="justify-start"
              >
                <Circle className="w-3 h-3 mr-2" /> Back
              </Button>
            </div>

            <div className="flex gap-2 items-end">
              <div className="flex-1">
                {!isNthPositionValid && listLength > 0 && (
                  <label className="text-[10px] font-normal text-red-500 tracking-wider mb-1 block">
                    (max: {listLength - 1})
                  </label>
                )}
                <Input
                  type="number"
                  value={nthPosition}
                  onChange={(e) => setNthPosition(Math.max(0, parseInt(e.target.value) || 0))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !disable && isNthPositionValid) {
                      onVisualize(15, null, nthPosition);
                    }
                  }}
                  placeholder="0"
                  disabled={disable || listLength === 0}
                  className={`font-mono h-9 transition-colors ${
                    !isNthPositionValid && listLength > 0
                      ? 'bg-red-50 border-red-300 text-red-700 focus:border-red-400 focus:ring-red-400'
                      : ''
                  }`}
                  min="0"
                />
              </div>
              <Button
                onClick={() => onVisualize(15, null, nthPosition)}
                disabled={disable || !isNthPositionValid}
                variant="secondary"
                size="sm"
                className="h-9 flex-1 justify-start disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  !isNthPositionValid
                    ? listLength === 0
                      ? "List is empty"
                      : `Position must be between 0 and ${listLength - 1}`
                    : "Access element at specific position"
                }
              >
                <Circle className="w-3 h-3 mr-2" />
                <span className="text-left">Nth</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-2" />

        <div>
          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 block">
            Search
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="number"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  onSearchValueChange();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !disable) {
                    onVisualize(9, searchValue);
                  }
                }}
                placeholder="42"
                disabled={disable}
                className="font-mono pr-10 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                style={{ MozAppearance: 'textfield' }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSearchValue(Math.floor(Math.random() * 100));
                  onSearchValueChange();
                }}
                title="Random Value"
                disabled={disable}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-gray-100"
              >
                <Shuffle className="w-3 h-3" />
              </Button>
            </div>
            <Button
              onClick={() => onVisualize(9, searchValue)}
              disabled={disable}
              variant="outline"
              size="sm"
              className={`flex-1 justify-start transition-colors ${
                searchResult === null
                  ? 'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200'
                  : searchResult.found
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-600'
                  : 'bg-red-500 hover:bg-red-600 text-white border-red-600'
              }`}
            >
              <Search className={`w-3 h-3 mr-2 ${
                searchResult === null
                  ? 'text-purple-400'
                  : 'text-white'
              }`} />
              <span className="text-left">
                {searchResult === null
                  ? 'Search'
                  : searchResult.found
                  ? `pos. ${searchResult.position}`
                  : 'Not Found'}
              </span>
            </Button>
          </div>
        </div>

        <div className="h-px bg-gray-100 my-2" />

        <div>
          <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2 block">
            Algorithms
          </label>
          <div className="space-y-2">
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
            <Button
              onClick={() => onVisualize(10)}
              disabled={disable}
              variant="secondary"
              size="sm"
              className="w-full"
              title="Finds the middle node using two-pointer technique"
            >
              <Circle className="w-3 h-3 mr-2" /> Find Middle
            </Button>
            <Button
              onClick={() => onVisualize(8)}
              disabled={disable}
              variant="secondary"
              size="sm"
              className={`w-full relative overflow-visible transition-colors ${
                lengthResult !== null
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-600'
                  : ''
              }`}
              title="Counts nodes by traversing the entire list"
            >
              <Hash className="w-3 h-3 mr-2" /> Get Length{lengthResult !== null ? `: ${lengthResult}` : ''}
              <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-yellow-900 rounded-full p-[2px] border border-white shadow-sm z-10 flex items-center justify-center">
                <AlertTriangle size={8} strokeWidth={2.5} className="p-[.15rem]" />
              </div>
            </Button>
            <Button
              onClick={() => onVisualize(12)}
              disabled={disable}
              variant="secondary"
              size="sm"
              className="w-full"
              title="Removes duplicate values from the list"
            >
              <Filter className="w-3 h-3 mr-2" /> Remove Duplicates
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
};
