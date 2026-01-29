'use client';

import { Select } from '@/components/ui/Select';
import { EquipmentStatus, STATUS_CONFIG } from '@/types';

const statusOptions = Object.entries(STATUS_CONFIG).map(([value, config]) => ({
  value,
  label: config.label,
}));

interface StatusSelectProps {
  value: EquipmentStatus;
  onChange: (value: EquipmentStatus) => void;
  disabled?: boolean;
}

export function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
  return (
    <Select
      options={statusOptions}
      value={value}
      onChange={(v) => onChange(v as EquipmentStatus)}
      disabled={disabled}
      className="min-w-[110px]"
    />
  );
}
