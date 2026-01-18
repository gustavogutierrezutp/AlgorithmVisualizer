import { useState } from "react";
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
  Filter,
  ChevronDown,
} from "lucide-react";
import { Section } from "../Section";

interface SubSectionProps {
  title: string;
  icon: any;
  children: React.ReactNode;
  badge?: string;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  id?: string;
}

const SubSection = ({
  title,
  icon: Icon,
  children,
  badge,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
}: SubSectionProps) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const handleToggle = onToggle || (() => setInternalIsOpen(!internalIsOpen));

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden transition-colors ${
      isOpen ? 'bg-blue-100/40 border-blue-300' : 'bg-white'
    }`}>
      <button
        onClick={handleToggle}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors group"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-700" />
          <span className="text-xs font-semibold text-gray-700">{title}</span>
          {badge && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-3 pb-3 pt-1 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

export interface OperationsProps {
  disable: boolean;
  onVisualize: (opIndex?: number, value?: string, position?: number) => Promise<void>;
  listLength?: number;
  lengthResult?: number | null | undefined;
  searchResult?: { found: boolean; position: number } | null | undefined;
  onSearchValueChange?: () => void;
}

export const Operations = ({
  disable,
  onVisualize,
  listLength = 0,
  lengthResult = null,
  searchResult = null,
  onSearchValueChange = () => {},
}: OperationsProps) => {
  const [insertValue, setInsertValue] = useState<number | string>(
    Math.floor(Math.random() * 100)
  );
  const [insertPosition, setInsertPosition] = useState<number | string>(0);
  const [deletePosition, setDeletePosition] = useState<number | string>(0);
  const [nthPosition, setNthPosition] = useState<number | string>(0);
  const [searchValue, setSearchValue] = useState<number | string>(
    String(Math.floor(Math.random() * 100))
  );
  const [openSubSection, setOpenSubSection] = useState<string | null>("insert");

  const handleSubSectionToggle = (sectionId: string) => {
    setOpenSubSection(prev => prev === sectionId ? null : sectionId);
  };

  const isInsertPositionValid =
    Number(insertPosition) >= 0 && Number(insertPosition) <= listLength;
  const isDeletePositionValid =
    Number(deletePosition) >= 0 && Number(deletePosition) < listLength;
  const isNthPositionValid = Number(nthPosition) >= 0 && Number(nthPosition) < listLength;

  return (
    <Section title="Operations" icon={Play} defaultOpen={false} id="operations-section">
      <div className="space-y-2">
        {/* INSERT SECTION */}
        <SubSection
          title="Insert"
          icon={Plus}
          badge="4"
          id="insert"
          isOpen={openSubSection === "insert"}
          onToggle={() => handleSubSectionToggle("insert")}
        >
          <div className="mb-3 p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <div className="relative">
              <Input
                type="number"
                value={insertValue}
                onChange={(e) => setInsertValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !disable) {
                    onVisualize(7, String(insertValue), Number(insertPosition));
                  }
                }}
                placeholder="42"
                disabled={disable}
                className="font-mono font-bold text-base pr-10 bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                style={{ MozAppearance: "textfield" }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setInsertValue(Math.floor(Math.random() * 100))}
                title="Random Value"
                disabled={disable}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 hover:bg-blue-100 text-blue-600"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <Button
              onClick={() => onVisualize(0, String(insertValue))}
              disabled={disable}
              variant="outline"
              size="sm"
              className="w-full justify-start hover:bg-green-50 hover:text-green-600 hover:border-green-300 font-medium"
            >
              <Plus className="w-3.5 h-3.5 mr-2 text-green-500" />
              At Head
            </Button>

            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                <Input
                  type="number"
                  value={insertPosition}
                  onChange={(e) =>
                    setInsertPosition(
                      Math.max(0, parseInt(e.target.value) || 0)
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !disable &&
                      isInsertPositionValid
                    ) {
                      onVisualize(7, String(insertValue), Number(insertPosition));
                    }
                  }}
                  placeholder="pos"
                  disabled={disable}
                  className={`font-mono h-8 w-16 text-center text-xs transition-colors ${
                    !isInsertPositionValid
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "border-gray-300"
                  }`}
                  min="0"
                />
                <Button
                  onClick={() => onVisualize(7, String(insertValue), Number(insertPosition))}
                  disabled={disable || !isInsertPositionValid}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 justify-start hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 disabled:opacity-50 font-medium"
                  title={
                    !isInsertPositionValid
                      ? `Max: ${listLength}`
                      : "Insert at position"
                  }
                >
                  <Target className="w-3.5 h-3.5 mr-2 text-blue-500" />
                  At Position
                </Button>
              </div>
              {!isInsertPositionValid && (
                <p className="text-[10px] text-red-500 font-medium pl-1">
                  ⚠ Max position: {listLength}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <Button
                onClick={() => onVisualize(2, String(insertValue), undefined)}
                disabled={disable}
                variant="outline"
                size="sm"
                className="relative h-auto py-2 flex-col items-start hover:bg-yellow-50 hover:border-yellow-300"
              >
                <div className="flex items-center gap-1.5 w-full">
                  <ArrowRight className="w-3.5 h-3.5 text-yellow-600" />
                  <span className="font-semibold text-xs">At Tail</span>
                </div>
                <span className="text-[9px] text-gray-500 mt-[-.5rem]">
                  Traverse
                </span>
                <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border border-white shadow-sm">
                  <AlertTriangle
                    size={9}
                    strokeWidth={2.5}
                    className="text-yellow-900"
                  />
                </div>
              </Button>

              <Button
                onClick={() => onVisualize(6, String(insertValue), undefined)}
                disabled={disable}
                variant="outline"
                size="sm"
                className="h-auto py-2 flex-col items-start hover:bg-purple-50 hover:border-purple-300"
              >
                <div className="flex items-center gap-1.5 w-full">
                  <Zap className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-semibold text-xs">At Tail</span>
                </div>
                <span className="text-[9px] text-gray-500 mt-[-.5rem]">
                  Pointer
                </span>
              </Button>
            </div>
          </div>
        </SubSection>

        {/* REMOVE SECTION */}
        <SubSection
          title="Remove"
          icon={Trash2}
          badge="3"
          id="remove"
          isOpen={openSubSection === "remove"}
          onToggle={() => handleSubSectionToggle("remove")}
        >
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-1.5">
              <Button
                onClick={() => onVisualize(1, undefined, undefined)}
                disabled={disable}
                variant="outline"
                size="sm"
                className="h-8 justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-300 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5 text-red-500" />
                Head
              </Button>
              <Button
                onClick={() => onVisualize(3, undefined, undefined)}
                disabled={disable}
                variant="outline"
                size="sm"
                className="h-8 justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-300 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5 text-red-500" />
                Tail
              </Button>
            </div>

            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                <Input
                  type="number"
                  value={deletePosition}
                  onChange={(e) =>
                    setDeletePosition(
                      Math.max(0, parseInt(e.target.value) || 0)
                    )
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !disable &&
                      isDeletePositionValid
                    ) {
                      onVisualize(11, undefined, Number(deletePosition));
                    }
                  }}
                  placeholder="pos"
                  disabled={disable || listLength === 0}
                  className={`font-mono h-8 w-16 text-center text-xs transition-colors ${
                    !isDeletePositionValid && listLength > 0
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "border-gray-300"
                  }`}
                  min="0"
                />
                <Button
                  onClick={() => onVisualize(11, undefined, Number(deletePosition))}
                  disabled={disable || !isDeletePositionValid}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 justify-start hover:bg-red-50 hover:text-red-600 hover:border-red-300 disabled:opacity-50 font-medium"
                  title={
                    !isDeletePositionValid
                      ? listLength === 0
                        ? "Empty list"
                        : `Max: ${listLength - 1}`
                      : "Remove at position"
                  }
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2 text-red-500" />
                  At Position
                </Button>
              </div>
              {!isDeletePositionValid && listLength > 0 && (
                <p className="text-[10px] text-red-500 font-medium pl-1">
                  ⚠ Max position: {listLength - 1}
                </p>
              )}
            </div>
          </div>
        </SubSection>

        {/* ACCESS SECTION - NUEVA DEL JEFE */}
        <SubSection
          title="Access"
          icon={Circle}
          badge="3"
          id="access"
          isOpen={openSubSection === "access"}
          onToggle={() => handleSubSectionToggle("access")}
        >
          <div className="space-y-2 pt-1">
            <div className="grid grid-cols-2 gap-1.5">
              <Button
                onClick={() => onVisualize(13, undefined, undefined)}
                disabled={disable}
                variant="secondary"
                size="sm"
                className="h-8 justify-start font-medium"
              >
                <Circle className="w-3.5 h-3.5 mr-1.5" />
                Front
              </Button>
              <Button
                onClick={() => onVisualize(14, undefined, undefined)}
                disabled={disable}
                variant="secondary"
                size="sm"
                className="h-8 justify-start font-medium"
              >
                <Circle className="w-3.5 h-3.5 mr-1.5" />
                Back
              </Button>
            </div>

            <div className="space-y-1.5">
              <div className="flex gap-1.5">
                <Input
                  type="number"
                  value={nthPosition}
                  onChange={(e) =>
                    setNthPosition(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !disable && isNthPositionValid) {
                      onVisualize(15, undefined, Number(nthPosition));
                    }
                  }}
                  placeholder="pos"
                  disabled={disable || listLength === 0}
                  className={`font-mono h-8 w-16 text-center text-xs transition-colors ${
                    !isNthPositionValid && listLength > 0
                      ? "bg-red-50 border-red-300 text-red-700"
                      : "border-gray-300"
                  }`}
                  min="0"
                />
                <Button
                  onClick={() => onVisualize(15, undefined, Number(nthPosition))}
                  disabled={disable || !isNthPositionValid}
                  variant="secondary"
                  size="sm"
                  className="flex-1 h-8 justify-start disabled:opacity-50 font-medium"
                  title={
                    !isNthPositionValid
                      ? listLength === 0
                        ? "Empty list"
                        : `Max: ${listLength - 1}`
                      : "Access nth element"
                  }
                >
                  <Circle className="w-3.5 h-3.5 mr-2" />
                  Nth
                </Button>
              </div>
              {!isNthPositionValid && listLength > 0 && (
                <p className="text-[10px] text-red-500 font-medium pl-1">
                  ⚠ Max position: {listLength - 1}
                </p>
              )}
            </div>
          </div>
        </SubSection>

        {/* SEARCH SECTION */}
        <SubSection
          title="Search"
          icon={Search}
          badge="1"
          id="search"
          isOpen={openSubSection === "search"}
          onToggle={() => handleSubSectionToggle("search")}
        >
          <div className="space-y-2 pt-1">
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <Input
                  type="number"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    onSearchValueChange && onSearchValueChange();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !disable) {
                      onVisualize(9, String(searchValue), undefined);
                    }
                  }}
                  placeholder="value"
                  disabled={disable}
                  className="font-mono h-8 text-xs pr-8 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  style={{ MozAppearance: "textfield" }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSearchValue(Math.floor(Math.random() * 100));
                    onSearchValueChange && onSearchValueChange();
                  }}
                  title="Random"
                  disabled={disable}
                  className="absolute right-0.5 top-1/2 -translate-y-1/2 h-6 w-6 hover:bg-gray-100"
                >
                  <Shuffle className="w-3 h-3" />
                </Button>
              </div>
              <Button
                onClick={() => onVisualize(9, String(searchValue), undefined)}
                disabled={disable}
                variant="outline"
                size="sm"
                className={`h-8 px-3 font-medium transition-all ${
                  searchResult === null
                    ? "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                    : searchResult.found
                    ? "bg-green-500 hover:bg-green-600 text-white border-green-600"
                    : "bg-red-500 hover:bg-red-600 text-white border-red-600"
                }`}
              >
                <Search
                  className={`w-3.5 h-3.5 mr-1.5 ${
                    searchResult === null ? "text-purple-500" : "text-white"
                  }`}
                />
                {searchResult === null
                  ? "Find"
                  : searchResult.found
                  ? `#${searchResult.position}`
                  : "N/A"}
              </Button>
            </div>
          </div>
        </SubSection>

        {/* ALGORITHMS SECTION */}
        <SubSection
          title="Algorithms"
          icon={ArrowRightLeft}
          badge="5"
          id="algorithms"
          isOpen={openSubSection === "algorithms"}
          onToggle={() => handleSubSectionToggle("algorithms")}
        >
          <div className="space-y-1.5 pt-1">
            <Button
              onClick={() => onVisualize(4, undefined, undefined)}
              disabled={disable}
              variant="secondary"
              size="sm"
              className="w-full h-8 text-xs font-medium justify-start"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" />
              Traverse
            </Button>
            <Button
              onClick={() => onVisualize(5, undefined, undefined)}
              disabled={disable}
              variant="secondary"
              size="sm"
              className="w-full h-8 text-xs font-medium justify-start"
            >
              <Shuffle className="w-3.5 h-3.5 mr-1.5" />
              Reverse
            </Button>

            <Button
              onClick={() => onVisualize(10, undefined, undefined)}
              disabled={disable}
              variant="secondary"
              size="sm"
              className="w-full h-8 text-xs font-medium justify-start"
            >
              <Circle className="w-3.5 h-3.5 mr-1.5" />
              Find Middle
            </Button>

            <Button
              onClick={() => onVisualize(8, undefined, undefined)}
              disabled={disable}
              variant="secondary"
              size="sm"
              className={`w-full h-8 text-xs font-medium justify-start relative overflow-visible transition-colors ${
                lengthResult !== null
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : ""
              }`}
            >
              <Hash className="w-3.5 h-3.5 mr-1.5" />
              Get Length{lengthResult !== null ? `: ${lengthResult}` : ""}
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border border-white shadow-sm">
                <AlertTriangle
                  size={9}
                  strokeWidth={2.5}
                  className="text-yellow-900"
                />
              </div>
            </Button>

            <Button
              onClick={() => onVisualize(12, undefined, undefined)}
              disabled={disable}
              variant="secondary"
              size="sm"
              className="w-full h-8 text-xs font-medium justify-start"
            >
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              Remove Duplicates
            </Button>
          </div>
        </SubSection>
      </div>
    </Section>
  );
};
