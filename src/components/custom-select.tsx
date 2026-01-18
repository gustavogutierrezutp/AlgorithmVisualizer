import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface CustomSelectProps {
  title: string
  options: string[]
  onChange: (value: number) => void
}

export function CustomSelect({ title, options, onChange }: CustomSelectProps) {
  const [value, setValue] = React.useState("0")
  const onChangeCover = (value: string) => {
    setValue(value)
    onChange(parseInt(value))
  }
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium whitespace-nowrap">{title}</label>
      <Select value={value} onValueChange={onChangeCover}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, idx) => (
            <SelectItem key={idx} value={idx.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
