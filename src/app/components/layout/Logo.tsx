type LogoProps = {
  className?: string;
};

export default function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 160 40"
      role="img"
      aria-label="Elvira"
      className={className}
      fill="currentColor"
    >
      {/* замени на реальный path из твоего SVG-файла */}
      <path d="/public/logo.svg" />
    </svg>
  );
}
