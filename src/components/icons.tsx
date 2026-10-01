export function Horseshoe({
  size = 24,
  strokeWidth = 2,
}: {
  size?: number
  strokeWidth?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 21C3.5 17.5 3 12 4.5 8.5 6 5 9 3 12 3s6 2 7.5 5.5C21 12 20.5 17.5 17 21" />
      <path d="M5 21h4M15 21h4" />
      <circle cx="6.5" cy="14" r="0.6" fill="currentColor" />
      <circle cx="17.5" cy="14" r="0.6" fill="currentColor" />
      <circle cx="8" cy="8.5" r="0.6" fill="currentColor" />
      <circle cx="16" cy="8.5" r="0.6" fill="currentColor" />
    </svg>
  )
}
