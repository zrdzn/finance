import React, {useState} from "react"
import Select from "react-select"
import {ScheduleInterval} from "@/api/types";

interface IntervalOption {
  value: string
  label: string
}

interface IntervalSelectProperties {
  onChange: (value: ScheduleInterval) => void
  defaultValue?: string
  isDisabled?: boolean
}

export const IntervalSelect = ({ onChange, defaultValue, isDisabled }: IntervalSelectProperties) => {
  const intervals = ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'].map(interval => ({
    value: interval,
    label: interval
  }))

  const [selectedInterval, setSelectedInterval] = useState<IntervalOption | null>({
    value: defaultValue ?? 'PLN',
    label: defaultValue ?? 'PLN'
  })

  const handleChange = (option: IntervalOption | null) => {
    setSelectedInterval(option)
    onChange(option ? option.value as ScheduleInterval : 'DAY')
  }

  return (
    <Select defaultValue={selectedInterval}
            onChange={handleChange}
            required
            isDisabled={isDisabled}
            options={intervals}
            isClearable />
  )
}