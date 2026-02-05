import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Moon, Clock, Sunset, Sunrise, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SleepLogFormProps {
  onSubmit: (entry: { date: string; bedtime: string; wakeTime: string; duration: number; quality: string }) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const SleepLogForm = ({ onSubmit, open, onOpenChange }: SleepLogFormProps) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [bedtime, setBedtime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [calculatedDuration, setCalculatedDuration] = useState<number | null>(null);
  const [calculatedQuality, setCalculatedQuality] = useState<string>("");

  // Calculate duration and quality when bedtime or wakeTime changes
  useEffect(() => {
    if (bedtime && wakeTime) {
      const [bedHour, bedMin] = bedtime.split(':').map(Number);
      const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);

      // Convert to minutes for easier calculation
      const bedMinutes = bedHour * 60 + bedMin;
      let wakeMinutes = wakeHour * 60 + wakeMin;

      // Handle overnight sleep (wake time is next day)
      if (wakeMinutes < bedMinutes) {
        wakeMinutes += 24 * 60; // Add 24 hours
      }

      const durationMinutes = wakeMinutes - bedMinutes;
      const durationHours = Number((durationMinutes / 60).toFixed(1));
      
      setCalculatedDuration(durationHours);

      // Derive sleep quality
      let quality = "Poor";
      if (durationHours >= 8) quality = "Excellent";
      else if (durationHours >= 7) quality = "Good";
      else if (durationHours >= 6) quality = "Average";

      setCalculatedQuality(quality);
    }
  }, [bedtime, wakeTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (calculatedDuration !== null) {
      onSubmit({
        date,
        bedtime,
        wakeTime,
        duration: calculatedDuration,
        quality: calculatedQuality,
      });
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setBedtime("23:00");
      setWakeTime("07:00");
      onOpenChange?.(false);
    }
  };

  const getWeekday = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const qualityColors = {
    Excellent: { bg: "bg-green-500/20", text: "text-green-500", border: "border-green-500/30" },
    Good: { bg: "bg-blue-500/20", text: "text-blue-500", border: "border-blue-500/30" },
    Average: { bg: "bg-yellow-500/20", text: "text-yellow-500", border: "border-yellow-500/30" },
    Poor: { bg: "bg-red-500/20", text: "text-red-500", border: "border-red-500/30" },
  };

  const colors = calculatedQuality ? qualityColors[calculatedQuality as keyof typeof qualityColors] || qualityColors.Average : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Moon className="h-5 w-5 text-primary" />
            Log Sleep
          </SheetTitle>
          <SheetDescription>
            Enter your sleep times to automatically calculate duration and quality.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Date Field */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              {getWeekday(date)}
            </p>
          </div>

          {/* Bedtime Field */}
          <div className="space-y-2">
            <Label htmlFor="bedtime" className="flex items-center gap-2">
              <Sunset className="h-4 w-4" />
              Bedtime (24h format)
            </Label>
            <Input
              id="bedtime"
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Wake Time Field */}
          <div className="space-y-2">
            <Label htmlFor="wakeTime" className="flex items-center gap-2">
              <Sunrise className="h-4 w-4" />
              Wake Time (24h format)
            </Label>
            <Input
              id="wakeTime"
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Calculated Duration and Quality Preview */}
          {calculatedDuration !== null && (
            <div className="p-4 rounded-lg border border-border bg-card/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Calculated Duration:</span>
                <span className="text-lg font-bold text-foreground">{calculatedDuration}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Sleep Quality:</span>
                {colors && (
                  <Badge className={`${colors.bg} ${colors.text} ${colors.border}`}>
                    {calculatedQuality}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={calculatedDuration === null}>
            <Clock className="h-4 w-4 mr-2" />
            Log Sleep
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

