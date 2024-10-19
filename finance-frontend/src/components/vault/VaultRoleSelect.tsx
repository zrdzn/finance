import Select from "react-select"
import React, {useState} from "react"
import {
  SelectProperties,
} from "@/components/api"

interface VaultRoleSelectProperties {
  onChange: (vaultRole: string | null) => void
  defaultValue?: string
}

const options = [
    { value: 'MANAGER', label: 'MANAGER' },
    { value: 'MEMBER', label: 'MEMBER' }
]

export const VaultRoleSelect = ({ onChange, defaultValue }: VaultRoleSelectProperties) => {
  const [selectedRole, setSelectedRole] = useState<SelectProperties>({
    value: defaultValue?.toString() ?? 'None',
    label: defaultValue ?? 'None'
  })

  const handleRoleChange = (newValue: SelectProperties) => {
    if (!newValue) {
      return
    }

    setSelectedRole(newValue)

    const role = options.find(role => role.value.toString() === newValue.value)
    if (!role) {
      onChange(null)
      return
    }

    onChange(role.value)
  }

  return (
    <Select onChange={handleRoleChange}
            defaultValue={selectedRole}
            required
            options={options} />
  )
}