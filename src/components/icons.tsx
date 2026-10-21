interface IconProps {
  size?: number
}

export function PawIcon({ size = 18 }: IconProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="6" cy="10.5" r="2.1" />
      <circle cx="9.8" cy="6" r="2.1" />
      <circle cx="14.2" cy="6" r="2.1" />
      <circle cx="18" cy="10.5" r="2.1" />
      <path d="M12 12c-2.8 0-5.5 3.4-5.5 5.7 0 1.6 1.3 2.4 2.8 2.4 1.1 0 1.8-.6 2.7-.6s1.6.6 2.7.6c1.5 0 2.8-.8 2.8-2.4 0-2.3-2.7-5.7-5.5-5.7z" />
    </svg>
  )
}

export function CheckIcon({ size = 18 }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}
