import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dayKey } from "../utils/time";

export interface Session {
  id: string;
  startTime: number;
  duration: number; // seconds (intended)
  actualDuration: number; // seconds elapsed
  label: string;
  status: "complete" | "abandoned";
  distractionsBlocked: number;
  strictMode: boolean;
}

interface StatsState {
  sessions: Session[];
  streak: number;
  longestStreak: number;
  lastCompletedDay: string | null;
  addSession: (session: Session) => void;
  clearAll: () => void;
}

const computeStreak = (
  current: number,
  longest: number,
  lastDay: string | null,
  status: Session["status"],
): { streak: number; longest: number; lastDay: string | null } => {
  if (status !== "complete") return { streak: current, longest, lastDay };

  const todayKey = dayKey(Date.now());
  const yesterdayKey = dayKey(Date.now() - 24 * 60 * 60 * 1000);

  let next = current;
  if (lastDay === todayKey) {
    next = current || 1;
  } else if (lastDay === yesterdayKey) {
    next = current + 1;
  } else {
    next = 1;
  }

  return {
    streak: next,
    longest: Math.max(longest, next),
    lastDay: todayKey,
  };
};

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      sessions: [],
      streak: 0,
      longestStreak: 0,
      lastCompletedDay: null,

      addSession: (session) =>
        set((s) => {
          const { streak, longest, lastDay } = computeStreak(
            s.streak,
            s.longestStreak,
            s.lastCompletedDay,
            session.status,
          );
          return {
            sessions: [session, ...s.sessions].slice(0, 200),
            streak,
            longestStreak: longest,
            lastCompletedDay: lastDay,
          };
        }),

      clearAll: () =>
        set({ sessions: [], streak: 0, longestStreak: 0, lastCompletedDay: null }),
    }),
    {
      name: "vestibule-stats",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
