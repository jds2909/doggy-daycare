type PawMarkProps = {
  className?: string;
};

export function PawMark({ className = "" }: PawMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="24" cy="30" rx="10.5" ry="9" fill="currentColor" />
      <ellipse cx="11.5" cy="22" rx="5" ry="6.5" fill="currentColor" />
      <ellipse cx="20" cy="12" rx="5" ry="6.5" fill="currentColor" />
      <ellipse cx="36.5" cy="22" rx="5" ry="6.5" fill="currentColor" />
      <ellipse cx="28" cy="12" rx="5" ry="6.5" fill="currentColor" />
    </svg>
  );
}
