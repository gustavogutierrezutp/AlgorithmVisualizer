import * as React from "react"
import { Slider } from "@/components/ui/slider"
import { NumberChangeHandler } from "@/types/common"

export interface CustomSliderProps {
  title: string
  onChange: NumberChangeHandler
  min: number
  max: number
  step: number
  defaultValue: number
}

export function CustomSlider({ title, onChange, min, max, step, defaultValue }: CustomSliderProps) {
    const [value, setValue] = React.useState(defaultValue)
    const onChangeCover = (value: number[]) => {
        setValue(value[0])
        onChange(value[0])
    }


    return (
      <div className="space-y-2">
      <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider whitespace-nowrap">{title}</label>
      <Slider
        value={[value]}
        onValueChange={onChangeCover}
        min={min}
        max={max}
        step={step}
        className="w-full"
      />
      <span className="text-sm text-gray-500 w-8">{value}</span>
    </div>
  )
}
