import { Session } from "../store/useStatsStore";
import { DAY_LABELS, dayOfWeek, hourOfDay } from "./time";

export interface Insight {
  id: string;
  insight: string;
  meaning: string;
  action: string;
  hasCta?: boolean;
}

export interface WeeklyBar {
  day: string;
  minutes: number;
  isPeak: boolean;
}

export const buildWeeklyChart = (sessions: Session[]): WeeklyBar[] => {
  const totals = new Array(7).fill(0);
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  sessions.forEach((s) => {
    if (s.startTime >= sevenDaysAgo && s.status === "complete") {
      totals[dayOfWeek(s.startTime)] += s.duration / 60;
    }
  });

  const peak = Math.max(...totals);
  return totals.map((minutes, i) => ({
    day: DAY_LABELS[i],
    minutes: Math.round(minutes),
    isPeak: minutes > 0 && minutes === peak,
  }));
};

export const generateInsights = (sessions: Session[]): Insight[] => {
  const insights: Insight[] = [];
  const completed = sessions.filter((s) => s.status === "complete");

  if (completed.length < 3) {
    insights.push({
      id: "early",
      insight: "Your record is still being written",
      meaning: "A few more sessions and patterns will emerge",
      action: "Complete three sessions to unlock insights",
    });
    return insights;
  }

  // Strongest day of week
  const dayTotals = new Array(7).fill(0);
  completed.forEach((s) => {
    dayTotals[dayOfWeek(s.startTime)] += s.duration / 60;
  });
  const peakDay = dayTotals.indexOf(Math.max(...dayTotals));
  if (dayTotals[peakDay] > 0) {
    insights.push({
      id: "peak-day",
      insight: `${DAY_LABELS[peakDay]} is your strongest day`,
      meaning: peakDay >= 4 ? "You focus best end of week" : "You focus best early in the week",
      action: "Schedule your hardest work then",
    });
  }

  // Afternoon drop-off
  const beforeThree = completed.filter((s) => hourOfDay(s.startTime) < 15).length;
  const afterThree = completed.filter((s) => hourOfDay(s.startTime) >= 15).length;
  const beforeRate = beforeThree / (beforeThree + afterThree || 1);
  if (completed.length >= 5 && beforeRate > 0.6) {
    insights.push({
      id: "pm-drop",
      insight: "Focus drops after 3PM",
      meaning: "Energy dips mid-afternoon",
      action: "Start a session before 3PM",
      hasCta: true,
    });
  }

  // Abandonment pattern
  const abandoned = sessions.filter((s) => s.status === "abandoned");
  if (abandoned.length > 0 && abandoned.length / sessions.length > 0.3) {
    insights.push({
      id: "abandon",
      insight: "Many sessions end early",
      meaning: "The current duration may exceed your current attention window",
      action: "Try shorter 25-minute sessions this week",
    });
  }

  // Consistency
  const last7 = completed.filter(
    (s) => s.startTime > Date.now() - 7 * 24 * 60 * 60 * 1000,
  );
  if (last7.length >= 5) {
    insights.push({
      id: "consistency",
      insight: "You're showing up consistently",
      meaning: "Frequency compounds. Depth follows rhythm",
      action: "Keep the current cadence through the weekend",
    });
  }

  return insights;
};

export const mostBlockedApp = (
  apps: { name: string; blocked: boolean }[],
): string | null => {
  const blocked = apps.filter((a) => a.blocked);
  if (blocked.length === 0) return null;
  return blocked[0].name;
};
