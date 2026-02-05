// hooks/useWaterReminder.ts
import { useEffect, useRef } from "react";

export const useWaterReminder = (
  lastDrinkTime: string | null,
  enabled = true,
  intervalMinutes = 90
) => {
  const notificationShown = useRef(false);

  useEffect(() => {
    if (!enabled || !lastDrinkTime) return;

    const checkReminder = () => {
      const now = Date.now();
      const lastDrink = new Date(lastDrinkTime).getTime();
      const diffMinutes = (now - lastDrink) / (1000 * 60);

      if (diffMinutes > intervalMinutes && !notificationShown.current) {
        if (typeof window !== 'undefined' && window.Notification && Notification.permission === 'granted') {
          new Notification('💧 Time to drink water!', {
            body: `It's been ${Math.round(diffMinutes)} minutes since your last drink. Stay hydrated!`,
            icon: '/water-icon.png'
          });
          notificationShown.current = true;
        }
      } else if (diffMinutes <= intervalMinutes) {
        notificationShown.current = false;
      }
    };

    const interval = setInterval(checkReminder, 60000); // Check every minute
    checkReminder(); // Initial check

    return () => clearInterval(interval);
  }, [lastDrinkTime, enabled, intervalMinutes]);
};