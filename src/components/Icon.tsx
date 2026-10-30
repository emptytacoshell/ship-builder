import type { ReactNode } from 'react';

export type IconName =
  | 'anchor'
  | 'hull'
  | 'sails'
  | 'swords'
  | 'edit'
  | 'flag'
  | 'figurehead'
  | 'crew'
  | 'standing'
  | 'manifest'
  | 'time'
  | 'weather'
  | 'save'
  | 'link'
  | 'download'
  | 'reset'
  | 'plus'
  | 'minus'
  | 'close'
  | 'chevron-down';

const paths: Record<IconName, ReactNode> = {
  anchor: (
    <>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v13m-5-8H4l2 3a7 7 0 0 0 12 0l2-3h-3M8 20h8" />
    </>
  ),
  hull: <path d="M3 14h18l-3 5H7l-4-5Zm3-4h12l3 4H3l3-4Zm2-3h8" />,
  sails: <path d="M12 3v18M11 5 5 17h6V5Zm2 2 6 10h-6V7ZM7 21h10" />,
  swords: <path d="m5 4 15 15M7 3l4 4-4 4-4-4 4-4Zm10 10 4 4-4 4-4-4 4-4ZM4 20l5-5m6-6 5-5" />,
  edit: <path d="m4 16-.8 4.8L8 20l11-11-4-4L4 16Zm9-9 4 4M12 20h8" />,
  flag: <path d="M5 21V4m0 1c5-4 9 4 14 0v10c-5 4-9-4-14 0" />,
  figurehead: <path d="M12 3c-4 0-6 3-6 7 0 2 1 4 3 5v3l3 3 3-3v-3c2-1 3-3 3-5 0-4-2-7-6-7Zm-3 8h.01M15 8l2-2m-8 8 6-2" />,
  crew: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20v-2a6 6 0 0 1 12 0v2H3Zm13-9a3 3 0 1 0 0-6m1 9a5 5 0 0 1 4 5v1h-3" />
    </>
  ),
  standing: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />,
  manifest: <path d="M7 4h13v16H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm0 0v13a3 3 0 0 0 3 3M10 8h7m-7 4h7m-7 4h5" />,
  time: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  weather: (
    <>
      <circle cx="17" cy="7" r="3" />
      <path d="M6 19a4 4 0 0 1-.4-8 6.5 6.5 0 0 1 12.2 1H19a3.5 3.5 0 0 1 0 7H6Z" />
    </>
  ),
  save: <path d="M4 4h13l3 3v13H4V4Zm3 0v6h9V4m-9 16v-7h10v7" />,
  link: <path d="m10 13 4-4m-6 7H6a4 4 0 0 1 0-8h4m4-1h4a4 4 0 0 1 0 8h-4" />,
  download: <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />,
  reset: <path d="M4 10a8 8 0 1 1 1 7m-1-12v5h5" />,
  plus: <path d="M12 5v14m-7-7h14" />,
  minus: <path d="M5 12h14" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      className={className ? `icon ${className}` : 'icon'}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
