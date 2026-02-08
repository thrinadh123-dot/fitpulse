// components/WaterTracker/ManualWaterEntry.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ManualWaterEntry = ({ onAdd }: { onAdd: (ml: number) => void }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const validate = (ml: number): boolean => {
    if (ml <= 0) {
      setError("Please enter a positive amount");
      return false;
    }
    if (ml > 5000) {
      setError("Amount seems too high. Maximum is 5000ml.");
      return false;
    }
    return true;
  };

  const submit = () => {
    setError("");
    const ml = Number(value);
    
    if (isNaN(ml)) {
      setError("Please enter a valid number");
      return;
    }

    if (validate(ml)) {
      onAdd(ml);
      setValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submit();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-body-text font-medium">Amount (ml)</label>
        <Input
          type="number"
          placeholder="Enter amount in milliliters"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          min="1"
          max="5000"
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline" 
          onClick={() => setValue("200")}
          className="text-body-text"
        >
          200ml
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setValue("500")}
          className="text-body-text"
        >
          500ml
        </Button>
        <Button 
          variant="outline" 
          onClick={() => setValue("1000")}
          className="text-body-text"
        >
          1L
        </Button>
      </div>

      <Button onClick={submit} className="w-full">
        Add Water
      </Button>
    </div>
  );
};
