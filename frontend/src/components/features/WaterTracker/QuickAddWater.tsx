// components/WaterTracker/QuickAddWater.tsx
import { Button } from "@/components/ui/button";

interface Props {
  onAdd: (ml: number) => void;
}

const QUICK_AMOUNTS = [
  { ml: 200, icon: "💧", label: "Small Glass" },
  { ml: 250, icon: "🥤", label: "Regular Glass" },
  { ml: 350, icon: "🍶", label: "Large Glass" },
  { ml: 500, icon: "🥛", label: "Bottle" }
];

export const QuickAddWater = ({ onAdd }: Props) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {QUICK_AMOUNTS.map(({ ml, icon, label }) => (
      <Button
        key={ml}
        variant="outline"
        className="h-20 flex-col space-y-2"
        onClick={() => onAdd(ml)}
      >
        <div className="text-page-heading">{icon}</div>
        <span className="text-body-text">{label}</span>
        <span className="text-number-label text-muted-foreground">{ml}ml</span>
      </Button>
    ))}
  </div>
);