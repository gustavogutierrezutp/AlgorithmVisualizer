import { useState } from "react";
import { ChevronDown, ChevronRight, LucideIcon } from "lucide-react";

export interface SectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: LucideIcon;
  id?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export const Section = ({ title, children, defaultOpen = true, icon: Icon, id, isOpen: controlledIsOpen, onToggle }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const actualIsOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;
  const handleToggle = onToggle || (() => setIsOpen(!actualIsOpen));

  return (
    <div id={id} className="bg-white rounded-2xl shadow-lg border border-gray-100/50 mx-4 my-3">
      <button
        className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-gray-50/70 transition-all duration-200 group rounded-t-2xl"
        onClick={handleToggle}
      >
        <div className="flex items-center gap-2 text-gray-700 group-hover:text-gray-900">
          {Icon && <Icon size={16} className="text-gray-500" />}
          <span className="font-medium text-sm tracking-wide">{title}</span>
        </div>
        <span className="text-gray-400">
          {actualIsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          actualIsOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4 pt-0 space-y-4 overflow-y-auto max-h-[500px]">{children}</div>
      </div>
    </div>
  );
};
