/** The small orange spark lines the mockup puts next to headings. */
export default function Spark({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`h-5 w-5 text-peach-400 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path d="M12 3v4M19 7l-3 3M21 15h-4" />
    </svg>
  );
}
