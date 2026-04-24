// Application-wide configuration

export const DURATION_CHIPS = [25, 45, 60] as const;

export const STREAK_MILESTONES = [3, 7, 21, 60] as const;

export const QUOTE_ROTATION_MS = 12_000;

export const SHORT_RESET_MINUTES = 5;

export const DEFAULT_LABEL = "Deep work";

export const ABANDON_GRACE_SECONDS = 0;

export const MOCK_APPS = [
  { id: "instagram", name: "Instagram", icon: "📷", blocked: true },
  { id: "tiktok", name: "TikTok", icon: "🎵", blocked: true },
  { id: "youtube", name: "YouTube", icon: "▶️", blocked: true },
  { id: "twitter", name: "Twitter / X", icon: "𝕏", blocked: true },
  { id: "reddit", name: "Reddit", icon: "👾", blocked: true },
  { id: "snapchat", name: "Snapchat", icon: "👻", blocked: false },
  { id: "facebook", name: "Facebook", icon: "📘", blocked: true },
  { id: "whatsapp", name: "WhatsApp", icon: "💬", blocked: false },
  { id: "pinterest", name: "Pinterest", icon: "📌", blocked: false },
  { id: "linkedin", name: "LinkedIn", icon: "💼", blocked: false },
  { id: "twitch", name: "Twitch", icon: "🎮", blocked: false },
  { id: "discord", name: "Discord", icon: "🕹️", blocked: false },
  { id: "amazon", name: "Amazon", icon: "🛒", blocked: false },
  { id: "netflix", name: "Netflix", icon: "🎬", blocked: true },
  { id: "spotify", name: "Spotify", icon: "🎧", blocked: false },
  { id: "news", name: "News", icon: "📰", blocked: true },
  { id: "gmail", name: "Gmail", icon: "✉️", blocked: false },
  { id: "messages", name: "Messages", icon: "💭", blocked: false },
] as const;
