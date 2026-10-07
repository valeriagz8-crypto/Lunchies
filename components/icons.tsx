type IconProps = {
  className?: string;
};

function Svg({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function LeafIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M11 20A7 7 0 0 1 4 13c0-6 7-11 13-11 0 6-2 11-6 15a7 7 0 0 1 0 3Z" />
      <path d="M4 13c4 0 7 3 7 7" />
    </Svg>
  );
}

export function ChefHatIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 18h12v3H6z" />
      <path d="M6 18c-1-3 0-5 1-6-1-2 0-4 2-5 1-2 3-3 5-3s4 1 5 3c2 1 3 3 2 5 1 1 2 3 1 6" />
    </Svg>
  );
}

export function CrownIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m3 7 4 4 5-7 5 7 4-4-2 11H5Z" />
      <path d="M5 21h14" />
    </Svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5 13l4 4L19 7" />
    </Svg>
  );
}

export function PeopleIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M16 14c2.8 0 5 2 5 6" />
    </Svg>
  );
}

export function HouseIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3 11 12 3l9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M9 20v-6h6v6" />
    </Svg>
  );
}

export function CoinIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12h6M12 9v6" />
    </Svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 20V10M12 20V4M20 20v-7" />
    </Svg>
  );
}

export function InfoIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <path d="M12 8h.01" />
    </Svg>
  );
}

export function BookmarkIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M6 3h12v18l-6-4-6 4Z" />
    </Svg>
  );
}

export function ClipboardCheckIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1" />
      <path d="m9 13 2 2 4-4" />
    </Svg>
  );
}

export function MapPinIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.3" />
    </Svg>
  );
}

export function TableIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 4v16" />
    </Svg>
  );
}

export function CreditCardIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </Svg>
  );
}

export function SlidersIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 6h16M4 12h16M4 18h16" />
      <circle cx="9" cy="6" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="1.6" fill="currentColor" stroke="none" />
      <circle cx="7" cy="18" r="1.6" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 20s-7-4.35-9.5-8.5C1 8.3 2.4 5 6 5c2 0 3.3 1 4 2.2C10.7 6 12 5 14 5c3.6 0 5 3.3 3.5 6.5C19 15.65 12 20 12 20Z" />
    </Svg>
  );
}
