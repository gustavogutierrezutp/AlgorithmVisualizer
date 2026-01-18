import { Button } from "@/components/ui/button";

export interface ColorPickerInputProps {
  label: string;
  color: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  showButton?: boolean;
  onApply?: () => void;
}

export const ColorPickerInput = ({ label, color, onChange, disabled, showButton, onApply }: ColorPickerInputProps) => (
  <div className="flex items-center justify-between gap-3 p-2 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <div className="flex items-center gap-2">
      {showButton && (
        <Button
          onClick={onApply}
          disabled={disabled}
          size="sm"
          variant="outline"
          className="h-6 px-2 text-xs"
        >
          Apply
        </Button>
      )}
      <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:scale-110 transition-transform">
        <input
          type="color"
          value={color}
          onChange={onChange}
          disabled={disabled}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 cursor-pointer border-0"
        />
      </div>
    </div>
  </div>
);
