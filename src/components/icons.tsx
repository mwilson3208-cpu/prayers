import type { SVGProps } from "react";

// Simple line icons. Stroke uses currentColor so they follow the theme.
type P = SVGProps<SVGSVGElement>;
const base = (props: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...props,
});

export const LogoMark = (props: P) => (
  <svg {...base(props)} viewBox="0 0 32 32" strokeWidth={1.6}>
    <circle cx="16" cy="16" r="13" opacity=".35" />
    <path d="M16 7v18M10.5 12.5h11" />
    <path d="M4 22c3.5-2.2 7.5-3.3 12-3.3S24.5 19.8 28 22" opacity=".6" />
  </svg>
);
export const HandsIcon = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 21V11.5" />
    <path d="M12 11.5 9.2 4.8a1.4 1.4 0 0 0-2.6 1l1.6 6.2-2.8 4.4a3 3 0 0 0 .4 3.7L7.5 21" />
    <path d="M12 11.5l2.8-6.7a1.4 1.4 0 0 1 2.6 1L15.8 12l2.8 4.4a3 3 0 0 1-.4 3.7L16.5 21" />
  </svg>
);
export const HeartIcon = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </svg>
);
export const SunIcon = (props: P) => (
  <svg {...base(props)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
export const MoonIcon = (props: P) => (
  <svg {...base(props)}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </svg>
);
export const BookIcon = (props: P) => (
  <svg {...base(props)}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z" />
    <path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" />
  </svg>
);
export const PlayIcon = (props: P) => (
  <svg {...base(props)}>
    <path d="M8 5.5v13l10.5-6.5L8 5.5Z" fill="currentColor" stroke="none" />
  </svg>
);
export const ShareIcon = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5" />
    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
  </svg>
);
export const MenuIcon = (props: P) => (
  <svg {...base(props)}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const CheckIcon = (props: P) => (
  <svg {...base(props)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);
export const PhoneIcon = (props: P) => (
  <svg {...base(props)}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);
export const CandleIcon = (props: P) => (
  <svg {...base(props)}>
    <path d="M12 3c1.6 1.8 2 3 2 4a2 2 0 0 1-4 0c0-1 .4-2.2 2-4Z" />
    <path d="M9 11h6v10H9z" />
  </svg>
);
