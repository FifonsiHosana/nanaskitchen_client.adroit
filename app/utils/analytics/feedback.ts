export interface BadgeConfig {
  label: string;
  color: string; // Maps to text color for high contrast
  bgColor: string; // Maps to badge background tint
}
export const METRIC_CONFIG: Record<string, BadgeConfig> = {
  Price: {
    label: "Price Value",
    color: "var(--price)",
    bgColor: "var(--price-bg)",
  },
  Authenticity: {
    label: "Authenticity",
    color: "var(--authenticity)",
    bgColor: "var(--authenticity-bg)",
  },
  Taste: {
    label: "Taste Profile",
    color: "var(--taste)",
    bgColor: "var(--taste-bg)",
  },
  Quality: {
    label: "Product Quality",
    color: "var(--quality)",
    bgColor: "var(--quality-bg)",
  },
  Packaging: {
    label: "Packaging",
    color: "var(--quality)",
    bgColor: "var(--quality-bg)",
  },
};

// 2. For Marketing & Acquisition Channels
export const CHANNEL_CONFIG: Record<string, BadgeConfig> = {
  "Social Media": {
    label: "Social Media",
    color: "var(--social-media)",
    bgColor: "var(--social-media-bg)",
  },
  "Word of Mouth": {
    label: "Word of Mouth",
    color: "var(--word-of-mouth)",
    bgColor: "var(--word-of-mouth-bg)",
  },
  "Event functions": {
    label: "Event Functions",
    color: "var(--event-functions)",
    bgColor: "var(--event-functions-bg)",
  },
};
