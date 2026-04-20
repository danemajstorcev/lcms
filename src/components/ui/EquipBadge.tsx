import type { EquipmentType } from '@/types';

const colorMap: Record<EquipmentType, string> = {
  'Dry Van':   '#38bdf8',
  'Reefer':    '#a78bfa',
  'Flatbed':   '#fb923c',
  'Step Deck': '#34d399',
  'RGN':       '#f472b6',
};

interface EquipBadgeProps {
  value: EquipmentType;
}

export default function EquipBadge({ value }: EquipBadgeProps) {
  const clr = colorMap[value] ?? '#888';
  return (
    <span
      className="badge"
      style={{
        background:   `${clr}18`,
        color:        clr,
        borderColor:  `${clr}33`,
      }}
    >
      {value}
    </span>
  );
}
