// src/services/PaymentCountdownService.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Create a store with persistence
const usePaymentCountdownStore = create(
  persist(
    (set, get) => ({
      endTime: null,
      isActive: false,

      // Start the countdown with 24 hours
      startCountdown: () => {
        const endTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
        set({ endTime, isActive: true });
      },

      // Stop the countdown
      stopCountdown: () => {
        set({ endTime: null, isActive: false });
      },

      // Get remaining time in seconds
      getRemainingTime: () => {
        const state = get();
        if (!state.endTime || !state.isActive) return 0;

        const now = Date.now();
        const remaining = state.endTime - now;
        return remaining > 0 ? Math.floor(remaining / 1000) : 0;
      },

      // Format the remaining time as HH:MM:SS
      getFormattedTime: () => {
        const state = get();
        const totalSeconds = state.getRemainingTime();

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return {
          hours: hours.toString().padStart(2, "0"),
          minutes: minutes.toString().padStart(2, "0"),
          seconds: seconds.toString().padStart(2, "0"),
          raw: totalSeconds,
        };
      },
    }),
    {
      name: "payment-countdown-storage", // nama untuk localStorage key
    }
  )
);

export default usePaymentCountdownStore;
