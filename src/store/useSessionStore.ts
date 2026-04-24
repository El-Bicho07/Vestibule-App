import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type SessionStatus = "idle" | "active" | "complete" | "abandoned";

interface SessionState {
  duration: number; // seconds
  label: string;
  startTime: number | null;
  isActive: boolean;
  strictMode: boolean;
  status: SessionStatus;
  distractionsBlocked: number;
  elapsedOnAbandon: number;

  configureSession: (params: { duration: number; label: string; strictMode: boolean }) => void;
  startSession: () => void;
  tickDistraction: () => void;
  completeSession: () => void;
  abandonSession: (elapsedSeconds: number) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      duration: 25 * 60,
      label: "Deep work",
      startTime: null,
      isActive: false,
      strictMode: false,
      status: "idle",
      distractionsBlocked: 0,
      elapsedOnAbandon: 0,

      configureSession: ({ duration, label, strictMode }) =>
        set({ duration, label, strictMode, status: "idle" }),

      startSession: () =>
        set({
          startTime: Date.now(),
          isActive: true,
          status: "active",
          distractionsBlocked: 0,
          elapsedOnAbandon: 0,
        }),

      tickDistraction: () =>
        set((s) => ({ distractionsBlocked: s.distractionsBlocked + 1 })),

      completeSession: () => set({ isActive: false, status: "complete" }),

      abandonSession: (elapsedSeconds) =>
        set({
          isActive: false,
          status: "abandoned",
          elapsedOnAbandon: elapsedSeconds,
        }),

      resetSession: () =>
        set({
          startTime: null,
          isActive: false,
          status: "idle",
          distractionsBlocked: 0,
          elapsedOnAbandon: 0,
        }),
    }),
    {
      name: "vestibule-session",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        duration: s.duration,
        label: s.label,
        strictMode: s.strictMode,
      }),
    },
  ),
);
