'use client';

import { Select } from '@/components/ui/Select';
import { EquipmentType, EQUIPMENT_TYPE_LABELS } from '@/types';

const equipmentTypeOptions = Object.entries(EQUIPMENT_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

interface EquipmentTypeSelectProps {
  value: EquipmentType;
  onChange: (value: EquipmentType) => void;
  disabled?: boolean;
}

export function EquipmentTypeSelect({
  value,
  onChange,
  disabled,
}: EquipmentTypeSelectProps) {
  return (
    <Select
      options={equipmentTypeOptions}
      value={value}
      onChange={(v) => onChange(v as EquipmentType)}
      disabled={disabled}
      className="min-w-[120px]"
    />
  );
}
