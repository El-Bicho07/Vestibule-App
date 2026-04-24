// Design tokens for Vestibule — minimal, architectural
// Palette inspired by weathered stone, ivory walls, and warm wood at dusk.

export const lightTheme = {
  background: "#F5F2EC",
  surface: "#FFFFFF",
  primary: "#2B2A27",
  text: "#1A1917",
  subtext: "#6B675F",
  border: "#E3DED2",
  accent: "#B8855A",
  success: "#5A7A4E",
  danger: "#A14A3A",
} as const;

export const darkTheme = {
  background: "#12110F",
  surface: "#1C1B17",
  primary: "#E8E3D8",
  text: "#EDE8DC",
  subtext: "#8F8A7E",
  border: "#2A2824",
  accent: "#D4A574",
  success: "#8BB17A",
  danger: "#D17A6A",
} as const;

export type ThemeColors = {
  background: string;
  surface: string;
  primary: string;
  text: string;
  subtext: string;
  border: string;
  accent: string;
  success: string;
  danger: string;
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 20,
  full: 9999,
} as const;

export const typography = {
  heading: {
    fontSize: 28,
    fontWeight: "600" as const,
    letterSpacing: -0.5,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: "400" as const,
    letterSpacing: 0.3,
  },
  mono: {
    fontSize: 64,
    fontWeight: "300" as const,
    fontFamily: "Courier",
    letterSpacing: -2,
  },
} as const;

export const getColors = (scheme: "light" | "dark"): ThemeColors =>
  scheme === "dark" ? darkTheme : lightTheme;
