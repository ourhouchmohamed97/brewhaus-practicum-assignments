// Small inline SVG icons. They all share the same base so each one is just a path.
function Icon({ size = 18, strokeWidth = 1.7, className = '', children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`shrink-0 ${className}`}
    >
      {children}
    </svg>
  );
}

export const CompassIcon = (p) => (
  <Icon {...p} strokeWidth={1.8}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></Icon>
);
export const ClockIcon = (p) => (
  <Icon {...p} strokeWidth={1.8}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>
);
export const PinIcon = (p) => (
  <Icon {...p} strokeWidth={1.8}><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></Icon>
);
export const CalendarIcon = (p) => (
  <Icon {...p} strokeWidth={1.8}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M8 3v4M16 3v4M3.5 10h17" /></Icon>
);
export const ChevronRightIcon = (p) => (
  <Icon {...p} strokeWidth={2}><path d="m9 6 6 6-6 6" /></Icon>
);
export const GlobeIcon = (p) => (
  <Icon {...p} strokeWidth={1.6}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></Icon>
);
export const ShieldIcon = (p) => (
  <Icon {...p} strokeWidth={1.6}><path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6z" /><path d="m9 12 2 2 4-4" /></Icon>
);
export const StarOutlineIcon = (p) => (
  <Icon {...p} strokeWidth={1.6}><path d="m12 2.8 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.7 6.1 20.8l1.2-6.5L2.5 9.7l6.6-.9z" /></Icon>
);
export const MailIcon = (p) => (
  <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></Icon>
);
export const InstagramIcon = (p) => (
  <Icon {...p}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></Icon>
);
export const TwitterIcon = (p) => (
  <Icon {...p}><path d="M21 6.5c-.7.3-1.4.5-2.2.6.8-.5 1.4-1.2 1.7-2.1-.7.4-1.5.7-2.4.9a3.8 3.8 0 0 0-6.5 3.5C8.5 9.2 5.7 7.7 3.8 5.4c-1 1.700-.5 3.900 1.100 5-.6 0-1.200-.2-1.700-.5 0 1.800 1.300 3.400 3.100 3.800-.5.100-1.100.2-1.700.1.500 1.500 1.900 2.600 3.500 2.600A7.700 7.700 0 0 1 3 18.100a10.800 10.800 0 0 0 5.800 1.700c7 0 10.900-5.900 10.700-11.200.8-.5 1.400-1.200 1.900-2.100z" /></Icon>
);
export const FacebookIcon = (p) => (
  <Icon {...p}><path d="M14 8h2.5V4.5H14a3.5 3.5 0 0 0-3.5 3.5v2H8v3.5h2.5V20H14v-6.5h2.3l.7-3.5H14V8.500c0-.3.200-.5.500-.5z" /></Icon>
);

// Filled star used for ratings. `filled` decides the color.
export function StarIcon({ filled = true, size = 15, className = '' }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={`shrink-0 ${className}`}>
      <path
        d="m12 2.8 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.7 6.1 20.8l1.2-6.5L2.5 9.7l6.6-.9z"
        fill="currentColor"
        className={filled ? 'text-accent' : 'text-gray-300'}
      />
    </svg>
  );
}
