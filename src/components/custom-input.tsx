import * as React from "react"
import { Input } from "@/components/ui/input"

export interface CustomInputProps {
  title: string
  defaultValue?: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}

export function CustomInput({ title, defaultValue = "", onChange, type = "text", placeholder }: CustomInputProps) {
  const [value, setInputValue] = React.useState(defaultValue)
  const onInputChange = (value: string) => {
    setInputValue(value)
    onChange(value)
  }
  return (
    <div className="space-y-2">
      <label
        htmlFor={title}
        className="text-sm font-medium whitespace-nowrap"
      >
        {title}
      </label>
      <Input
        id={title}
        type={type}
        value={value}
        onChange={(e) => onInputChange(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
    </div>
  )
}
