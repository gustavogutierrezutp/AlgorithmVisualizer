import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { MenuHeader } from "./MenuHeader";
import { ListCreation } from "./sections/ListCreation";
import { Operations } from "./sections/Operations";
import { DisplayOptions } from "./sections/DisplayOptions";
import { TestSection } from "./sections/TestSection";

export interface MenuProps {
  disable: boolean;
  onVisualize: (opIndex?: number, value?: string, position?: number) => Promise<void>;
  onCreateEmpty: () => void;
  onCreateRandom: (count: number) => void;
  onCreateFromSequence: (sequence: string) => void;
  onScramble: () => void;
  onAutoLayout: () => void;
  onToggleHeadHighlight: () => void;
  highlightHead: boolean;
  onToggleTailHighlight: () => void;
  highlightTail: boolean;
  count: number;
  onCountChange: (value: number) => void;
  onOperationChanged: (value: number) => void;
  onSpeedChange: (value: number) => void;
  nodeColor: string;
  onNodeColorUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApplyNodeColor: () => void;
  newNodeColor: string;
  onNewNodeColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  iterateColor: string;
  onIterateColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddCircularNode: () => void;
  onTogglePointers: () => void;
  showPointers: boolean;
  isListEmpty: boolean;
  listLength: number;
  lengthResult: number | null | undefined;
  searchResult: { found: boolean; position: number } | null | undefined;
  onSearchValueChange: () => void;
  autoAdjust: boolean;
  onToggleAutoAdjust: () => void;
  refreshInsertValue?: () => void;
  startTour?: () => void;
}

export interface MenuRefType {
  refreshInsertValue: () => void;
}

const MenuInner = forwardRef<MenuRefType, MenuProps>((props, ref) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    refreshInsertValue: () => {
      if (props.refreshInsertValue) {
        props.refreshInsertValue();
      }
    }
  }));

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const maxScroll = 80;
      const progress = Math.min(scrollTop / maxScroll, 1);
      setScrollProgress(progress);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside className="w-72 h-full bg-gray-50 border-r border-gray-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 mt-1">
      <MenuHeader scrollProgress={scrollProgress} />

      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 pb-2 scroll-smooth"
      >
        <ListCreation
          disable={props.disable}
          onCreateEmpty={props.onCreateEmpty}
          onCreateRandom={props.onCreateRandom}
          onCreateFromSequence={props.onCreateFromSequence}
          onCountChange={props.onCountChange}
        />

        <Operations
          disable={props.disable}
          onVisualize={props.onVisualize}
          listLength={props.listLength}
          lengthResult={props.lengthResult}
          searchResult={props.searchResult}
          onSearchValueChange={props.onSearchValueChange}
        />

        <TestSection
          onAddCircularNode={props.onAddCircularNode}
          onTogglePointers={props.onTogglePointers}
          showPointers={props.showPointers}
          isListEmpty={props.isListEmpty}
        />

        <DisplayOptions
          {...props}
        />
      </div>

      <div className="p-2 text-center border-t border-gray-200/50">
        <span className="text-[10px] text-gray-400 font-medium">
          v2.0 • Interactive Mode
        </span>
      </div>
    </aside>
  );
});

MenuInner.displayName = "Menu";

export default MenuInner;
